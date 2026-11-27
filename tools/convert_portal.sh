#!/usr/bin/env bash
# Convert an approved 239-frame, 24fps 1600x900 master without modifying the current site.
set -euo pipefail
input=${1:?Usage: convert_portal.sh approved-master.mov new-output-directory}
output=${2:?Provide a NEW output directory}
if [ -e "$output" ]; then echo 'Output must not exist; refusing to overwrite.' >&2; exit 1; fi
python3 - "$input" <<'PY'
import json,subprocess,sys
s=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=width,height,r_frame_rate,nb_read_frames','-of','json',sys.argv[1]]))['streams'][0]
assert (s['width'],s['height'])==(1600,900),s
assert s['r_frame_rate']=='24/1',s
assert int(s['nb_read_frames'])==239,s
PY
mkdir "$output"
ffmpeg -v error -i "$input" -map 0:v:0 -fps_mode passthrough -frames:v 239 -c:v libwebp -quality 90 -compression_level 6 -start_number 0 "$output/%03d.webp"
python3 "$(dirname "$0")/validate_sequences.py" --portal "$output"
printf '%s\n' 'Review forward/reverse motion and identity before copying these frames into assets/portal/.'
