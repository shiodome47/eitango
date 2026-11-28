"""絵だけで確かめるための準備。取りこみの記録から、名前を伏せた控えを 1 つのフォルダにまとめ、答えの表（key.json）を作る。

使い方:
  scripts/add_from_sheets.sh ../eitango-sheets --blind 控えのフォルダ > 控えのフォルダ/import.log
  python3 scripts/blind_prep.py 控えのフォルダ 控えのフォルダ/import.log
できた all/card-番号.webp を、単語を知らない作業役に見せる。品詞の区切りも表示する。
"""
import re,os,shutil,json,sys
J,log=sys.argv[1],open(sys.argv[2]).read()
pos={}
for m in re.finditer(r"  (?:scene\()?([wan])\('([a-z]+)'",open('src/words.ts').read()): pos[m.group(2)]={'w':'verb','a':'adjective','n':'noun'}[m.group(1)]
out=J+'/all'; os.makedirs(out)
key=[]; i=0
for sheet in sorted([d for d in os.listdir(J) if d.isdigit()],key=int):
    part=log[log.index(f'== シート {sheet} '):].split('== シート')[1]
    for m in re.finditer(r"card-(\d)=([a-z]+)", part):
        i+=1; w=m.group(2); shutil.copy(f'{J}/{sheet}/card-{m.group(1)}.webp', f'{out}/card-{i}.webp'); key.append((i,sheet,w,pos[w]))
json.dump(key,open(J+'/key.json','w'))
print(len(key),'枚', out)
runs=[]; 
for i,_,w,p in key:
    if runs and runs[-1][0]==p: runs[-1][2]=i
    else: runs.append([p,i,i])
print(' / '.join(f'{a}-{b}:{p}' for p,a,b in runs))
print(' '.join(f'{i}={w}' for i,_,w,_ in key))
