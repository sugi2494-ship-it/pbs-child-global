#!/usr/bin/env python3
"""인스타그램 자동 게시 (Meta Graph API, 표준 라이브러리만 사용).

환경 변수:
  IG_ACCESS_TOKEN  필수. 60일 장기 토큰.
  IG_API_HOST      선택. 기본 graph.instagram.com (Instagram 로그인 방식).
                   페이스북 페이지 방식이면 graph.facebook.com
  IG_USER_ID       선택. 비우면 /me 로 자동 조회.

사용법:
  python3 marketing/publish/ig_publish.py check          토큰·계정 확인
  python3 marketing/publish/ig_publish.py due            예약 시각 지난 항목 게시
  python3 marketing/publish/ig_publish.py post <id>      특정 항목 즉시 게시
  python3 marketing/publish/ig_publish.py refresh        토큰 60일 연장 (새 토큰 출력)
"""
import json, os, sys, time, urllib.parse, urllib.request, urllib.error
from datetime import datetime, timezone

HOST = os.environ.get("IG_API_HOST", "graph.instagram.com")
VER = "v21.0"
TOKEN = os.environ.get("IG_ACCESS_TOKEN", "")
QUEUE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "queue.json")


def api(method, path, **params):
    params["access_token"] = TOKEN
    url = f"https://{HOST}/{VER}/{path.lstrip('/')}"
    data = urllib.parse.urlencode(params).encode()
    if method == "GET":
        url += "?" + data.decode()
        req = urllib.request.Request(url)
    else:
        req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise SystemExit(f"API 오류 {e.code} {path}: {body}")


def require_token():
    if not TOKEN:
        raise SystemExit("IG_ACCESS_TOKEN 이 없습니다. marketing/publish/META_TOKEN_GUIDE.md 의 '토큰을 넣는 자리' 참고.")


def user_id():
    uid = os.environ.get("IG_USER_ID")
    if uid:
        return uid
    if HOST == "graph.instagram.com":
        me = api("GET", "me", fields="user_id,username")
        return str(me.get("user_id") or me.get("id"))
    # 페이스북 페이지 방식: 페이지에 연결된 IG 계정 찾기
    pages = api("GET", "me/accounts", fields="name,instagram_business_account")
    for p in pages.get("data", []):
        ig = p.get("instagram_business_account")
        if ig:
            return ig["id"]
    raise SystemExit("페이지에 연결된 인스타그램 비즈니스 계정을 찾지 못했습니다.")


def check():
    require_token()
    uid = user_id()
    info = api("GET", uid, fields="username,name,followers_count,media_count")
    print("연결 확인 ✅")
    for k in ("username", "name", "followers_count", "media_count"):
        if k in info:
            print(f"  {k}: {info[k]}")
    print(f"  user_id: {uid}")
    limit = api("GET", f"{uid}/content_publishing_limit", fields="quota_usage,config")
    if limit.get("data"):
        d = limit["data"][0]
        print(f"  오늘 사용한 게시 한도: {d.get('quota_usage')} / {d.get('config', {}).get('quota_total')}")


def wait_ready(container_id, max_wait=600):
    """릴스·동영상은 서버 처리 후에만 발행 가능. FINISHED 될 때까지 대기."""
    t0 = time.time()
    while time.time() - t0 < max_wait:
        st = api("GET", container_id, fields="status_code,status")
        code = st.get("status_code")
        if code == "FINISHED":
            return
        if code == "ERROR":
            raise SystemExit(f"미디어 처리 실패: {st}")
        time.sleep(10)
    raise SystemExit("미디어 처리 대기 시간 초과")


