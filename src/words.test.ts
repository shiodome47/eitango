import { existsSync } from 'node:fs'
import { WORDS } from './words'

describe('単語の正本', () => {
  it('id が重なっていない', () => {
    const ids = WORDS.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('単語・意味・例文・場面がそろっている', () => {
    for (const w of WORDS) {
      expect(w.word && w.meaning && w.example && w.exampleMeaning && w.prompt, w.id).toBeTruthy()
      // 例文に、その単語（活用した形もふくむ）が入っている
      expect(w.example!.toLowerCase(), w.id).toContain(w.word.slice(0, w.word.length - 1).toLowerCase())
    }
  })

  it('絵のファイルが public にある', () => {
    for (const w of WORDS) if (w.image) expect(existsSync(`public${w.image}`), w.image).toBe(true)
  })
})
