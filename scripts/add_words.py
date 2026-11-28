"""単語をまとめて src/words.ts に足し、scripts/sheets.tsv にシート番号を書き、ChatGPT に渡す文を作る。

使い方: python3 scripts/add_words.py データ.py はじめのシート番号 [作り直す語 …]
  データ.py には V（動詞）・A（形容詞）・Nn（名詞）の一覧を書く。1 行は
  (単語, 意味, 絵文字, 例文, 例文の意味, 絵にする場面)
  作り直す語は、src/words.ts の行をそのまま使って、同じ品詞のシートの先頭に入れる。
  ChatGPT に渡す文は、データ.py の横に .txt で出る（作り直しの行には「(作り直し)」と出るので、理由に書きかえる）。
  重なった単語や、例文に単語が入っていない行があると、何も書かずに止まる。
"""
import re,sys,runpy
d=runpy.run_path(sys.argv[1]); V,A,Nn=d['V'],d['A'],d['Nn']; k0=int(sys.argv[2]); redo=sys.argv[3:] 
q=lambda t: '"'+t+'"' if "'" in t else "'"+t+"'"
p='src/words.ts'; s=open(p).read()
have=set(re.findall(r"  (?:scene\()?[wan]\('([a-z]+)'",s)); new=[r[0] for r in V+A+Nn]
assert len(set(new))==len(new) and not have&set(new), (have&set(new), [w for w in new if new.count(w)>1])
for r in V+A+Nn:
    stem=r[0][:-1].lower(); assert stem in r[3].lower(), ('例文に単語が無い', r[0], r[3])
def rows(f,L): return ''.join('  '+f+'('+', '.join(q(t) for t in r)+'),\n' for r in L)
i=s.rindex(']'); s=s[:i]+f'  // ── シート {k0}〜（動詞 {len(V)}・形容詞 {len(A)}・名詞 {len(Nn)}） ──\n'+rows('w',V)+rows('a',A)+rows('n',Nn)+s[i:]
open(p,'w').write(s)
def old(w):
    m=re.search(r"  (?:scene\()?([wan])\('%s', (.*?)\)\)?,\n"%w,s); f=m.group(1)
    parts=re.findall(r"'((?:[^'\\]|\\.)*)'|\"([^\"]*)\"",m.group(2)); vals=[a or b for a,b in parts]
    return f,(w,vals[0],vals[1],vals[2],vals[3],vals[4])
groups=[('動詞','w',list(V)),('形容詞','a',list(A)),('名詞','n',list(Nn))]
redos=set(redo)
for w in redo:
    f,row=old(w)
    for g in groups:
        if g[1]==f: g[2].insert(0,row)
out=[]; tsv=''; k=k0
for pos,f,L in groups:
    assert len(L)%6==0,(pos,len(L))
    for j in range(len(L)//6):
        out.append(f'■ シート {k}（{pos}。ファイル名: sheet-{k}）')
        for mm,r in enumerate(L[j*6:j*6+6]):
            out.append(f"{mm+1}({['左上','中上','右上','左下','中下','右下'][mm]}){r[0]}|{r[1]}|例文: {r[3]}\n   場面: {r[5]}"+('\n   （作り直し）' if r[0] in redos else ''))
        tsv+=f"{k}\t{' '.join(r[0] for r in L[j*6:j*6+6])}\n"; out.append(''); k+=1
open('scripts/sheets.tsv','a').write(tsv)
open(sys.argv[1].replace('.py','.txt'),'w').write('\n'.join(out).replace('（','(').replace('）',')'))
print('全', len(re.findall(r"  [wan]\('",s)), '語 / シート', k0, '〜', k-1)
