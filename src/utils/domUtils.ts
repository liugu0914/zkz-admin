import { ThemeType } from '@/enums/settings'
import type { FunctionArgs } from '@vueuse/core'

export interface ViewportOffsetResult {
  left: number
  top: number
  right: number
  bottom: number
  rightIncludeBody: number
  bottomIncludeBody: number
}

export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0
  }
  return element.getBoundingClientRect()
}

function trim(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* istanbul ignore next */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls) {
    return false
  }
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space.')
  }
  if (el.classList) {
    return el.classList.contains(cls)
  }
  return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
}

/* istanbul ignore next */
export function addClass(el: Element, cls: string) {
  if (!el) {
    return
  }
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) {
      continue
    }

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) {
    return
  }
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) {
      continue
    }

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}
/**
 * Get the left and top offset of the current element
 * left: the distance between the leftmost element and the left side of the document
 * top: the distance from the top of the element to the top of the document
 * right: the distance from the far right of the element to the right of the document
 * bottom: the distance from the bottom of the element to the bottom of the document
 * rightIncludeBody: the distance between the leftmost element and the right side of the document
 * bottomIncludeBody: the distance from the bottom of the element to the bottom of the document
 *
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement

  const docScrollLeft = doc.scrollLeft
  const docScrollTop = doc.scrollTop
  const docClientLeft = doc.clientLeft
  const docClientTop = doc.clientTop

  const pageXOffset = window.pageXOffset
  const pageYOffset = window.pageYOffset

  const box = getBoundingClientRect(element)

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
  const offsetLeft = retLeft + pageXOffset
  const offsetTop = rectTop + pageYOffset

  const left = offsetLeft - scrollLeft
  const top = offsetTop - scrollTop

  const clientWidth = window.document.documentElement.clientWidth
  const clientHeight = window.document.documentElement.clientHeight
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top
  }
}

/* istanbul ignore next */
export function on(element: Element | HTMLElement | Document | Window, event: string, handler: EventListenerOrEventListenerObject): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

/* istanbul ignore next */
export function off(element: Element | HTMLElement | Document | Window, event: string, handler: Fn): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

export function useRafThrottle<T extends FunctionArgs>(fn: T): T {
  let locked = false
  // @ts-ignore
  return function (...args: unknown[]) {
    if (locked) {
      return
    }
    locked = true
    window.requestAnimationFrame(() => {
      // @ts-ignore
      fn.apply(this, args)
      locked = false
    })
  }
}

/**
 * equals to jq' parents
 * @param el html Element
 * @param selector 选择器
 * @returns parents node
 */
export const parents = (el: any, selector?: string) => {
  const parents: any[] = []
  while ((el = el.parentNode) && el !== document) {
    if (!selector || el.matches(selector)) {
      parents.push(el)
    }
  }
  return parents
}

/**
 * 获取html节点
 */
export const getHtmlRoot = () => {
  return document.documentElement
}

/**
 * html class附加
 * @param className 类名称
 * @param add 是否附加
 */
export const changeClassName = (className: string, add: boolean) => {
  const htmlRoot = getHtmlRoot()

  const has = hasClass(htmlRoot, className)
  if (add) {
    !has && addClass(htmlRoot, className)
  } else {
    removeClass(htmlRoot, className)
  }
}

/**
 * 附加 dark class
 * @param mode 模式
 */
export const updateDarkClass = (theme: ThemeType = 'light') => {
  const htmlRoot = getHtmlRoot()
  const hasDarkClass = hasClass(htmlRoot, 'dark')
  if (theme === 'dark') {
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark')
    }
  } else if (hasDarkClass) {
    removeClass(htmlRoot, 'dark')
  }
}
