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
 * 获取需要展示的item,
 * @param sourceData
 * @param list 
 * @param direction 
 * @param index 
 * @param height 
 */
export function getShowData(sourceData: ItemProps[], list: ItemProps[], direction:Direction = 'down', index:number, offsetHeight: number, initDataNum: number, scrollTop:number):void {
  let _transformY
  let _data
  let _itemSeat = getReserveItemNum(list, scrollTop)

  switch(direction) {
    case 'init':
      _data = getInnerIndex(list, index > 0 ? index - 1 : 0)
      _transformY = _data ? _data.transformY + _data.offsetHeight : 0
      list.splice(index, 1, {...sourceData[index], offsetHeight, transformY: _transformY})
      break;
    case 'down':
      _data = getInnerIndex(list, index - 1)
      _transformY = _data ? _data.transformY + _data.offsetHeight : 0
      list.push({...sourceData[index], offsetHeight, transformY: _transformY})
      if(_itemSeat.beforeItemNum >= initDataNum) {
        list.shift()
      }
      break
    case 'up':
      _data = getInnerIndex(list, index + 1)
      _transformY = _data ? _data.transformY - offsetHeight : 0
      list.unshift({...sourceData[index], offsetHeight, transformY: _transformY})
      if(_itemSeat.afterItemNum >= initDataNum * 2) {
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
  return false
}

/**
 * 滚动事件监听，获取滚动距离的 item 数量
 * @param list 
 * @param distance 
 * @param direction 
 * @returns 
 */
export function getScrollItemNum(list:ItemProps[], distance: number, direction: Direction = 'down'): number {
  let _calculatorItemHeight = 0
  let _itemNum = 0
  let _len = list.length

  distance = Math.abs(distance)
  while(_calculatorItemHeight < distance) {
    if(direction === 'down') {
      _calculatorItemHeight += list[_itemNum].offsetHeight
    }
    if(direction === 'up') {
      _calculatorItemHeight += list[_len - 1 - _itemNum].offsetHeight
    }
    if(distance > _calculatorItemHeight) {
      _itemNum++ 
    }
  }
  return _itemNum
}

/**
 * 获取距离当前scrollTop item的前后item数量，保证在回收数据时候不会影响后续顺滑滚动
 * @param list 
 * @param scrollTop 
 * @param direction 
 */
export function getReserveItemNum(list:ItemProps[], scrollTop: number) {
  let _beforeListLen = 0
  let _afterListLen = 0

  list.forEach((element, index) => {
    if(scrollTop >= list[index].transformY) {
      _beforeListLen += 1
    } else {
      _afterListLen += 1
    }
  })

  return {
    beforeItemNum: _beforeListLen,
    afterItemNum: _afterListLen
  }
}