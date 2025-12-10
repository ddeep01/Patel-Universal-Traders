#!/usr/bin/env python3
"""
Convert site images to WebP and optionally update template references.

Usage:
  python convert_images.py --static-dir ../static --templates-dir ../templates --quality 80 --update-templates

This script will:
- Walk the `static` directory and create `.webp` versions of .jpg/.jpeg/.png/.tif/.tiff files
- Optionally update `{% static '...filename.ext' %}` occurrences in template files to `.webp` (backups created)

Requires: Pillow
  pip install Pillow

Be cautious: enable `--update-templates` only after reviewing generated webp files.
"""
import argparse
import os
from pathlib import Path
from PIL import Image
import shutil


def convert_image(src_path: Path, quality=80):
    dest = src_path.with_suffix('.webp')
    if dest.exists():
        print(f'Skipping existing: {dest}')
        return dest
    try:
        im = Image.open(src_path)
        # Convert paletted or RGBA to RGBA/RGB appropriately
        if im.mode in ('P', 'RGBA'):
            im = im.convert('RGBA')
        else:
            im = im.convert('RGB')
        dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest, 'WEBP', quality=quality, method=6)
        print(f'Converted: {src_path} -> {dest}');
        return dest
    except Exception as e:
        print(f'Error converting {src_path}: {e}')
        return None


def walk_and_convert(static_dir: Path, quality=80, exts=None):
    exts = exts or {'.jpg', '.jpeg', '.png', '.tif', '.tiff'}
    converted = []
    for root, dirs, files in os.walk(static_dir):
        for f in files:
            p = Path(root) / f
            if p.suffix.lower() in exts:
                dest = convert_image(p, quality=quality)
                if dest:
                    converted.append((p, dest))
    return converted


def update_templates(templates_dir: Path, extensions=None):
    extensions = extensions or ['jpg', 'jpeg', 'png', 'tif', 'tiff']
    # regex-like simple replacement inside {% static '...ext' %}
    files = list(templates_dir.rglob('*.html'))
    for tpl in files:
        text = tpl.read_text(encoding='utf-8')
        original = text
        for ext in extensions:
            # Replace only inside static tag occurrences (avoid f-string braces parsing)
            text = text.replace('.' + ext + "' %}", ".webp' %}")
            text = text.replace('.' + ext + '\" %}', ".webp\" %}")
        if text != original:
            bak = tpl.with_suffix(tpl.suffix + '.bak')
            if not bak.exists():
                shutil.copy2(tpl, bak)
            tpl.write_text(text, encoding='utf-8')
            print(f'Updated template: {tpl} (backup: {bak})')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--static-dir', required=True, help='Path to static directory')
    parser.add_argument('--templates-dir', required=True, help='Path to templates directory')
    parser.add_argument('--quality', type=int, default=80, help='WebP quality (0-100)')
    parser.add_argument('--update-templates', action='store_true', help='Replace image extensions in templates to .webp (creates backups)')
    args = parser.parse_args()

    static_dir = Path(args.static_dir).resolve()
    templates_dir = Path(args.templates_dir).resolve()

    if not static_dir.exists():
        print('Static directory not found:', static_dir)
        return
    if not templates_dir.exists():
        print('Templates directory not found:', templates_dir)
        return

    print('Converting images in', static_dir)
    converted = walk_and_convert(static_dir, quality=args.quality)
    print(f'Converted {len(converted)} files')

    if args.update_templates:
        print('Updating templates to reference .webp files')
        update_templates(templates_dir)

    print('Done')


if __name__ == '__main__':
    main()
