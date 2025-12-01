/**
 * 引用assets下的图片
 * @param fileName 图片名
 * @returns 返回图片地址
 */
export const getAssetsFile = (fileName: string) => {
  return new URL(`../assets/images/${fileName}`, import.meta.url).href
}
