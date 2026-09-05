// Deterministic pseudo-random generator for bulk mock data. Seeded (not
// Math.random) so the dataset is stable across reloads within a session —
// useful for demos and for pagination/search to behave consistently.
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(42)

export function randInt(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)]
}

export function chance(probability: number) {
  return rng() < probability
}

export function pickN<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr]
  const result: T[] = []
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = randInt(0, pool.length - 1)
    result.push(pool[idx])
    pool.splice(idx, 1)
  }
  return result
}
