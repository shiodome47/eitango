# eitango — 絵で覚える英単語

絵を見て英単語を覚えるアプリです（英検 1 級くらいの単語）。

- 絵・単語・意味のカードが並ぶ。意味（または単語）をかくして、タップで見る
- 絵を押すと、大きな絵と例文。読み上げ・覚えた印・しぼり込み・まぜる
- 12 語ずつのセットに分かれていて、上の帯で選ぶ（セットごとの進み具合つき）
- ホーム画面に追加して、アプリのように使える。開いたセットは、電波が無くても絵と単語が見られる

## 使っている部品

| 部品 | 何に使っているか |
|---|---|
| `@shiodome47/word-gallery` | カードの画面（並べる・かくす・くわしい画面・読み上げ・覚えた印・セットを選ぶ帯） |
| `@shiodome47/pwa-kit` | ホーム画面に追加する案内・LINE の中のブラウザ対策 |

部品の一覧は [shiodome47/catalog](https://github.com/shiodome47/catalog) の `CATALOG.md`。

## 電波が無いとき（`public/sw.js`）

- アプリのファイルは、開くたびに端末にしまう
- 絵は、**開いたセットのぶん**を、そのつど端末にしまう（全部を一度にしまうと、語数が増えたときに重くなるため）
- 画面のいちばん下の「電波が無いところで使う」から、全部の絵を先にしまっておくこともできる

頼むのは `src/offline.ts`、しまうのは `public/sw.js`。
作り直した絵は、次の次に開いたときに変わります（しまってあるものをすぐ出して、裏で取り替えるため）。
`npm run dev` では動きません。確かめるときは `npm run build` のあと `npm run preview`。

## 動かす

```bash
npm install
npm run dev
```

確かめる: `npm run typecheck`・`npm test`・`npm run build`

## 動いている場所（Cloudflare）

**https://eitango.shiodome47.com**（`main` が更新されるたびに、Cloudflare が自動でビルドして配り直す）。設定は `wrangler.toml`・`public/_headers`。

### はじめの 1 回（Cloudflare のダッシュボード）

1. **Workers & Pages** → **作成** → **Workers** → **Git リポジトリをインポート** で `shiodome47/eitango` を選ぶ（まほうのランプ・catalog と同じ）
2. ビルドの設定
   - ビルドコマンド: `npm run build`
   - デプロイコマンド: `npx wrangler deploy`
   - ルートディレクトリ: `/`
3. 最初のデプロイが終わると、`eitango.shiodome47.com` が自動でできる

だれでも開けます（検索エンジンには載せない）。自分だけにしたいときは、catalog と同じように Cloudflare Access で決めます。

## 単語と絵を足す

単語の正本は [`src/words.ts`](src/words.ts) です（覚えたい意味ごとに 1 行。単語・意味・例文・絵にする場面）。

1. `src/words.ts` に行を足す（絵が無い間は、絵文字の仮の絵が出る）
2. `scripts/sheets.tsv` に、シートの番号と、そこに入れる 6 語を書く
3. 絵を作る: 文字なし・すき間なしの 3×2（6 枚組）の画像を、シートごとに 1 枚。場面は `words.ts` の `prompt`。名前は `sheet-28.png` のように、シート番号を入れる
4. 画像を [shiodome47/eitango-sheets](https://github.com/shiodome47/eitango-sheets) に入れる（何枚でも）。その写しを手元に取ってきて、まとめて取りこむ（Pillow が要る）

   ```bash
   scripts/add_from_sheets.sh ../eitango-sheets
   ```

   切り分けて `public/img` に置き、`src/words.ts` に絵の場所を足すところまで行う。1 枚だけのときは `scripts/add_sheet.sh シート.png 単語 6 つ`
5. 絵だけを見て、その単語が思い浮かぶかを確かめる（別の単語が先に浮かぶ絵は、場面を変えて作り直す）

## これから

- 端末どうしの同期（shiodome-sync）
- 関所めぐり（`@shiodome47/sekisho`）で、まとまりごとにスタンプ
- 単語が増えたら、絵を Cloudflare R2 に置く
