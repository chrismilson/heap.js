/**
 * A Function to compare two values of the same type `T`.
 *
 * The return value should be a number, v, such that
 *
 * - If value `a` is less than value `b`, v is negative.
 * - If value `a` is greater than value `b`, v is positive.
 * - If value `a` is equal to value `b`, v is zero.
 */
export type Comparator<T> = (a: T, b: T) => number

/**
 * The default comparator for the heap actions. It is defined this way to be
 * consistent with the
 * [`Array.prototype.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
 * function.
 */
export const defaultCmp: Comparator<unknown> = (a, b) => {
  const strA = String(a)
  const strB = String(b)

  return strA < strB ? -1 : strA > strB ? 1 : 0
}

/**
 * Bubbles smaller elements below an index up.
 */
function _bubbleUp<T>(
  heap: T[],
  idx: number,
  cmp: Comparator<T> = defaultCmp
): void {
  while (idx < heap.length) {
    const left = 2 * idx + 1
    const right = 2 * idx + 2
    let ext = idx

    if (left < heap.length && cmp(heap[left], heap[ext]) < 0) {
      ext = left
    }

    if (right < heap.length && cmp(heap[right], heap[ext]) < 0) {
      ext = right
    }

    if (ext === idx) {
      // The heap substructure is properly maintained
      return
    }
    ;[heap[idx], heap[ext]] = [heap[ext], heap[idx]]
    idx = ext
  }
}

/** Bubbles larger elements above a given index down. */
function _bubbleDown<T>(
  heap: T[],
  idx: number,
  cmp: Comparator<T> = defaultCmp
): void {
  while (idx > 0) {
    // The parent index
    const p = (idx - 1) >> 1

    if (cmp(heap[idx], heap[p]) < 0) {
      ;[heap[idx], heap[p]] = [heap[p], heap[idx]]
      idx = p
    } else {
      return
    }
  }
}

/**
 * "Sorts" an array in-place into a min-heap according to the passed comparator.
 */
export function heapify<T>(arr: T[], cmp: Comparator<T> = defaultCmp): void {
  for (let i = arr.length >> 1; i >= 0; i--) {
    _bubbleUp(arr, i, cmp)
  }
}

/**
 * Adds a new element to a heap while keeping the heap substructure (according
 * to the comparator).
 */
export function heappush<T>(
  heap: T[],
  value: T,
  cmp: Comparator<T> = defaultCmp
): void {
  heap.push(value)
  _bubbleDown(heap, heap.length - 1, cmp)
}

/**
 * Removes and returns the minimum element (according to `lt`) from the heap
 * while maintaining the heap substructure.
 */
export function heappop<T>(
  heap: T[],
  cmp: Comparator<T> = defaultCmp
): T | undefined {
  if (heap.length <= 1) {
    return heap.pop()
  }
  const result = heap[0]
  // since the length of the heap is at least 2, the popped value will be
  // defined.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  heap[0] = heap.pop()!

  _bubbleUp(heap, 0, cmp)

  return result
}

/**
 * Pushes `value` onto the heap, then pops to return the minimum (according to
 * `lt`) element in the heap.
 *
 * This combined action runs faster than a push followed by a pop.
 */
export function heappushpop<T>(
  heap: T[],
  value: T,
  cmp: Comparator<T> = defaultCmp
): T {
  if (heap.length === 0 || cmp(value, heap[0]) < 0) {
    return value
  }
  const result = heap[0]

  heap[0] = value
  _bubbleUp(heap, 0, cmp)

  return result
}

/**
 * Pops the minimum element (according to `lt`) from the heap and then pushes
 * `value` onto the heap.
 *
 * Faster than a pop followed by a push.
 *
 * The returned element may be larger than the value added. If this is not
 * desired, consider using `heappushpop` instead.
 *
 * @see [[heappushpop]]
 */
export function heapreplace<T>(
  heap: T[],
  value: T,
  cmp: Comparator<T> = defaultCmp
): T | undefined {
  // If the heap is currently empty, heap[0] will be undefined.
  const result = heap[0]
  // When we run this, the length will update to 1 if it was previously 0.
  heap[0] = value

  _bubbleUp(heap, 0, cmp)
  return result
}

/**
 * Provides a wrapper for the heap methods in this module to set the compare
 * method.
 *
 * Useful for defining a max-heap, or a heap that compares numbers by their
 * value instead of their string representation.
 *
 * This functionality can be done by explicitly stating the compare method every
 * time, but that can become quite verbose.
 *
 * @example
 * ```ts
 * // Normal heapify:
 * // Puts 10 ahead of 5 because it compares elements by their string
 * // representation.
 * heapify([100, 10, 5, 50]) // [10, 100, 5, 50]
 *
 * // Redefined heapify:
 * // The true min (5) is at the front.
 * const { heapify } = useDefaultCompare((a, b) => a - b)
 * heapify([100, 10, 5, 50]) // [5, 10, 100, 50]
 * ```
 */
export function useHeap<T>(
  compare: Comparator<T>
): {
  heapify(arr: T[]): void
  heappush(heap: T[], value: T): void
  heappop(heap: T[]): T | undefined
  heappushpop(heap: T[], value: T): T
  heapreplace(heap: T[], value: T): T | undefined
} {
  return {
    heapify(arr) {
      heapify(arr, compare)
    },
    heappush(heap, value) {
      heappush(heap, value, compare)
    },
    heappop(heap) {
      return heappop(heap, compare)
    },
    heappushpop(heap, value) {
      return heappushpop(heap, value, compare)
    },
    heapreplace(heap, value) {
      return heapreplace(heap, value, compare)
    },
  }
}
