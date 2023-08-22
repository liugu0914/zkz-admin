/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentRenderProxy, VNode, ComponentPublicInstance, FunctionalComponent } from 'vue'

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: RecordAble<string>
      devDependencies: RecordAble<string>
    }
    lastBuildTime: string
  }
  // declare interface Window {
  //   // Global vue app instance
  //   __APP__: App<Element>;
  // }

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  declare type Nullable<T> = T | null
  declare type NonNullable<T> = T extends null | undefined ? never : T
  declare type RecordAble<T = unknown> = Record<string, T>
  declare type ReadonlyRecordable<T = unknown> = {
    readonly [key: string]: T
  }
  declare type Indexable<T = unknown> = {
    [key: string]: T
  }
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  declare interface WheelEvent {
    path?: EventTarget[]
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  declare interface ViteEnv {
    VITE_BASE_URL: string
    VITE_OUT_DIR_NAME: string

    VITE_PORT: number
    VITE_NAME: string
    VITE_MENUS_KEY: string
    VITE_PERMISSIONS_KEY: string
    VITE_ROLES_KEY: string
    VITE_USER_KEY: string
    VITE_ORGANIZATION_KEY: string
    VITE_SETTING_KEY: string
    VITE_TBAS_KEY: string
    VITE_ACCESS_TOKEN_KEY: string
    VITE_AUTHORIZATION_KEY: string
    VITE_LOCALE_KEY: string

    VITE_APP_NAME: string
    // 打包明细查看
    VITE_SHOW_VISUALIZER: boolean
    // 支持 legacy
    VITE_USER_LEGACY: boolean
    // 接口地址
    VITE_USE_MOCK: boolean
    VITE_BASE_IP: string
    VITE_BASE_API: string
    VITE_BASE_API_PREFIX: string
  }

  declare function parseInt(s: string | number, radix?: number): number

  declare function parseFloat(string: string | number): number

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy
    interface ElementAttributesProperty {
      $props: unknown
    }
    interface IntrinsicElements {
      [elem: string]: unknown
    }
    interface IntrinsicAttributes {
      [elem: string]: unknown
    }
  }

  export type JSXComponent<Props = unknown> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>

  declare interface Window {
    DocsAPI: {
      DocEditor: DsAPI.DocEditor
    }
  }
}
