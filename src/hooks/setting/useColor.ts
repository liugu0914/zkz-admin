import { themeColor } from '@/enums/settings'

const getColors = () => {
  const colors = Object.keys(themeColor) as ThemeColor[]
  return colors.map((item) => {
    return {
      color: themeColor[item] as string,
      name: item
    }
  })
}
const themeColors = getColors()

export const useColor = () => {
  return { themeColors }
}
