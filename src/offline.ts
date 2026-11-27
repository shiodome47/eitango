import type { Word } from './words'

/**
 * 電波が無くても見られるように、アプリのファイルと絵を、サービスワーカー（public/sw.js）にしまってもらう。
 *
 * - アプリのファイル: 開くたびに（keepShell）
 * - 絵: 開いたセットのぶんを、そのつど（keepWords）。全部を先にしまうこともできる（設定のボタンから）
 *
 * 裏で少しずつ取りに行くので、画面は待たせない。
 */

/** しまう仕事の進み具合 */
export interface KeepProgress {
  /** しらべ終わった数（もうしまってあったものもふくむ） */
  done: number
  total: number
  /** 取りに行けなかった数（電波が無い、など） */
  failed: number
  finished: boolean
}

/** この端末で、しまっておく仕組みが使えるか */
export function canKeep(): boolean {
  return import.meta.env.PROD && 'serviceWorker' in navigator
}

/** アプリのファイル（今のページが読みこんでいるもの） */
function shellUrls(): string[] {
  const files = [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>('script[src], link[rel="stylesheet"][href], link[rel="icon"][href], link[rel="manifest"][href]')]
    .map((el) => ('src' in el ? el.src : el.href))
    .filter(Boolean)
  return ['/', ...files]
}

let nextId = 1

function keep(urls: string[], onProgress?: (p: KeepProgress) => void): void {
  if (!canKeep()) return
  const id = nextId++
  if (onProgress) {
    const listen = (e: MessageEvent) => {
      const d = e.data
      if (!d || d.id !== id || (d.type !== 'precache-progress' && d.type !== 'precached')) return
      const finished = d.type === 'precached'
      onProgress({ done: d.done, total: d.total, failed: d.failed, finished })
      if (finished) navigator.serviceWorker.removeEventListener('message', listen)
    }
    navigator.serviceWorker.addEventListener('message', listen)
  }
  void navigator.serviceWorker.ready.then((reg) => {
    // アプリのファイルはいつも一緒に渡す（サービスワーカーが、使わなくなった古いファイルを捨てられるように）
    reg.active?.postMessage({ type: 'precache', id, urls: [...shellUrls(), ...urls] })
  })
}

const images = (words: readonly Word[]) => words.flatMap((w) => (w.image ? [w.image] : []))

/** アプリのファイルだけをしまう（開いたときに 1 回） */
export function keepShell(): void {
  keep([])
}

/** その単語たちの絵をしまう（セットを開いたとき・全部しまうボタン） */
export function keepWords(words: readonly Word[], onProgress?: (p: KeepProgress) => void): void {
  keep(images(words), onProgress)
}

/** 絵のおおよその大きさ（MB）。1 枚 50KB ほどとして数える */
export function approxMegabytes(words: readonly Word[]): number {
  return Math.max(1, Math.round((images(words).length * 50) / 1000))
}
