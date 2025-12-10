#!/usr/bin/env python3
"""
Add loading="lazy" and decoding="async" to <img> tags in templates that don't already have them.
Creates a .bak backup for each modified template.

Usage:
  python add_img_attrs.py --templates-dir ../templates
"""
import re
import argparse
from pathlib import Path


IMG_RE = re.compile(r'<img\b(?![^>]*\bloading=)([^>]*)>', flags=re.IGNORECASE)


def process_file(path: Path):
    text = path.read_text(encoding='utf-8')
    new_text, n = IMG_RE.subn(lambda m: '<img' + m.group(1) + ' loading="lazy" decoding="async">', text)
    if n:
        bak = path.with_suffix(path.suffix + '.bak')
        if not bak.exists():
            path.replace(bak)
            # write updated content to original path
            bak.write_text(text, encoding='utf-8')
            path.write_text(new_text, encoding='utf-8')
        else:
            path.write_text(new_text, encoding='utf-8')
        print(f'Updated {path} — added attrs to {n} <img> tags (backup: {bak})')
    return n


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--templates-dir', required=True)
    args = parser.parse_args()
    tpl_dir = Path(args.templates_dir).resolve()
    if not tpl_dir.exists():
        print('Templates directory missing:', tpl_dir)
        return
    total = 0
    for f in tpl_dir.rglob('*.html'):
        total += process_file(f) or 0
    print('Done — total updated img tags:', total)


if __name__ == '__main__':
    main()
