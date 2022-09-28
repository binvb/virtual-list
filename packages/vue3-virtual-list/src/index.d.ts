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
export interface ReactiveData {
  sourceData:  ItemProps[], // all data
  currentData: ItemProps[], // current rendering data
  loading: boolean, // loading data
  scrolling: boolean, // scrolling
  ajusting: boolean, // scrolling compensation
  componentID: String, // unique id
  listHeight: number, // list offsetheight
  locationPosition: number, // locate position
  userScrolling: boolean // user scrolling
}

export interface Observer {
  intersectionObserver: IntersectionObserver
  resizeObserver: ResizeObserver
}

export interface VirtualScrollExpose {
  locate: (index: number) => void
  del: (index: number | number[]) => void
  add: (index: number, insertData: any[]) => void
  update: (index: number, data: any) => void
  setSourceData: (data: any[]) => void
  getData: () => ItemProps[],
  getCurrentViewPortData: () => ItemProps[]
}

export type Direction = 'up' | 'down' 

export interface LoadingOptions {
  loadingFn: () => Promise<any[]>,
  loadingComponent?: ComponentPublicInstance,
  nomoreData?: boolean,
  nomoreDataText?: string
}