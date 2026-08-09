#!/usr/bin/env python3
"""Mobile-Audit via CDP (Chrome 9222): 390px-Emulation, Horizontal-Overflow-Check, Screenshots.
Usage: mobile-audit.py <url> [<url> ...] [--out DIR] [--width 390] [--height 844] [--auth user:pass]
Checks: document.documentElement.scrollWidth <= innerWidth; Elemente mit rect.right > innerWidth
        (max 12 gemeldet, mit Tag/Class/Text); Screenshot je URL als PNG.
Exit: 0 = alle PASS, 1 = Overflow gefunden, 2 = Fehler.
"""
import argparse, base64, json, os, sys, time, urllib.request, uuid

def cdp_ws(port=9222):
    req = urllib.request.Request(f"http://127.0.0.1:{port}/json/new?about:blank", method="PUT")
    tab = json.load(urllib.request.urlopen(req, timeout=10))
    return tab["webSocketDebuggerUrl"], tab["id"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("urls", nargs="+")
    ap.add_argument("--out", default="/tmp/mobile-audit")
    ap.add_argument("--width", type=int, default=390)
    ap.add_argument("--height", type=int, default=844)
    ap.add_argument("--auth", default=None)
    ap.add_argument("--wait", type=float, default=4.0)
    ap.add_argument("--port", type=int, default=9222)
    args = ap.parse_args()

    import websocket  # websocket-client
    os.makedirs(args.out, exist_ok=True)
    ws_url, tab_id = cdp_ws(args.port)
    ws = websocket.create_connection(ws_url, timeout=60)
    msg_id = 0
    def cmd(method, params=None):
        nonlocal msg_id
        msg_id += 1
        ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
        while True:
            r = json.loads(ws.recv())
            if r.get("id") == msg_id:
                return r.get("result", {})
    cmd("Page.enable")
    cmd("Runtime.enable")
    cmd("Emulation.setDeviceMetricsOverride", {
        "width": args.width, "height": args.height,
        "deviceScaleFactor": 1, "mobile": False, "screenWidth": args.width, "screenHeight": args.height})
    auth = None
    if args.auth:
        u, p = args.auth.split(":", 1)
        auth = base64.b64encode(f"{u}:{p}".encode()).decode()
    results = []
    for url in args.urls:
        try:
            if auth:
                cmd("Network.enable")
                cmd("Network.setExtraHTTPHeaders", {"headers": {"Authorization": f"Basic {auth}"}})
            cmd("Page.navigate", {"url": url})
            time.sleep(args.wait)
            r = cmd("Runtime.evaluate", {"expression": """
                (() => {
                  const iw = window.innerWidth, sw = document.documentElement.scrollWidth;
                  const docSw = document.body ? document.body.scrollWidth : iw;
                  const overflow = [];
                  for (const el of document.querySelectorAll('*')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.right > iw + 1) {
                      const c = (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : el.tagName;
                      const t = (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 60);
                      overflow.push({tag: el.tagName, cls: c, right: Math.round(rect.right), left: Math.round(rect.left), text: t});
                      if (overflow.length >= 12) break;
                    }
                  }
                  return {iw, scrollW: sw, bodyScrollW: docSw, overflow, title: document.title, url: location.href};
                })()
            """, "returnByValue": True})
            data = r.get("result", {}).get("value", {})
            over = data.get("overflow") or []
            ok = data.get("scrollW", 0) <= data.get("iw", 0) + 1 and data.get("bodyScrollW", 0) <= data.get("iw", 0) + 1
            shot = cmd("Page.captureScreenshot", {"format": "png"})
            fn = os.path.join(args.out, url.replace("https://", "").replace("http://", "").replace("/", "_")[:60] + ".png")
            with open(fn, "wb") as f:
                f.write(base64.b64decode(shot.get("data", "")))
            results.append({"url": url, "ok": ok, "title": data.get("title"), "iw": data.get("iw"),
                            "scrollW": data.get("scrollW"), "bodyScrollW": data.get("bodyScrollW"),
                            "overflow": over[:12], "screenshot": fn})
            print(f"{'PASS' if ok else 'FAIL'} {url} iw={data.get('iw')} scrollW={data.get('scrollW')} body={data.get('bodyScrollW')} overflow={len(over)}")
        except Exception as e:
            results.append({"url": url, "ok": False, "error": str(e)})
            print(f"ERROR {url}: {e}")
    ws.close()
    try:
        urllib.request.urlopen(f"http://127.0.0.1:{args.port}/json/close/{tab_id}", timeout=10)
    except Exception:
        pass
    with open(os.path.join(args.out, "results.json"), "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    fails = [r for r in results if not r.get("ok")]
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    main()
