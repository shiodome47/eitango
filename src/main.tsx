import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { runStartup } from '@shiodome47/pwa-kit'
import '@shiodome47/pwa-kit/style.css'
import '@shiodome47/word-gallery/style.css'
import './app.css'
import { App } from './App'
import { keepShell } from './offline'

// LINE の中で開かれたら外のブラウザへ移るので、そのときは画面を出さない。
// サービスワーカー（電波が無くても見られるようにする）は、公開したものでだけ動かす
if (!runStartup({ serviceWorkerUrl: import.meta.env.PROD ? '/sw.js' : null })) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  keepShell()
}
