[![npm version](https://badge.fury.io/js/%40shlappas%2Fheap.svg)](https://badge.fury.io/js/%40shlappas%2Fheap)
[![Build Status](https://github.com/chrismilson/heap.js/workflows/Test/badge.svg)](https://github.com/chrismilson/heap.js/actions)

# Heap

A simple module to maintain a binary heap.

## Installation

```bash
yarn add @shlappas/heap
```

## Usage

Similar to the python [`heapq`](https://docs.python.org/3/library/heapq.html)
module, the actual datastructure is just a normal array!

```ts
const heap = [9, 7, 6, 4, 1]
heapify(heap) // now heap is a min-heap!
```

Calling `heapify` makes sure that we can do the following:

- `heap[0]` is the minimum element in the array.
- Calling any of `heappush`, `heappop`, `heappushpop`, or `heapreplace` achieves
  the intended result. For more information, check out [the
  docs](https://shlappas.com/heap.js/modules.html). Built with
  [`typedoc`](https://github.com/TypeStrong/typedoc)!

### Default Compare

In keeping with the builtin `Array.prototype.sort()` function, the default
behaviour of the heap methods is to compare values based on their string
representation. 

```ts
const heap = [10, 100, 5, 50]
heapify(heap) // [10, 100, 5, 50], since '10' < '5' etc.
```

If this is not intended, there are two options:

- Pass a custom `compare` function to each individual call:
  ```ts
  import { heapify, heappop } from '@shlappas/heapq'

  const compare = (a: number, b: number) => a - b

  const heap = [10, 100, 5, 50]

  heapify(heap, compare) // [5, 50, 10, 100]
  heappop(heap, compare) // 5 and the remaining heap is [10, 50, 100]
  ```

- Redefine the heap methods with a fixed `compare` function:
  ```ts
  const { useCompare } from '@shlappas/heapq'

  const { heapify, heappop } = useCompare<number>((a, b) => a - b)
  const heap = [10, 100, 5, 50]

  heapify(heap) // [5, 50, 10, 100]
  heappop(heap) // 5 and the remaining heap is [10, 50, 100]
  ```

## Examples

### N Largest

We can find the n largest elements of an array\*:

```ts
function nLargest<T, N extends number>(arr: T[], n: N): Tuple<T, N> {
  const result: T[] = []

  for (let i = 0; i < n; i++) {
    result.push(arr[i])
  }

  heapify(result)

  for (let i = n; i < arr.length; i++) {
    heappushpop(result, arr[i])
  }

  return result as Tuple<T, N>
}
```

***Shameless plug**: For the `Tuple` type, consider using
[`tuple-type`](https://www.npmjs.com/package/tuple-type)!*

### Merge

We can merge a bunch of already sorted arrays\*:

```js
function merge(compare, ...preSorted) {
  const result = []

  const status = [...zip(repeat(0), preSorted)]

  const { heapify, heappop, heapreplace } = useHeap(([i1, l1], [i2, l2]) => {
    return compare(l1[i1], l2[i2])
  })

  heapify(status)

  while (status.length) {
    const [idx, list] = status[0]
    result.append(list[idx])
    idx += 1
    if (idx === list.length) {
      heappop(status)
    } else {
      heapreplace(status, [idx, list])
    }
  }

  return result
}
```

***Shameless Plug 2: Electric Boogaloo**: For the `zip`, `filter` and `repeat`
functions (along with some other nice tools for iterators), consider using
[`@shlappas/itertools`](https://www.npmjs.com/package/@shlappas/itertools)!*

\* *I reccomend not using these implementations verbatim; some heavy assumptions
are made in the name of brevity. Check out [`examples`](examples) for some safer
implementations.*