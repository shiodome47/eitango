import { useEffect, useMemo, useState } from 'react'
import { InstallGuide, LineBanner } from '@shiodome47/pwa-kit'
import { chunkItems, progress, WordGallery, WordSetPicker } from '@shiodome47/word-gallery'
import { loadLearned, loadSet, saveLearned, saveSet } from './storage'
import { WORDS } from './words'

const APP_NAME = '絵で覚える英単語'
/** 1 セットの語数（絵の 6 枚組 2 つぶん） */
const SET_SIZE = 12

export function App() {
  // 覚えた印と、見ているセットは、アプリが持って、アプリが保存する
  const [learned, setLearned] = useState<string[]>(loadLearned)
  useEffect(() => saveLearned(learned), [learned])

  const sets = useMemo(() => chunkItems(WORDS, SET_SIZE), [])
  const [setId, setSetId] = useState<string | null>(loadSet)
  useEffect(() => saveSet(setId), [setId])
  // 覚えていたセットが無くなっていたら「すべて」
  const current = sets.find((s) => s.id === setId)
  const shown = current ? current.items : WORDS

  const all = progress(WORDS, learned)

  return (
    <>
      <LineBanner />
      <main className="app">
        <header className="app__head">
          <h1>{APP_NAME}</h1>
          <p>英検 1 級くらいの動詞 {all.total} 語。絵を押すと、大きな絵と例文が見られます。</p>
          <div className="app__bar" role="img" aria-label={`覚えた ${all.learned} / ${all.total}`}>
            <span style={{ width: `${all.total ? (all.learned / all.total) * 100 : 0}%` }} />
          </div>
          <p className="app__count">
            覚えた {all.learned} / {all.total}
          </p>
        </header>

        <WordSetPicker sets={sets} value={current ? current.id : null} onChange={setSetId} learned={learned} />
        {/* key: セットを変えたら、かくし方・しぼり込み・まぜる、をはじめに戻す */}
        <WordGallery key={current ? current.id : 'all'} items={shown} learned={learned} onLearnedChange={setLearned} />

        <details className="app__install">
          <summary>ホーム画面に追加して、アプリのように使う</summary>
          <InstallGuide appName={APP_NAME} />
        </details>
      </main>
    </>
  )
}
