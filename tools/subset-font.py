"""重新截取主页用的霞鹜文楷子集。

主页只带了页面上用到的那几百个字（public/assets/lxgw-wenkai-subset.woff2），
新便签里出现没截进去的字时，浏览器会先用后备字体显示。想补上的话：

    pip install fonttools brotli
    # 从 https://github.com/lxgw/LxgwWenKai/releases 下载 LXGWWenKai-Regular.ttf
    python3 tools/subset-font.py path/to/LXGWWenKai-Regular.ttf

它会扫描 public/ 下的 html / js / css，把用到的字重新截成
public/assets/lxgw-wenkai-subset.woff2。字体许可证：SIL OFL 1.1（见 public/assets/LXGW-WenKai-OFL.txt）。
"""
import glob
import os
import sys

from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets", "lxgw-wenkai-subset.woff2")


def main(src):
    text = set()
    for pattern in ("*.html", "*.js", "*.css"):
        for path in glob.glob(os.path.join(ROOT, "public", pattern)):
            with open(path, encoding="utf-8") as f:
                text |= set(f.read())
    text |= {chr(c) for c in range(0x20, 0x7F)}
    text |= set("，。、；：？！“”‘’（）《》「」『』【】—…·～")
    text = {c for c in text if ord(c) >= 0x20}

    opts = subset.Options()
    opts.flavor = "woff2"
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    font = subset.load_font(src, opts)
    sub = subset.Subsetter(opts)
    sub.populate(text="".join(text))
    sub.subset(font)
    subset.save_font(font, OUT, opts)
    print(f"{len(text)} 个字符 → {OUT} ({os.path.getsize(OUT) // 1024} KB)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
