import { Component } from 'vue'

interface SouceData {
  [key: string]: any
}

export interface Props {
  sourceData: SouceData[],
  ScrollItemComponent: Component,
  initDataNum: number
}

export interface ItemProps {
  [key: string]: any,
  index: number,
  transformY: number,
  isVisible: boolean
}