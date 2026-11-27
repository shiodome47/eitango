import type { WordItem } from '@shiodome47/word-gallery'

/**
 * 単語の正本（英検 1 級くらいの動詞）。覚えたい意味ごとに 1 行。
 * `prompt` は、絵にする場面（絵を作るときの指示。絵の説明 `alt` にも使う）。
 * 絵のあるものには `image`（public/img。6 枚組のシートを scripts/cut_sheet.py で切り分ける）。
 * 絵がまだ無いものは、絵文字の仮の絵が出る。
 *
 * `id`（= 単語）は、覚えた印に使っているので、あとから変えない。
 */
export interface Word extends WordItem {
  prompt: string
}

const w = (word: string, meaning: string, placeholder: string, example: string, exampleMeaning: string, prompt: string, image?: string): Word => ({
  id: word,
  word,
  meaning,
  placeholder,
  image,
  example,
  exampleMeaning,
  note: '動詞',
  alt: prompt,
  prompt,
})

export const WORDS: Word[] = [
  w('scamper', 'ちょこちょこ走る', '🐿️', 'A squirrel scampered along the log.', 'リスが丸太の上をちょこちょこ走った。', '苔のはえた丸太の上を、体を低くして走るリス', '/img/scamper.webp'),
  w('clatter', 'ガチャガチャ鳴る', '🍳', 'The pots clattered to the floor.', 'なべがガチャガチャと床に落ちた。', '棚から床へ落ちて散らばる、ステンレスのなべとふた', '/img/clatter.webp'),
  w('hoard', 'ため込む', '🌰', 'Squirrels hoard acorns for the winter.', 'リスは冬にそなえて、どんぐりをため込む。', '木のうろいっぱいのどんぐりに、もう 1 つ足すリス', '/img/hoard.webp'),
  w('brandish', '振りかざす', '⚔️', 'The knight brandished his sword.', '騎士は剣を振りかざした。', '劇の舞台の上で、よろいを着た騎士が、剣を頭の上に高く振りかざしている。顔はかぶとで見えない', '/img/brandish.webp'),
  w('contort', 'ねじ曲げる', '🤸', 'The acrobat contorted her body.', '曲芸師は体をねじ曲げた。', '体のやわらかい曲芸師が、床の上で背中を大きく反らせ、足を頭の上まで回して、体をありえない形にねじ曲げている', '/img/contort.webp'),
  w('flounder', 'もがく', '❄️', 'He floundered in the deep snow.', '彼は深い雪の中でもがいた。', '腰まで深い雪に埋まった登山者が、両腕をばたつかせて、進めずにもがいている。後ろには、ほとんど進んでいない乱れた雪の跡', '/img/flounder.webp'),
  w('sprawl', '手足を投げ出して寝そべる', '🛋️', 'The dog sprawled across the sofa.', '犬はソファいっぱいに寝そべった。', 'ソファいっぱいに、手足を四方に投げ出して、あおむけに寝そべる大型犬', '/img/sprawl.webp'),
  w('plummet', '急落する', '📉', 'The roller coaster plummeted down the first drop.', 'ジェットコースターは最初の坂を一気に落ちた。', 'ジェットコースターの車両が、ほぼ垂直の坂を真っ逆さまに落ちていく瞬間。乗客の髪が上になびいている', '/img/plummet.webp'),
  w('scorch', '焦がす', '🔥', 'The iron scorched my shirt.', 'アイロンでシャツを焦がしてしまった。', 'アイロン台の白いシャツに、アイロンの形の茶色い焦げ跡。わきに立てたアイロンから、うすい煙が上がっている', '/img/scorch.webp'),
  w('drench', 'びしょぬれにする', '🌧️', 'She was drenched by a sudden shower.', '彼女はにわか雨でびしょぬれになった。', 'どしゃ降りの中に 1 人で立つ人。両手は下ろしたまま、困った顔。髪と服がはりつき、そで口やすそから水がしたたり落ちている', '/img/drench.webp'),
  w('prowl', 'うろつく', '🦊', 'A fox prowled around the henhouse.', 'キツネが鶏小屋のまわりをうろついていた。', '夜、鶏小屋の金網のまわりを、身を低くして歩き回るキツネ。金網の中にニワトリが見える', '/img/prowl.webp'),
  w('dangle', 'ぶら下がる', '🔑', 'A bunch of keys dangled from her finger.', '鍵の束が彼女の指からぶら下がっていた。', '差し出した人さし指の先から、鍵の束がぶら下がって揺れている（手元を大きく写す）', '/img/dangle.webp'),
  w('glisten', 'きらきら光る', '✨', 'The spider\'s web glistened with dew.', 'クモの巣が朝つゆできらきら光っていた。', '朝日を受けて、朝つゆの粒がきらきら光るクモの巣（大きく写す）', '/img/glisten.webp'),
  w('topple', '倒れる', '🧱', 'The tower of blocks toppled over.', '積み木の塔が倒れた。', '高く積んだ積み木の塔が、大きく傾いて倒れていく瞬間。上のほうの積み木が宙に浮いている', '/img/topple.webp'),
  w('smolder', 'くすぶる', '🪵', 'The campfire was still smoldering.', 'たき火はまだくすぶっていた。', '炎の消えたたき火。黒くなった薪の間で炭が赤く光り、細い煙だけが立ちのぼっている', '/img/smolder.webp'),
  w('stagger', 'よろめく', '🏃', 'The exhausted runner staggered toward the finish line.', 'つかれ切ったランナーは、よろめきながらゴールに向かった。', '長い距離を走り終えたランナーが、ひざが折れそうになり、体を大きく左右にふらつかせながら、ゴールのテープに向かっている（顔は見分けられない・ゼッケンに文字なし）', '/img/stagger.webp'),
  w('cram', '詰め込む', '🧳', 'She crammed her clothes into the suitcase.', '彼女は服をスーツケースに詰め込んだ。', '服がはみ出したスーツケースに、ひざで体重をかけながら、さらに服を押し込んでいる人', '/img/cram.webp'),
  w('wither', 'しおれる', '🥀', 'The flowers withered in the heat.', '暑さで花がしおれた。', '花びんの中で首を垂れ、花びらが茶色く縮れたヒマワリ。机の上に、落ちた花びら', '/img/wither.webp'),
  w('eavesdrop', '盗み聞きする', '👂', 'She eavesdropped on their conversation.', '彼女は二人の話を盗み聞きした。', '少し開いたドアのかげで、ドアに耳を寄せて、こっそり聞いている人。ドアの向こうに、話をしている二人が見える', '/img/eavesdrop.webp'),
  w('hibernate', '冬眠する', '🐻', 'Bears hibernate through the winter.', 'クマは冬の間、冬眠する。', '雪に埋もれた巣穴の中で、丸くなって眠るクマ。穴の入り口の外は雪景色', '/img/hibernate.webp'),
  w('erupt', '噴火する', '🌋', 'The volcano erupted without warning.', 'その火山は前ぶれなく噴火した。', '夜、火口から溶岩と噴煙を高く吹き上げている火山', '/img/erupt.webp'),
  w('dismantle', '分解する', '🚲', 'She dismantled the bicycle.', '彼女は自転車を分解した。', 'ガレージの床に、ばらばらに分解された自転車。外した車輪・ハンドル・サドル・チェーン・ねじがきれいに並び、人がレンチで最後の部品をフレームから外している', '/img/dismantle.webp'),
  w('sprout', '芽を出す', '🌱', 'The seeds sprouted in a week.', '種は 1 週間で芽を出した。', '黒い土を押し上げて出てきたばかりの、小さな双葉（大きく写す）', '/img/sprout.webp'),
  w('shatter', '粉々に割れる', '💥', 'The glass shattered on the floor.', 'グラスは床に落ちて粉々に割れた。', 'ガラスのコップが床に当たった瞬間。破片が四方に飛び散っている', '/img/shatter.webp'),
  w('swarm', '群がる', '🐝', 'Bees swarmed around the hive.', 'ミツバチが巣箱のまわりに群がった。', '巣箱の入り口に群がる、数えきれないほどのミツバチ', '/img/swarm.webp'),
  w('plunder', '略奪する', '🏴‍☠️', 'Pirates plundered the merchant ship.', '海賊は商船を略奪した。', '荒らされた商船の船室。ひっくり返った箱やたるの間から、物語の中の海賊たちが、金貨の袋や宝を両腕いっぱいに抱えて、戸口から運び出している（顔は見分けられない）', '/img/plunder.webp'),
  w('meander', '曲がりくねる', '🏞️', 'The river meanders through the valley.', '川は谷を曲がりくねって流れている。', '緑の平野を、大きく S 字に曲がりくねって流れる川を、空から見たところ', '/img/meander.webp'),
  // ── 絵がまだ無いもの ──
  w('grapple', '取っ組み合う', '🤼', 'The two cubs grappled in the grass.', '2 頭の子グマが草の上で取っ組み合った。', '草の上で、後ろ足で立って組み合い、取っ組み合いをしている 2 頭の子グマ'),
  w('squint', '目を細める', '😎', 'She squinted in the bright sunlight.', '彼女はまぶしい日差しに目を細めた。', '強い日差しの下、片手をひたいにかざして、まぶしそうに目を細めている人（顔を大きく写す）'),
  w('trudge', 'とぼとぼ歩く', '🥾', 'The traveler trudged across the dunes.', '旅人は砂丘をとぼとぼと歩いた。', '砂漠の砂丘を、重い荷物を背負い、うつむいて足を引きずるように歩く旅人。後ろに長い足跡がつづいている'),
  w('huddle', '身を寄せ合う', '🐧', 'The penguins huddled together in the blizzard.', 'ペンギンたちは吹雪の中で身を寄せ合った。', '吹雪の中、すき間なくぎゅっと身を寄せ合っているペンギンの群れ'),
  w('gnaw', 'かじる', '🦫', 'A beaver gnawed at the tree trunk.', 'ビーバーが木の幹をかじっていた。', 'ビーバーが前歯で木の幹をかじっている。幹は細くえぐれて、足もとに削りくずが散らばっている'),
  w('perch', 'とまる', '🐦', 'A small bird perched on the branch.', '小さな鳥が枝にとまった。', '細い枝の先に、足でしっかりつかまってとまっている小鳥（横から大きく写す）'),
  w('submerge', '水中に沈める', '🌊', 'The flood submerged the cars.', '洪水で車が水に沈んだ。', '洪水の町。茶色い水に沈んで、屋根だけが水面に出ている何台もの車と、半分沈んだ道路標識（文字は読めない）'),
  w('entangle', 'からませる', '🪁', 'The kite got entangled in the branches.', 'たこが枝にからまった。', '木の枝に、たこと、その糸がぐるぐるにからまっている。下から糸を引いても取れない'),
  w('recoil', '後ずさりする', '😱', 'He recoiled at the sight of the spider.', '彼はクモを見て、思わず身を引いた。', 'ふたを開けた箱の中に大きなクモ。のぞきこんだ人が、驚いて上半身をのけぞらせ、両手を引っこめている'),
  w('slither', 'するすると進む', '🐍', 'A snake slithered across the sand.', 'ヘビが砂の上をするすると進んだ。', '砂の上を、体を S 字にくねらせて進むヘビ。後ろに、くねった跡が残っている'),
  w('devour', 'むさぼり食う', '🍖', 'The dog devoured its dinner in seconds.', 'その犬は数秒でえさをむさぼり食った。', 'えさ皿に顔を突っこんで、がつがつ食べる犬。フードがまわりに飛び散っている'),
  w('ooze', 'にじみ出る', '🍯', 'Sap oozed from the cut in the bark.', '樹皮の傷から樹液がにじみ出た。', '木の幹の傷から、こはく色の樹液が、とろりとにじみ出て、ゆっくりたれている（大きく写す）'),
  w('crumble', 'ぼろぼろに崩れる', '🍪', 'The cookie crumbled in her hand.', 'クッキーは彼女の手の中でぼろぼろに崩れた。', '手のひらの上で、クッキーがぼろぼろに崩れて、かけらが指の間からこぼれ落ちている'),
  w('hurl', '力いっぱい投げつける', '🥏', 'The athlete hurled the javelin.', 'その選手はやりを力いっぱい投げた。', 'やり投げの選手が、全身を使って、やりを投げ放った瞬間。腕が振り切られ、やりが手を離れている（顔は見分けられない）'),
  w('stoop', 'かがむ', '🚪', 'He stooped to get through the low doorway.', '彼は低い戸口を通るために身をかがめた。', '古い家の低い戸口を、背の高い人が、頭をぶつけないように腰と首を曲げて、くぐろうとしている'),
  w('rummage', 'ひっかき回して探す', '👜', 'She rummaged through her bag for the keys.', '彼女は鍵を探して、かばんの中をひっかき回した。', '大きなかばんに両手を突っこんで探している人。まわりに、取り出した財布や本や小物が散らばっている'),
  w('tether', 'つなぐ', '🐐', 'The goat was tethered to a post.', 'ヤギはくいにつながれていた。', '草地のくいに、ロープでつながれたヤギ。ロープがぴんと張り、その届く範囲だけ草が丸く食べられている'),
  w('erode', '浸食する', '🏖️', 'The waves eroded the cliff.', '波ががけを浸食した。', '波に根もとをえぐられた海岸のがけ。がけの上の道と柵が、とちゅうで崩れ落ちている'),
  w('pry', 'こじ開ける', '🧰', 'He pried the lid off the crate.', '彼は木箱のふたをこじ開けた。', 'バールを木箱のふたのすき間に差しこんで、体重をかけてこじ開けている手。くぎが浮いて、ふたが少し開いている'),
  w('wade', '水の中を歩いて渡る', '🏞️', 'They waded across the river.', '彼らは歩いて川を渡った。', 'ひざの上まで水につかりながら、靴を手に持って、川を歩いて渡っている人たち'),
]
