import { useEffect, useState } from 'react'
import { InstallGuide, LineBanner } from '@shiodome47/pwa-kit'
import { progress, WordGallery } from '@shiodome47/word-gallery'
import { loadLearned, saveLearned } from './storage'
import { WORDS } from './words'

const APP_NAME = '絵で覚える英単語'

export function App() {
  // 覚えた印は、アプリが持って、アプリが保存する
  const [learned, setLearned] = useState<string[]>(loadLearned)
  useEffect(() => saveLearned(learned), [learned])

  const p = progress(WORDS, learned)

  return (
    <>
      <LineBanner />
      <main className="app">
        <header className="app__head">
          <h1>{APP_NAME}</h1>
          <p>英検 1 級くらいの動詞 {p.total} 語。絵を押すと、大きな絵と例文が見られます。</p>
          <div className="app__bar" role="img" aria-label={`覚えた ${p.learned} / ${p.total}`}>
            <span style={{ width: `${p.total ? (p.learned / p.total) * 100 : 0}%` }} />
          </div>
          <p className="app__count">
            覚えた {p.learned} / {p.total}
          </p>
        </header>

        <WordGallery items={WORDS} learned={learned} onLearnedChange={setLearned} />

        <details className="app__install">
          <summary>ホーム画面に追加して、アプリのように使う</summary>
          <InstallGuide appName={APP_NAME} />
        </details>
      </main>
    </>
  )
}
