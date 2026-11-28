#!/bin/bash
# 画像の置き場（shiodome47/eitango-sheets の手元の写し）にあるシートを、まとめて取りこむ。
# 使い方: scripts/add_from_sheets.sh 置き場のフォルダ [--blind 控えを作るフォルダ] [シート番号 …]
#   番号を書かなければ、scripts/sheets.tsv にあって、まだ絵の無い単語があるシートを全部。
#   同じ番号の画像がいくつもあるときは、名前の順でいちばん後ろ（sheet-28-2 など）を使う。
set -e
src=$1; shift
blind=""
if [ "$1" = "--blind" ]; then blind=$2; shift 2; fi
only=" $* "
grep -v '^#' scripts/sheets.tsv | while IFS=$'\t' read -r no words; do
  [ -z "$no" ] && continue
  if [ "$only" != "  " ] && [[ "$only" != *" $no "* ]]; then continue; fi
  file=$(ls "$src" 2>/dev/null | grep -iE "^sheet[-_ ]?0*${no}([-_ .(].*)?\.(png|webp|jpe?g)$" | sort | tail -1)
  [ -z "$file" ] && continue
  if [ "$only" = "  " ]; then
    # 絵の無い単語があるシートだけ。ただし、作り直しで後ろのシートにも書いてある単語は、後ろのシートで取りこむ
    need=0
    for w in $words; do
      grep -q "  [wan]('$w'," src/words.ts || continue  # 単語の一覧から外した語は見ない
      [ -f "public/img/$w.webp" ] && continue
      last=$(grep -v '^#' scripts/sheets.tsv | awk -F'\t' -v w="$w" '{n=split($2,a," "); for(i=1;i<=n;i++) if(a[i]==w) s=$1} END{print s}')
      [ "$last" = "$no" ] && need=1
    done
    [ $need = 0 ] && continue
  fi
  echo "== シート $no ← $file"
  if [ -n "$blind" ]; then scripts/add_sheet.sh "$src/$file" --blind "$blind/$no" $words; else scripts/add_sheet.sh "$src/$file" $words; fi
done
