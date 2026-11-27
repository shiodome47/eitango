"""6 枚組（文字なし・すき間なしの 3×2 など）の画像を、1 語 1 枚に切り分ける。

使い方:
    python3 scripts/cut_sheet.py シート.webp 出す先のフォルダ 名前1 名前2 … [--cols 3]

名前は、左上から右へ、上の段から下の段へ。Pillow が要る（pip install pillow）。
継ぎ目は、等分の位置のまわりで、となりとの色の差がいちばん大きい線を探す。
"""
import sys
from pathlib import Path
from PIL import Image


def seam(gray, at, size, vertical, reach=12):
    """等分の位置 at のまわりで、継ぎ目らしい線を探す"""
    px = gray.load()
    w, h = gray.size

    def diff(i):
        if vertical:
            return sum(abs(px[i, y] - px[i - 1, y]) for y in range(0, h, 2))
        return sum(abs(px[x, i] - px[x, i - 1]) for x in range(0, w, 2))

    return max(range(max(1, at - reach), min(size - 1, at + reach) + 1), key=diff)


def main():
    args = [a for a in sys.argv[1:]]
    cols = 3
    if '--cols' in args:
        i = args.index('--cols')
        cols = int(args[i + 1])
        del args[i : i + 2]
    sheet, out, names = args[0], Path(args[1]), args[2:]
    rows = -(-len(names) // cols)
    im = Image.open(sheet).convert('RGB')
    w, h = im.size
    gray = im.convert('L')
    xs = [0] + [seam(gray, w * c // cols, w, True) for c in range(1, cols)] + [w]
    ys = [0] + [seam(gray, h * r // rows, h, False) for r in range(1, rows)] + [h]
    out.mkdir(parents=True, exist_ok=True)
    inset = 2  # となりの絵の色がにじんだ線を落とす
    for n, name in enumerate(names):
        r, c = divmod(n, cols)
        box = (xs[c] + (inset if c else 0), ys[r] + (inset if r else 0), xs[c + 1] - (inset if c < cols - 1 else 0), ys[r + 1] - (inset if r < rows - 1 else 0))
        tile = im.crop(box)
        tile.save(out / f'{name}.webp', quality=84, method=6)
        print(f'{name}.webp {tile.size[0]}x{tile.size[1]}')


main()
