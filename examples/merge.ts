import { useHeap } from '@shlappas/heap'

/**
 * Merges a variable number of pre-sorted iterables into a single sorted
 * iterable.
 */
function* merge<T>(
  compare: (a: T, b: T) => number,
  ...presorted: Iterable<T>[]
): Generator<T> {
  // We need to compare the iterables by their next values so we can produce the
  // next value and compare by that.
  const heap: [T, Iterator<T>][] = presorted
    .map((it): [T, Iterator<T>] | undefined => {
      const iterator = it[Symbol.iterator]()
      const { done, value } = iterator.next()
      if (done) {
        return undefined
      }
      return [value, iterator] as [T, Iterator<T>]
    })
    .filter((state) => state !== undefined)

  // Define our custom comparator for the partially exhausted iterators.
  const { heapify, heappop, heapreplace } = useHeap<[T, Iterator<T>]>(
    ([v1], [v2]) => compare(v1, v2)
  )
  // Setup the heap invariant
  heapify(heap)

  while (heap.length) {
    const [value, iterator] = heap[0]
    yield value
    const { done, value: nextValue } = iterator.next()
    if (done) {
      heappop(heap)
    } else {
      heapreplace(heap, [nextValue, iterator])
    }
  }
}
