# Verification — 2026-11-27

## Status

| Area | Result | Evidence / limitation |
|---|---|---|
| Pinned source transfer | PASS | 715 files, 67,242,570 bytes; remote baseline tree identical to pinned checkout |
| Intro integrity | PASS | All 465 SHA-256 hashes unchanged; 720 × 1280; ordered names 000–464 |
| Portal structural integrity | PASS | Original 239 frames unchanged; 1600 × 900; 000–238 |
| Personalized portal likeness | PENDING | Original character retained for review, not Dilux Lane; blocks completed public release |
| Identity and projects | PASS | Genuine public identity, four cases, project-derived media, approved destinations; no invented client outcomes |
| Responsive viewport checks | PASS | Ten representative sizes; no horizontal overflow; portrait name wrap fixed and retested at 360, 390 and 412 widths |
| Visual fidelity | PARTIAL | 12 matched desktop checkpoints; comparison sheets reviewed; no whole-page pixel-perfect claim |
| Functional checks | PARTIAL | Core entry/navigation/scroll/restart/clock/failure paths checked; physical-device audio and exhaustive keyboard navigation not certified |
| Performance | PARTIAL | Actual headless measurements below; physical phones, Safari and Firefox not tested |
| Deployment / merge | NOT PERFORMED | No Vercel project, deployment or connection created; PR remains review-only |

## Source changes

Only four original files differ from the pinned source: `README.md`, `index.html`, `css/style.css`, `js/main.js`. Every other original tracked file remains byte-identical, including all 704 frames and original showcase resources. Added files contain project media, favicon, documentation and QA/production tools. `docs/source-sha256.json` records the complete original SHA-256 manifest.

CSS changes: identity comment and portrait hero font size 27vw → 25vw to accommodate DILUX as one word while retaining the two-line name. All original CSS color tokens, font families/variation settings, section structure and cinematic layout remain. Short capability labels fit the original five rows. Technical JS changes: idempotent 15-second per-image timeout, 15-second entry-control fallback from loader initialization, hidden menu inert state/focus return, Sri Lanka timezone and copy-profile feedback. Original coarse-to-fine strategy, neighbor fallback, blending, DPR limits, FRAME_KEYS, CUT, SHOCK, portal mapping and 640vh height are unchanged. No speculative cache rewrite was made.

## Browser coverage and actual results

Chromium headless, deviceScaleFactor 1, local HTTP, original Google Fonts and Lenis loaded through the environment's proxy. These are browser viewport tests, not physical Redmi/iPhone/foldable tests. A first diagnostic with unavailable external resources was discarded; final recorded viewport runs have no failed requests, HTTP errors or JavaScript errors. Test-only certificate handling was needed for the proxy and is not part of the website.

| Viewport | Loader ready ms | rAF median ms | rAF p95 ms |
|---|---:|---:|---:|
| 360 × 800 | 6046 | 16.7 | 16.8 |
| 412 × 915 | 5210 | 16.7 | 16.7 |
| 390 × 844 | 5710 | 16.7 | 16.8 |
| 540 × 720 | 5950 | 16.7 | 16.7 |
| 768 × 1024 | 7850 | 16.7 | 33.4 |
| 1024 × 768 | 5601 | 16.7 | 33.4 |
| 844 × 390 | 5087 | 16.7 | 16.8 |
| 1440 × 900 | 7091 | 16.7 | 50.1 |
| 1920 × 1080 | 7911 | 33.3 | 66.7 |
| 2560 × 1080 | 5663 | 33.4 | 83.4 |

Timing is a 90-frame sample after the skip interaction, with no device/network throttling; it is not a complete scroll benchmark. Large viewports show dropped frames in this software-rendered environment. This does not establish physical-device performance. Loader times include external dependency latency.

The final full-resource measurement recorded all 704 frame responses, 712 resource entries and 21,459,834 encoded resource bytes for the implementation (original: 21,140,229). Cross-origin resources without Timing-Allow-Origin may report zero, so this is not a complete wire-byte count. The earlier viewport report's resource timing buffer capped at 250 entries; use `final-checks.json` for payload evidence. `performance.memory` returned quantized 10 MB values in that run and is not a decoded-memory measurement. Fully decoded RGBA frames would occupy approximately 3.10 GB before additional buffers; browsers may evict decoded surfaces. No physical memory-pressure/low-RAM test was possible, and stable mobile memory is not claimed.

## Functional evidence

- Normal silent entry, sound toggle on/off, sound-enabled entry and reduced-motion detection passed. Actual audible headphone output was not listened to.
- Menu open/close and Escape behavior passed at all ten sizes. Hidden links are inert; focus enters the menu and returns to its trigger. Exhaustive keyboard/screen-reader testing remains pending.
- Skip-to-work reached scrollY 15300, matching the work section's offset. Restart returned to 0.
- Four case screens, index tiles, About, marquee, capability preview, portal and contact were captured. Repository CTA URLs and tile case indices were statically checked; no external messages were sent.
- All intro requests aborted: loader still allowed sound-enabled entry. All intro requests deliberately stalled: entry became available in 21,621 ms from navigation, including external script latency before the 15-second fallback began.
- Original and implementation intro canvas hashes matched at normalized progress 0.3 and 0.6.
- Portal forward 0.35 → 0.68 → reverse 0.35 returned identical canvas hashes within each version. Cross-version portal hashes differed, so pixel identity is not claimed; assets and renderer remain identical, and matched screenshots were visually checked. Different preceding content height/scroll rounding can affect fractional sampling.
- Asia/Colombo clock checked against Intl; it updates on the original 15-second cadence, so a minute-boundary sample can be one tick behind.
- Final mobile name retest confirms exactly two rows with all letters inside the viewport (`final-checks.json`). The first three entries of `results.json` preserve the pre-fix wrap finding and are superseded by that retest.

Touch emulation (412 × 915, hasTouch/isMobile) passed menu taps, skip-to-work at 15555 matching its target, and clipboard verification of `https://dilux-lane-profile.vercel.app`. CDP measured JSHeapUsedSize 2,707,760 bytes and JSHeapTotalSize 5,562,368 bytes; these exclude decoded image/GPU memory. See `qa/touch-checks.json`.

## Visual evidence

- [Cinematic checkpoints](qa/comparison-cinematics.webp): original on left, personalized on right.
- [Content checkpoints](qa/comparison-content.webp): original on left, personalized on right.
- [Mobile review](qa/mobile-review.webp): corrected hero, real project card and touch capability section.

Intentional differences are identity, text, project media, contacts and portrait name fit. Grain, pointer parallax and fractional scroll sampling prevent an unqualified pixel-perfect statement. Neutral source story language and original lighting/framing remain intact.

## Remaining review

Personalized portal master and approval; physical-device touch/scroll, headphones and memory testing; broader Safari/Firefox and assistive-technology coverage. Repository About description was not updated because the available GitHub connector exposes no repository-metadata write tool; README and page metadata are personalized. Proposed deployment URL is not verified live.

## Reproducing browser checks

Use sibling directories named `original` (pinned upstream checkout) and `implementation` (this branch). Install Playwright in your test environment and set BROWSER_PATH to a Chromium executable. Start `python3 -m http.server 8000` from their parent; run `node implementation/tools/browser-qa.cjs`, `node implementation/tools/interaction-qa.cjs` and `node implementation/tools/touch-qa.cjs` from that parent. Proxy settings are optional. Screenshot files are generated under docs/qa; committed WebP sheets summarize the reviewed captures.
