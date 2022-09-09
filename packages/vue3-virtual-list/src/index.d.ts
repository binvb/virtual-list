import { ComponentPublicInstance } from 'vue'
export interface ItemProps{
  [key: string]: any,
  index: number,
  transformY: number,
  offsetHeight: number,
}
export type SourceData = Partial<ItemProps> & {
  [key: string]: any
}

type Mode = 'normal' | 'loading'
export interface ReactiveData {
  sourceData:  ItemProps[],
  currentData: ItemProps[],
  loading: boolean,
  scrolling: boolean,
  ajusting: boolen,
  componentID: String,
  listHeight: number,
  mode: Mode
}

export interface Observer {
  intersectionObserver: IntersectionObserver
  resizeObserver: ResizeObserver
}

export type VirtualScrollExpose =  {
  locate: (index: number) => void
  del: (index: number | number[]) => void
  add: (index: number, insertData: any[]) => void
  update: (index: number, data: any) => void
  setSourceData: (data: any[]) => void
  getData: () => ItemProps[],
  getCurrentViewPortData: () => ItemProps[]
}

export type Direction = 'up' | 'down' 

export type LoadingOptions = {
  loadingFn: () => Promise<SourceData[]>,
  loadingComponent?: ComponentPublicInstance,
  nomoreData?: boolean,
  nomoreDataText: String
}