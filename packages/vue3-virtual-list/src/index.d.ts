import { ComponentPublicInstance } from 'vue'

export interface ItemBase {
  [key: string]: any
}
export interface ItemProps{
  index: number,
  transformY: number,
  offsetHeight: number,
  nanoid: string
}
export type SourceData = ItemProps & ItemBase
export interface ReactiveData {
  sourceData:  SourceData[], // all data
  currentData: SourceData[], // current rendering data
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
  add: (index: number, insertData: ItemBase[]) => void
  update: (index: number, data: ItemBase) => void
  setSourceData: (data: ItemBase[]) => void
  getData: () => ItemProps[],
  getCurrentViewPortData: () => ItemProps[]
}

export interface Props {
	scrollItem: ComponentPublicInstance
	perPageItemNum: number
	height: number
	direction?: Direction
	loadingOptions?: LoadingOptions
}
export interface VirtualListComponent {
  data: ReactiveData,
  observer: Observer,
  props: Props
}

export type Direction = 'up' | 'down' 

export interface LoadingOptions {
  loadingFn: () => Promise<ItemBase[]>,
  loadingComponent?: ComponentPublicInstance,
  nomoreData?: boolean,
  nomoreDataText?: string
}