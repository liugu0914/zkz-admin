import type { ThemeType } from '@/enums/settings'
import type { InjectionKey, Ref } from 'vue'

/**
 * Topic injection key
 */
export const ThemeKey: InjectionKey<Ref<ThemeType>> = Symbol()

/**
 * The theme color injection key
 */
export const ColorKey: InjectionKey<Ref<string>> = Symbol()
