/**
 * https://github.com/type-challenges/type-challenges
 */

/**
 * 获取数组中的类型
 */
declare type ArrayType<T extends Array | undefined> = T extends Array<infer R> ? R : never

/**
 * 图标库
 */
declare type IconData = {
  [key: string]: string[]
}

/**
 * 数组第一个元素
 */
declare type First<T extends any[]> = T extends [] ? never : T[0]

/**
 * 数组最后一个元素
 */
declare type Last<T extends any[]> = [any, ...T][T['length']]
