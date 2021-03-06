import { Comparator, heappush } from '..'

describe('heappush', () => {
  // The example heap obeys the heap substructure according to the example
  // compare function.
  const exampleHeap = [2, 8, 10, 433, 23111, 23, 31]
  const exampleCompare: Comparator<number> = (a, b) => a - b

  it('Should add an element to the heap', () => {
    const heap = [...exampleHeap]
    const originalLength = heap.length
    const compare = exampleCompare
    const value = 10

    heappush(heap, value, compare)

    expect(heap.length).toBe(originalLength + 1)
  })

  it('Should maintain the heap invariant', () => {
    const heap = [...exampleHeap]
    const compare = exampleCompare
    const value = 10

    heappush(heap, value, compare)

    expect(heap).toObeyHeapInvariant(compare)
  })
})
