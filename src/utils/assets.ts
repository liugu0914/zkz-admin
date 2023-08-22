/**
 * 获取assets 静态资源
 * @author lyc
 * @date 2022-06-27
 */
export const getAssets = (url: string) => {
  if (!url) {
    return ''
  }
  url = url.startsWith('/') ? url : '/' + url
  return new URL(`../assets${url}`, import.meta.url).href
}
