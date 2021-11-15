export interface SourceData {
  [key: string]: any
}
export interface ItemProps extends SourceData{
  index: number,
  transformY: number,
  offsetHeight: number,
  isVisible: boolean
}
export interface ReactiveData {
  sourceData:  Partial<ItemProps>[],
  currentData: ItemProps[],
  templateData: Partial<ItemProps>,
  currentScrollTop: number
}

export type Direction = 'init' | 'up' | 'down' 