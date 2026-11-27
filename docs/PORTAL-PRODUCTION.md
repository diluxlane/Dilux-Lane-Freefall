# Portal likeness production — PENDING / release blocker

The retained character is from the original source and is **not Dilux Lane**. The website is review-only, has noindex metadata, and must not be approved as a completed personalized public release. No identity-preserving video tool is available in this environment. Still-image generation is not an adequate substitute for temporally consistent editing.

## Authorized reference and limitations

Inspected `Dilux-Lane-Profile/public/assets/portrait.webp` (512 × 512), the approved public front-facing portrait. It supplies an identity reference, but its bright frontal lighting and single angle do not establish consistent side views or body proportions across the portal shot. Do not invent those details. A production editor should first test this reference; request a short neutral head-turn clip or one additional three-quarter portrait only if that test demonstrates it is necessary. Do not use unrelated private photographs. Preserve actual age, skin tone, facial features and proportions.

## Exact shot brief

Reconstruct the original reference from assets/portal/000.webp through 238.webp at 24 fps. Preserve the illuminated doorway, clouds, atmosphere, orange/gold light, lightning, camera movement, composition and character motion. Replace only the character's likeness using a temporally tracked mask/composite and an authorized identity-preserving video workflow. Preserve clothing and shot timing; match facial illumination and perspective. Keep all HTML text and interface effects out of the video. Review the approach-to-camera and close-up especially carefully; reject facial drift, changing hair, age changes, warped anatomy, environmental drift, flicker or boundary artifacts.

## Deliverable contract

- 239 consecutive WebP files, exactly `000.webp`–`238.webp`, 1600 × 900, RGB/sRGB, no alpha required.
- Master: exactly 239 frames at constant 24 fps (9.958333 seconds), 1600 × 900; lossless or high-quality intraframe MOV preferred. No inserted titles, audio requirement, crop, letterboxing, new frames or fades.
- Keep the original frame-to-scroll map (0.02–0.76), PORTAL_N, 640vh section, canvas renderer, parallax, tunnel and CTA timing unchanged.
- Deliver master, frames, editor/version/settings, reference authorization record and review notes. No claims of likeness completion until the user approves.

## Reproducible conversion

Requires FFmpeg/ffprobe, Python 3 and Pillow (`python -m pip install Pillow`). From repository root:

```sh
ffmpeg -framerate 24 -start_number 0 -i assets/portal/%03d.webp -frames:v 239 -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le portal-reference.mov
bash tools/convert_portal.sh approved-master.mov portal-candidate
python tools/validate_sequences.py --portal portal-candidate
```

The conversion script rejects wrong size, frame rate and frame count, and refuses an existing output directory. Review every frame in forward/reverse playback, then scrub the candidate in a separate local checkout at desktop and portrait viewports. Compare background pixels and subject edges with the original. The validator checks structure and unchanged intro hashes; it cannot certify likeness or continuity. Only after approval copy candidate files to `assets/portal/`, rerun validation, update status/noindex and commit on a review branch. No website engine rewrite is needed.
