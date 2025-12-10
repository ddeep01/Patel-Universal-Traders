Convert images to WebP and update templates
=========================================

This helper converts raster images in the `static/` tree to WebP and can optionally update `{% static %}` references in templates to use `.webp` instead of older extensions.

Usage
-----

1. Activate your virtualenv and install dependencies (Pillow is already in `requirements.txt`):

```powershell
python -m pip install -r requirements.txt
```

2. Run the converter (dry run by default -- it will create .webp files):

```powershell
python scripts\convert_images.py --static-dir static --templates-dir templates --quality 82
```

3. If you want to update template references to `.webp` (creates `.bak` backups):

```powershell
python scripts\convert_images.py --static-dir static --templates-dir templates --quality 82 --update-templates
```

Notes
-----
- The script creates `.webp` files next to original images. It does not delete originals.
- When `--update-templates` is used, a backup copy (`.html.bak`) is created for each changed template.
- Review the generated `.webp` files before deploying.
- For best results, consider generating multiple responsive sizes and serving via `srcset`.

If you'd like, I can:
- Create optimized resized variants and generate `srcset` entries in templates automatically.
- Add a management command to run this from Django.
