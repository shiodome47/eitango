/** 覚えた印の保存（今はこの端末のブラウザの中。あとで同期を足すときは、ここを差し替える） */
const KEY = 'eitango:learned'

export function loadLearned(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function saveLearned(learned: readonly string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(learned))
  } catch {
    // 保存できない場所でも、画面は動かす
  }
}
