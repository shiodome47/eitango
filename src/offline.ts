import { WORDS } from './words'

/**
 * 電波が無くても見られるように、アプリのファイルと全部の絵を、サービスワーカーにしまってもらう。
 * 画面を出したあとに呼ぶ（裏で少しずつ取りに行くので、画面は待たせない）。
 */
export function keepForOffline(): void {
  if (!('serviceWorker' in navigator)) return
  void navigator.serviceWorker.ready.then((reg) => {
    const files = [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>('script[src], link[rel="stylesheet"][href], link[rel="icon"][href], link[rel="manifest"][href]')]
      .map((el) => ('src' in el ? el.src : el.href))
      .filter(Boolean)
    const images = WORDS.flatMap((w) => (w.image ? [w.image] : []))
    reg.active?.postMessage({ type: 'precache', urls: ['/', ...files, ...images] })
  })
}
