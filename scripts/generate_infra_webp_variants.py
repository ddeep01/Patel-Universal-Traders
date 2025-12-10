"""
generate_infra_webp_variants.py

Usage (from repo root or from `prime_impex`):
  python prime_impex/scripts/generate_infra_webp_variants.py --dir prime_impex/static/images/infra --sizes 480,800,1200 --quality 80

What it does:
- Scans the infra images folder for files named like `infra1.jpg`, `infra2.png`, `infra3.webp`, etc.
- For each base image (infraN), it generates resized WebP variants named `infraN-{width}.webp` for the sizes provided.
- By default it writes files into the same directory next to originals.
- It will skip generation if the target file already exists unless `--force` is provided.

Notes:
- Requires Pillow: `pip install pillow` (project already has Pillow used earlier).
- The script does NOT modify templates; after you run it, templates updated to use `srcset` will reference the generated files.

"""
import argparse
import os
from PIL import Image
import re

DEFAULT_SIZES = [480, 800, 1200]

def find_infra_bases(src_dir):
    # returns dict mapping base (e.g. 'infra1') -> source filepath (first match)
    pattern = re.compile(r'^(infra\d+)\.(jpg|jpeg|png|webp)$', re.IGNORECASE)
    bases = {}
    for fn in os.listdir(src_dir):
        m = pattern.match(fn)
        if m:
            base = m.group(1)
            # prefer the largest file we can find; keep first found for now
            if base not in bases:
                bases[base] = os.path.join(src_dir, fn)
    return bases


def generate_variants(src_path, widths, quality, out_dir, force=False):
    try:
        img = Image.open(src_path)
    except Exception as e:
        print(f"Error opening {src_path}: {e}")
        return []

    # ensure RGB for webp
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")

    base_name = os.path.splitext(os.path.basename(src_path))[0]  # e.g. infra1
    created = []
    for w in widths:
        out_name = f"{base_name}-{w}.webp"
        out_path = os.path.join(out_dir, out_name)
        if os.path.exists(out_path) and not force:
            print(f"Skipping existing: {out_name}")
            continue
        # compute height keeping aspect ratio
        try:
            orig_w, orig_h = img.size
            if orig_w <= w:
                # if original is smaller than target width, still create (optionally resize up)
                resized = img.copy()
            else:
                h = int((w / orig_w) * orig_h)
                resized = img.resize((w, h), Image.LANCZOS)
            # save as webp
            resized.save(out_path, "WEBP", quality=quality, method=6)
            created.append(out_path)
            print(f"Created: {out_name}")
        except Exception as e:
            print(f"Failed to create {out_name}: {e}")
    return created


def main():
    parser = argparse.ArgumentParser(description='Generate resized WebP variants for infra images')
    parser.add_argument('--dir', '-d', default=None, help='Path to infra images directory (defaults to prime_impex/static/images/infra relative to this script)')
    parser.add_argument('--sizes', default=','.join(map(str, DEFAULT_SIZES)), help='Comma-separated list of widths, e.g. 480,800,1200')
    parser.add_argument('--quality', type=int, default=80, help='WebP quality (0-100)')
    parser.add_argument('--force', action='store_true', help='Overwrite existing variants')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be generated without writing files')
    args = parser.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_dir = os.path.normpath(os.path.join(script_dir, '..', 'static', 'images', 'infra'))
    src_dir = os.path.abspath(args.dir) if args.dir else default_dir
    if not os.path.isdir(src_dir):
        print(f"Directory not found: {src_dir}")
        return

    sizes = []
    for s in args.sizes.split(','):
        try:
            sizes.append(int(s.strip()))
        except:
            pass
    if not sizes:
        sizes = DEFAULT_SIZES

    print(f"Scanning: {src_dir}")
    bases = find_infra_bases(src_dir)
    if not bases:
        print("No infra images found with names like infra1.jpg, infra2.png, infra3.webp")
        return

    print(f"Found {len(bases)} infra bases: {', '.join(sorted(bases.keys()))}")
    all_created = []
    for base, path in sorted(bases.items()):
        print(f"Processing {base} -> {os.path.basename(path)}")
        if args.dry_run:
            for w in sizes:
                out_name = f"{base}-{w}.webp"
                print(f"Would create: {out_name}")
            continue
        created = generate_variants(path, sizes, args.quality, src_dir, force=args.force)
        all_created.extend(created)

    print(f"Done. Created {len(all_created)} files.")

if __name__ == '__main__':
    main()
