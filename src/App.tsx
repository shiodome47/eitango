import { useEffect, useMemo, useState } from 'react'
import { InstallGuide, LineBanner } from '@shiodome47/pwa-kit'
import { chunkItems, progress, WordGallery, WordSetPicker } from '@shiodome47/word-gallery'
import { approxMegabytes, canKeep, keepWords, type KeepProgress } from './offline'
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

  // 開いたセットの絵は、電波が無くても見られるように、端末にしまっておく（「すべて」のときは、ボタンを押したときだけ）
  useEffect(() => {
    if (current) keepWords(current.items)
  }, [current])
  const [keeping, setKeeping] = useState<KeepProgress | null>(null)

  const all = progress(WORDS, learned)
  // まだ覚え終わっていない、いちばん手前のセット（「つづきのセットへ」のボタンで開く）
  const next = sets.find((set) => progress(set.items, learned).todo > 0)

  return (
    <>
      <LineBanner />
      <main className="app">
        <header className="app__head">
          <h1>{APP_NAME}</h1>
          <p>英検 1 級くらいの単語 {all.total} 語。絵を押すと、大きな絵と例文が見られます。</p>
          <div className="app__bar" role="img" aria-label={`覚えた ${all.learned} / ${all.total}`}>
            <span style={{ width: `${all.total ? (all.learned / all.total) * 100 : 0}%` }} />
          </div>
          <div className="app__row">
            <p className="app__count">
              覚えた {all.learned} / {all.total}
            </p>
            {next && next.id !== current?.id && (
              <button type="button" className="app__button app__button--small" onClick={() => setSetId(next.id)}>
                つづきのセット {next.title} へ
              </button>
            )}
          </div>
        </header>

        <WordSetPicker sets={sets} value={current ? current.id : null} onChange={setSetId} learned={learned} />
        {/* key: セットを変えたら、かくし方・しぼり込み・まぜる、をはじめに戻す */}
        <WordGallery
          key={current ? current.id : 'all'}
          items={shown}
          learned={learned}
          onLearnedChange={setLearned}
          showExampleOnCard={(w) => w.scene === true}
        />

        {/* 見ているセットを全部覚えたら、下にも、つづきへ進むボタンを出す（下まで見終わったところで押せるように） */}
        {current && next && progress(current.items, learned).todo === 0 && (
          <div className="app__done">
            <p>このセットは、全部覚えました。</p>
            <button
              type="button"
              className="app__button"
              onClick={() => {
                setSetId(next.id)
                window.scrollTo({ top: 0 })
              }}
            >
              つづきのセット {next.title} へ
            </button>
          </div>
        )}

        {canKeep() && (
          <details className="app__install">
            <summary>電波が無いところで使う</summary>
            <p>開いたセットの絵は、自動で端末にしまわれて、電波が無くても見られます。まだ開いていないセットも使いたいときは、先に全部しまっておけます。</p>
            <button type="button" className="app__button" disabled={keeping !== null && !keeping.finished} onClick={() => keepWords(WORDS, setKeeping)}>
              全部の絵を端末にしまう（約 {approxMegabytes(WORDS)}MB）
            </button>
            {keeping && (
              <p role="status">
                {!keeping.finished
                  ? `しまっています… ${keeping.done} / ${keeping.total}`
                  : keeping.failed > 0
                    ? `${keeping.failed} 個は、しまえませんでした。電波のあるところで、もう一度押してください。`
                    : '全部しまいました。電波が無くても、全部のセットが見られます。'}
              </p>
            )}
          </details>
        )}

        <details className="app__install">
          <summary>ホーム画面に追加して、アプリのように使う</summary>
          <InstallGuide appName={APP_NAME} />
        </details>
      </main>
    </>
  )
}
