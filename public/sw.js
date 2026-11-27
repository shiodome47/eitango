// サービスワーカー: 電波が無くても、アプリと絵が見られるようにする。
//
// - ページ（index.html）: まず通信。だめなら、しまってあるもの
// - /assets/（ビルドのたびに名前が変わるファイル）: しまってあるものを使う
// - /img/（絵）とそのほか: しまってあるものをすぐ出し、裏で新しいものに取り替える（作り直した絵は、次に開いたときに変わる）
// - アプリから「これをしまっておいて」（precache）と言われたものを、裏でしまう（アプリのファイル・開いたセットの絵・全部の絵）。
//   使わなくなった /assets/ は捨てる。とちゅうの進み具合と、終わったことを、アプリに知らせる
const CACHE = 'eitango-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name !== CACHE && name.startsWith('eitango-')) await caches.delete(name)
      await self.clients.claim()
    })(),
  )
})

// しまってあるものを探す。サーバーが付ける Vary（圧縮のしかたなど）のちがいでは、別物あつかいしない
const find = (req) => caches.match(req, { ignoreVary: true })

const ok = (res) => res && res.ok && res.type === 'basic'

async function put(req, res) {
  if (ok(res)) await (await caches.open(CACHE)).put(req, res.clone())
  return res
}

async function networkFirst(req) {
  try {
    return await put(req, await fetch(req))
  } catch (err) {
    const hit = (await find(req)) || (await find('/'))
    if (hit) return hit
    throw err
  }
}

async function cacheFirst(req) {
  return (await find(req)) || put(req, await fetch(req))
}

async function staleWhileRevalidate(req, e) {
  const hit = await find(req)
  const fresh = fetch(req)
    .then((res) => put(req, res))
    .catch(() => undefined)
  if (hit) {
    e.waitUntil(fresh)
    return hit
  }
  const res = await fresh
  if (res) return res
  throw new Error('offline')
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return
  if (req.mode === 'navigate') e.respondWith(networkFirst(req))
  else if (url.pathname.startsWith('/assets/')) e.respondWith(cacheFirst(req))
  else e.respondWith(staleWhileRevalidate(req, e))
})

self.addEventListener('message', (e) => {
  const data = e.data
  if (!data || data.type !== 'precache' || !Array.isArray(data.urls)) return
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      const want = [...new Set(data.urls.map((u) => new URL(u, self.location.origin).href))]
      const shell = new Set(want.filter((u) => new URL(u).pathname.startsWith('/assets/')))
      // 今のビルドで使っていない /assets/ を捨てる（絵は捨てない）
      if (shell.size > 0) {
        for (const req of await cache.keys()) {
          if (new URL(req.url).pathname.startsWith('/assets/') && !shell.has(req.url)) await cache.delete(req)
        }
      }
      // まだしまっていないものを、4 つずつ取りに行く（1 つ失敗しても、ほかは続ける）
      let done = 0
      let failed = 0
      const tell = (type) => e.source && e.source.postMessage({ type, id: data.id, done, total: want.length, failed })
      const queue = [...want]
      const worker = async () => {
        for (let href = queue.shift(); href; href = queue.shift()) {
          try {
            if (!(await cache.match(href, { ignoreVary: true }))) {
              const res = await fetch(href)
              if (ok(res)) await cache.put(href, res)
              else failed++
            }
          } catch {
            failed++ // 電波が無いときは、次に開いたときにまた試す
          }
          done++
          if (done % 12 === 0) tell('precache-progress')
        }
      }
      await Promise.all([worker(), worker(), worker(), worker()])
      tell('precached')
    })(),
  )
})
