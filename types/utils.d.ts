type If<C extends Boolean, T, F> = C extends true ? T : F

type aa = If<true, 'a', 'b'>

type MyAwaited<T> = T extends Promise<infer R> ? (R extends Promise<unknown> ? MyAwaited<R> : R) : T

type ss = MyAwaited<Promise<string>>

type Includes<T extends readonly unknown[], U> = U extends keyof T ? true : false

type ssx = Includes<[1, 2, 3, 5, 6, 7], 7>

type Push<T extends Array<unknown>, U> = [...T, U]

type sxx = Push<[1, 2], 3>
type xxas = Parameters<() => void>

type MyReturnType<T> = T extends (...arg: unknown[]) => infer R ? R : never

type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

type MyReadonly2<T, K extends keyof T> = {
  readonly [P in keyof T as P extends K ? P : never]: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}

type asd = MyReadonly2<Todo, 'title' | 'description'>

type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

type X = {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type xTodo = DeepReadonly<X> // should be same as `Expected`

type TupleToUnion<T extends Array<unknown>> = T extends Array<infer R> ? R : never

type TestTupleToUnion = TupleToUnion<['1', '2', '3']> // expected to be '1' | '2' | '3'

type ssz = Record<string, number>

type Last<T extends Array<unknown>> = T extends [...arg: unknown[], last: infer R] ? R : never

type testLast = Last<[1, 2, 3, false]>

// 出堆
type Pop<T extends unknown[]> = T extends [...arg: infer R, last: unknown] ? R : never

type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
