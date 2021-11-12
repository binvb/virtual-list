import { ItemProps, Direction } from './index'
/**
 * sleep function
 * @param period 中断时间，单位ms
 * @returns 
 */
export function sleep(period = 0):Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, period)
  })
}
/**
 * 获取元素高度
 * @param el HTMLElement
 * @returns 
 */
export function getOffsetHeight(el:HTMLElement):number {
  return el.offsetHeight || 0
}

/**
 * 获取需要展示的item
 * @param sourceData
 * @param list 
 * @param direction 
 * @param index 
 * @param height 
 */
export function getShowData(sourceData: ItemProps[], list: ItemProps[], direction:Direction = 'down', index:number, offsetHeight: number, initDataNum: number):void {
  let transformY
  let len = list.length
  let data

  switch(direction) {
    case 'init':
      data = getInnerIndex(list, index > 0 ? index - 1 : 0)
      transformY = data ? data.transformY + data.offsetHeight : 0
      list.splice(index, 1, {...sourceData[index], offsetHeight, transformY})
      break;
    case 'down':
      data = getInnerIndex(list, index - 1)
      transformY = data ? data.transformY + data.offsetHeight : 0
      list.push({...sourceData[index], offsetHeight, transformY})
      if(len >= initDataNum * 3) {
        list.shift()
      }
      break
    case 'up':
      data = getInnerIndex(list, index + 1)
      transformY = data ? data.transformY - data.offsetHeight : 0
      list.unshift({...sourceData[index], offsetHeight, transformY})
      if(len >= initDataNum * 3) {
        list.pop()
      }
      break
  }
}

/**
 * 获取元素内部的index
 * @param list 
 * @param index 
 * @returns 
 */
function getInnerIndex(list, index) {
  for(let i = 0, len = list.length; i < len; i++) {
    if(list[i].index === index) {
      return list[i]
    }
  }
}

/**
 * 获取滚动距离的 item 数量
 * @param list 
 * @param distance 
 * @param direction 
 * @returns 
 */
export function getScrollItemNum(list:ItemProps[], distance: number, direction: Direction = 'down'): number {
  let calculatorItemHeight = 0
  let itemNum = 0
  let _len = list.length

  distance = Math.abs(distance)
  while(calculatorItemHeight < distance) {
    if(direction === 'down') {
      calculatorItemHeight += list[itemNum].offsetHeight
    }
    if(direction === 'up') {
      try {
        calculatorItemHeight += list[_len - 1 - itemNum].offsetHeight
      } catch(err) {
        console.log(itemNum, _len, '再看')
      }
    }
    if(distance > calculatorItemHeight) {
      itemNum++ 
    }
  }
  return itemNum
}

export function getScrolltopItemIndex(list, scrollTop) {

}