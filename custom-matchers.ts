expect.extend({
  toObeyHeapInvariant<T>(
    recieved: T[],
    compare: (a: T, b: T) => number
  ): jest.CustomMatcherResult {
    for (let i = 0; i < recieved.length; i++) {
      const left = 2 * i + 1
      const right = 2 * i + 2

      if (
        (left < recieved.length && compare(recieved[i], recieved[left]) > 0) ||
        (right < recieved.length && compare(recieved[i], recieved[right]) > 0)
      ) {
        return {
          pass: false,
          message: () => `Expected ${recieved} to obey the heap invariant.`,
        }
      }
    }

    return {
      pass: true,
      message: () => `Expected ${recieved} to not obey the heap invariant.`,
    }
  },
})
