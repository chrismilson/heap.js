export {}
declare global {
	namespace jest {
		interface Matchers<R> {
			/**
			 * Checks whether or not the values obey the heap invariant according to
			 * the passed compare function.
			 */
			toObeyHeapInvariant<T>(compare: (a: T, b: T) => number): R
		}
	}
}
