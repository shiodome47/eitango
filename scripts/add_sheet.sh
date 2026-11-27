#!/bin/bash
# 6 枚組のシートを切り分けて public/img に置き、src/words.ts に絵の場所を足す。
# 使い方: scripts/add_sheet.sh シートの画像 名前1 … 名前6   （左上から右へ、上の段から下の段へ）
# 2 つ目の引数に --blind フォルダ を付けると、名前を伏せて順番をまぜた控えも作る（絵だけで確かめる用）
set -e
sheet=$1; shift
blind=""
if [ "$1" = "--blind" ]; then blind=$2; shift 2; fi
python3 scripts/cut_sheet.py "$sheet" public/img "$@"
python3 - "$@" <<'PY'
import re, sys
p = 'src/words.ts'; s = open(p).read()
for w in sys.argv[1:]:
    line = re.search(r"  [wan]\('%s',.*\),\n" % w, s).group(0)
    if '/img/' not in line:
        s = s.replace(line, line[:-3] + ", '/img/%s.webp'),\n" % w)
open(p, 'w').write(s)
print('絵つき', s.count("'/img/"), '語')
PY
if [ -n "$blind" ]; then
  mkdir -p "$blind"; i=0
  for n in $(printf '%s\n' "$@" | sort -R); do i=$((i+1)); cp public/img/$n.webp "$blind/card-$i.webp"; echo "card-$i=$n"; done
fi
