#!/usr/bin/env python3
"""Headless screenshot + console-log dump for any local route.

Usage: python scripts/dream_screenshot.py [out_png] [route]
Default out: test-results/dream-iter.png
Default route: /aetherveil
"""
from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "test-results"
OUT.mkdir(exist_ok=True)


def main() -> int:
    out_name = sys.argv[1] if len(sys.argv) > 1 else "dream-iter.png"
    route = sys.argv[2] if len(sys.argv) > 2 else "/aetherveil"
    out_path = OUT / out_name

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1600, "height": 900})
        page = ctx.new_page()

        console_msgs: list[str] = []
        page_errors: list[str] = []
        page.on("console", lambda m: console_msgs.append(f"[{m.type}] {m.text}"))
        page.on("pageerror", lambda e: page_errors.append(str(e)))

        route = route if route.startswith("/") else "/" + route
        page.goto(f"http://localhost:3000{route}", wait_until="networkidle", timeout=60_000)
        # Wait for loading_screen overlay to fully detach (it runs 15s + 800ms + 1.5s transition)
        try:
            page.wait_for_selector(".loading-screen", state="detached", timeout=25_000)
        except Exception as exc:
            print(f"!! loading-screen never detached: {exc}")
        # Let game engine bind + render after loading screen gone
        page.wait_for_timeout(5000)
        # Also wait specifically for a Phaser canvas to appear (best-effort)
        try:
            page.wait_for_selector("canvas", state="attached", timeout=15_000)
            page.wait_for_timeout(1500)  # extra frames
        except Exception:
            pass
        page.screenshot(path=str(out_path), full_page=False)

        def safe(s: str) -> str:
            return s.encode("ascii", "replace").decode("ascii")

        print(f"\n=== SCREENSHOT: {out_path} ===")
        print(f"=== CONSOLE ({len(console_msgs)}) ===")
        for m in console_msgs:
            print(safe(m))
        print(f"=== PAGE ERRORS ({len(page_errors)}) ===")
        for e in page_errors:
            print(safe(e))

        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
