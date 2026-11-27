/** この端末のブラウザの中に保存するもの（あとで同期を足すときは、ここを差し替える） */
const LEARNED = 'eitango:learned'
const SET = 'eitango:set'

/** 覚えた印 */
export function loadLearned(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(LEARNED) ?? '[]')
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function saveLearned(learned: readonly string[]): void {
  try {
    localStorage.setItem(LEARNED, JSON.stringify(learned))
  } catch {
    // 保存できない場所でも、画面は動かす
  }
}

/** 最後に見ていたセット（`null` は「すべて」。はじめてのときは 1 つ目のセット） */
export function loadSet(): string | null {
  try {
    const v = localStorage.getItem(SET)
    return v === null ? '1' : v === '' ? null : v
  } catch {
    return '1'
  }
}

export function saveSet(id: string | null): void {
  try {
    localStorage.setItem(SET, id ?? '')
  } catch {
    // 保存できない場所でも、画面は動かす
  }
}
