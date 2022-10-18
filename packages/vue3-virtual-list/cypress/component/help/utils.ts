/**
 * get random number between start to end
 * @param {*} start 
 * @param {*} end 
 * @returns 
 */
 export function getRandom(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start) + start)
  }