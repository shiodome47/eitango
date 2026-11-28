"""会話の場面の絵（抽象的な語）を確かめるための準備。

絵だけでは当てられない語なので、絵と「その語をぬいたせりふ」を組にして、単語を知らない作業役に見せる。
使い方:
  scripts/add_from_sheets.sh ../eitango-sheets --blind 控えのフォルダ > 控えのフォルダ/import.log
  python3 scripts/blind_kaiwa.py 控えのフォルダ 控えのフォルダ/import.log
できた all/card-番号.webp と、ならんで出る「card-番号: ＿＿＿ をふくむせりふ」を、作業役に見せる。
"""
import json, os, re, shutil, sys

J, log = sys.argv[1], open(sys.argv[2]).read()
words = {}
for m in re.finditer(r"  (?:scene\()?([wan])\('([a-z]+)', (.*?)\)\)?,\n", open('src/words.ts').read()):
    vals = [a or b for a, b in re.findall(r"'((?:[^'\\]|\\.)*)'|\"([^\"]*)\"", m.group(3))]
    words[m.group(2)] = {'pos': {'w': 'verb', 'a': 'adjective', 'n': 'noun'}[m.group(1)], 'example': vals[2]}

def blank(word, sentence):
    # 活用した形（-ed・-ing・-s など）もまとめて ＿＿＿ にする
    stem = word[:-1] if word.endswith('e') else word
    return re.sub(r'\b%s\w*' % re.escape(stem), '＿＿＿', sentence, flags=re.I)

out = J + '/all'
os.makedirs(out)
key, lines, i = [], [], 0
for sheet in sorted([d for d in os.listdir(J) if d.isdigit()], key=int):
    part = log[log.index(f'== シート {sheet} '):].split('== シート')[1]
    for m in re.finditer(r'card-(\d)=([a-z]+)', part):
        i += 1
        w = m.group(2)
        shutil.copy(f'{J}/{sheet}/card-{m.group(1)}.webp', f'{out}/card-{i}.webp')
        key.append((i, sheet, w, words[w]['pos']))
        lines.append(f"card-{i} ({words[w]['pos']}): {blank(w, words[w]['example'])}")
json.dump(key, open(J + '/key.json', 'w'))
open(J + '/lines.txt', 'w').write('\n'.join(lines) + '\n')
print(len(key), '枚', out)
print('\n'.join(lines))
print(' '.join(f'{i}={w}' for i, _, w, _ in key))
