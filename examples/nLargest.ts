import { useHeap } from '@shlappas/heap'
import { Tuple } from '@shlappas/tuple-type'

/**
 * Finds the n largest elements of an iterable.
 *
 * Returns undefined if the iterable is not long enough.
 */
function nLargest<T, N extends number>(
  iterable: Iterable<T>,
  n: N,
  compare: (a: T, b: T) => number
): Tuple<T, N> | undefined {
  const result: T[] = []
  const iterator = iterable[Symbol.iterator]()

  for (let i = 0; i < n; i++) {
    const { done, value } = iterator.next()
    if (done) {
      return undefined
    }
    result.push(value)
  }

  const { heapify, heappushpop } = useHeap<T>(compare)
  heapify(result)

  for (;;) {
    const { done, value } = iterator.next()
    if (done) {
      break
    }
    heappushpop(result, value)
  }

  return result as Tuple<T, N>
}

// BONUS
function nSmallest<T, N extends number>(
  iterable: Iterable<T>,
  n: N,
  compare: (a: T, b: T) => number
): Tuple<T, N> | undefined {
  return nLargest(iterable, n, (a, b) => -compare(a, b))
}
