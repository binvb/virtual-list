export function sleep(period = 0):Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, period)
  })
}

export function getOffsetHeight(el:HTMLElement) {
  return el.offsetHeight
}

export function ArrayToArrayLike() {
  
}