def create_container(uid, item):
    t = item["type"]
    urls = item["media_urls"]
    caption = item.get("caption", "")
    if t == "image":
        return api("POST", f"{uid}/media", image_url=urls[0], caption=caption)["id"]
    if t == "reel":
        p = dict(media_type="REELS", video_url=urls[0], caption=caption, share_to_feed="true")
        if item.get("cover_url"):
            p["cover_url"] = item["cover_url"]
        cid = api("POST", f"{uid}/media", **p)["id"]
        wait_ready(cid)
        return cid
    if t == "carousel":
        children = []
        for u in urls:
            if u.lower().endswith(".mp4"):
                c = api("POST", f"{uid}/media", media_type="VIDEO", video_url=u, is_carousel_item="true")["id"]
                wait_ready(c)
            else:
                c = api("POST", f"{uid}/media", image_url=u, is_carousel_item="true")["id"]
            children.append(c)
        return api("POST", f"{uid}/media", media_type="CAROUSEL", children=",".join(children), caption=caption)["id"]
    if t == "story":
        if urls[0].lower().endswith(".mp4"):
            cid = api("POST", f"{uid}/media", media_type="STORIES", video_url=urls[0])["id"]
            wait_ready(cid)
            return cid
        return api("POST", f"{uid}/media", media_type="STORIES", image_url=urls[0])["id"]
    raise SystemExit(f"지원하지 않는 type: {t}")


def publish_item(uid, item):
    for u in item["media_urls"]:
        if "REPLACE-WITH" in u:
            raise SystemExit(f"[{item['id']}] media_urls 에 실제 공개 URL을 넣어 주세요.")
    cid = create_container(uid, item)
    res = api("POST", f"{uid}/media_publish", creation_id=cid)
    media_id = res["id"]
    link = api("GET", media_id, fields="permalink").get("permalink", "")
    return media_id, link


def load_queue():
    with open(QUEUE, encoding="utf-8") as f:
        return json.load(f)


def save_queue(q):
    with open(QUEUE, "w", encoding="utf-8") as f:
        json.dump(q, f, ensure_ascii=False, indent=2)


def run(selector):
    require_token()
    uid = user_id()
    q = load_queue()
    now = datetime.now(timezone.utc)
    done = 0
    for item in q["items"]:
        if item.get("status") != "pending":
            continue
        if selector == "due":
            at = datetime.fromisoformat(item["scheduled_at"])
            if at > now:
                continue
        elif item["id"] != selector:
            continue
        print(f"게시 중: {item['id']} ({item['type']})")
        try:
            media_id, link = publish_item(uid, item)
        except SystemExit as e:
            item["status"] = "failed"
            item["error"] = str(e)
            save_queue(q)
            print(f"  실패: {e}")
            continue
        item["status"] = "published"
        item["published_at"] = datetime.now().astimezone().isoformat(timespec="seconds")
        item["media_id"] = media_id
        item["permalink"] = link
        save_queue(q)
        done += 1
        print(f"  완료 ✅ {link}")
    if done == 0:
        print("게시할 항목이 없습니다.")


def refresh():
    require_token()
    if HOST == "graph.instagram.com":
        url = f"https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={TOKEN}"
    else:
        app_id, secret = os.environ.get("FB_APP_ID"), os.environ.get("FB_APP_SECRET")
        if not (app_id and secret):
            raise SystemExit("페이스북 방식 갱신에는 FB_APP_ID, FB_APP_SECRET 이 필요합니다.")
        url = (f"https://graph.facebook.com/{VER}/oauth/access_token?grant_type=fb_exchange_token"
               f"&client_id={app_id}&client_secret={secret}&fb_exchange_token={TOKEN}")
    with urllib.request.urlopen(url, timeout=60) as r:
        res = json.load(r)
    days = int(res.get("expires_in", 0)) // 86400
    print(f"새 토큰 (약 {days}일 유효). 환경 설정의 IG_ACCESS_TOKEN 값을 아래로 교체하세요:")
    print(res["access_token"])


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd == "check":
        check()
    elif cmd == "due":
        run("due")
    elif cmd == "post" and len(sys.argv) > 2:
        run(sys.argv[2])
    elif cmd == "refresh":
        refresh()
    else:
        print(__doc__)
