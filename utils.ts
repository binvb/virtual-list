interface ItemProps {
  [key: string]: any,
  index: number,
  transformY: number
}

export function getInitData(arg: any[], max) {
  let _initData:ItemProps[] = []

  for(let i = 0, len = max; i < len; i++) {
    if(arg[i]) {
      _initData.push({...arg[i], index: i, transformY: 0})
    }
  }

  return _initData
}