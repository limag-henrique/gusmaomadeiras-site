import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


IDS = [
    0, 4, 5, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
    34, 35, 36, 40, 41, 42, 44, 48, 49, 64, 65, 68, 69, 70, 71, 74, 85,
    86, 87, 88, 89,
]

GROUPS = {
    "doors": [4, 5, 15, 64, 71],
    "rectangular-windows": [0, 21, 28, 29, 30, 32, 48, 49],
    "distinctive-windows": [22, 23, 24, 25, 26, 27, 31, 33, 34, 35, 65, 85, 87, 88, 89],
    "colonial": [36, 68, 69, 70, 74, 86],
    "openings": [40, 41, 42, 44],
}

OUTPUT_DIR = Path("tmp/external-image-review")


def products():
    data = json.loads(Path("data.json").read_text(encoding="utf-8"))
    return [
        product
        for product in data["products"]
        if "/page/" not in product["url"]
        and product["title"].strip().lower() != "produtos"
    ]


def contain(image, size):
    copy = image.convert("RGB")
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, "white")
    x = (size[0] - copy.width) // 2
    y = (size[1] - copy.height) // 2
    canvas.paste(copy, (x, y))
    return canvas


def create_sheets(output_dir, prefix="baseline", source_key="aiImage"):
    output_dir.mkdir(parents=True, exist_ok=True)
    catalog = products()
    font = ImageFont.load_default(size=18)
    small = ImageFont.load_default(size=14)
    rows_per_sheet = 5
    image_size = (360, 360)
    row_height = 430
    sheet_width = image_size[0] * 2 + 40

    for sheet_index, start in enumerate(range(0, len(IDS), rows_per_sheet), 1):
        subset = IDS[start : start + rows_per_sheet]
        sheet = Image.new("RGB", (sheet_width, row_height * len(subset)), "#eeeeee")
        draw = ImageDraw.Draw(sheet)
        for row, product_id in enumerate(subset):
            product = catalog[product_id]
            top = row * row_height
            original = contain(Image.open(product["image"]), image_size)
            generated = contain(Image.open(product[source_key]), image_size)
            sheet.paste(original, (10, top + 58))
            sheet.paste(generated, (370, top + 58))
            draw.text((10, top + 8), f"ID {product_id} — {product['title']}", fill="black", font=font)
            draw.text((10, top + 36), "ORIGINAL", fill="#333333", font=small)
            draw.text((370, top + 36), "IA ATUAL" if prefix == "baseline" else "RESULTADO", fill="#333333", font=small)
        sheet.save(output_dir / f"{prefix}-{sheet_index:02d}.jpg", quality=90)


def print_dimensions():
    catalog = products()
    for product_id in IDS:
        product = catalog[product_id]
        with Image.open(product["image"]) as original, Image.open(product["aiImage"]) as generated:
            print(f"{product_id}\t{original.size}\t{generated.size}\t{product['title']}")


def create_manifest():
    catalog = products()
    group_for_id = {
        product_id: group
        for group, product_ids in GROUPS.items()
        for product_id in product_ids
    }
    manifest = []
    for product_id in IDS:
        product = catalog[product_id]
        paths = [product["image"], *product.get("images", []), product["aiImage"]]
        missing = [path for path in paths if not Path(path).is_file()]
        if missing:
            raise FileNotFoundError(f"ID {product_id}: {missing}")
        with Image.open(product["image"]) as original, Image.open(product["aiImage"]) as current:
            manifest.append(
                {
                    "id": product_id,
                    "title": product["title"],
                    "image": product["image"],
                    "images": product.get("images", []),
                    "aiImage": product["aiImage"],
                    "originalSize": list(original.size),
                    "currentAiSize": list(current.size),
                    "group": group_for_id[product_id],
                    "geometry": "Preserve the exact visible product geometry from the references: outer contour, frame, trim, leaves, panels, glazing, divisions, hardware, wood grain and opening direction.",
                }
            )
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def create_group_review(group):
    catalog = products()
    ids = GROUPS[group]
    image_size = (480, 480)
    row_height = 550
    sheet = Image.new("RGB", (image_size[0] * 2 + 40, row_height * len(ids)), "#eeeeee")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=18)
    small = ImageFont.load_default(size=14)
    for row, product_id in enumerate(ids):
        product = catalog[product_id]
        candidate_path = OUTPUT_DIR / "candidates" / f"id-{product_id:02d}.png"
        if not candidate_path.is_file():
            raise FileNotFoundError(candidate_path)
        top = row * row_height
        original = contain(Image.open(product["image"]), image_size)
        candidate = contain(Image.open(candidate_path), image_size)
        sheet.paste(original, (10, top + 58))
        sheet.paste(candidate, (490, top + 58))
        draw.text((10, top + 8), f"ID {product_id} — {product['title']}", fill="black", font=font)
        draw.text((10, top + 36), "ORIGINAL", fill="#333333", font=small)
        draw.text((490, top + 36), "CANDIDATA", fill="#333333", font=small)
    path = OUTPUT_DIR / f"review-{group}.jpg"
    sheet.save(path, quality=92)
    print(path)


def install_group(group):
    catalog = products()
    for product_id in GROUPS[group]:
        product = catalog[product_id]
        candidate_path = OUTPUT_DIR / "candidates" / f"id-{product_id:02d}.png"
        if not candidate_path.is_file():
            raise FileNotFoundError(candidate_path)
        with Image.open(candidate_path) as candidate:
            candidate.convert("RGB").save(product["aiImage"], "WEBP", quality=92, method=6)
        print(f"installed ID {product_id}: {product['aiImage']}")


if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else "baseline"
    if command == "baseline":
        create_manifest()
        create_sheets(OUTPUT_DIR)
        print_dimensions()
    elif command == "review":
        create_group_review(sys.argv[2])
    elif command == "install":
        install_group(sys.argv[2])
    else:
        raise SystemExit(f"Unknown command: {command}")
