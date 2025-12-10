from PIL import Image
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'static', 'images', 'support')
BASE = os.path.normpath(BASE)

target = os.path.join(BASE, 's-1.webp')
sources = ['s-2.webp', 's-7.webp']

if not os.path.exists(target):
    raise SystemExit(f"Target image not found: {target}")

with Image.open(target) as im:
    target_size = im.size

print(f"Target size (from s-1.webp): {target_size}")

for name in sources:
    path = os.path.join(BASE, name)
    if not os.path.exists(path):
        print(f"Skipping {name} — file missing: {path}")
        continue
    try:
        with Image.open(path) as s:
            print(f"Resizing {name}: {s.size} -> {target_size}")
            # convert to RGB if necessary
            if s.mode not in ("RGB", "RGBA"):
                s = s.convert("RGB")
            resized = s.resize(target_size, Image.LANCZOS)
            # overwrite original
            resized.save(path, format='WEBP', quality=90)
            print(f"Saved {path}")
    except Exception as e:
        print(f"Error processing {path}: {e}")

print('Done')
