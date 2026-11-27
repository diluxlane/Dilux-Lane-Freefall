#!/usr/bin/env python3
"""Validate original intro integrity and replacement portal specifications."""
import argparse, hashlib, json
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser(); p.add_argument('--portal', type=Path, default=root/'assets/portal');args=p.parse_args()
manifest=json.loads((root/'docs/source-sha256.json').read_text())
for directory,count,size in [(root/'assets/fall',465,(720,1280)),(args.portal,239,(1600,900))]:
    paths=sorted(directory.glob('*.webp'))
    assert [f.name for f in paths]==[f'{i:03}.webp' for i in range(count)],f'Invalid sequence: {directory}'
    for f in paths:
        with Image.open(f) as im:
            assert im.size==size,(str(f),im.size)
            im.load()
        if directory==root/'assets/fall':
            assert hashlib.sha256(f.read_bytes()).hexdigest()==manifest[f'assets/fall/{f.name}'],f'Intro modified: {f}'
    print(f'PASS {directory.name}: {count} valid frames, {size}')
print('PASS intro SHA-256 integrity; portal visual likeness/continuity still requires human review')
