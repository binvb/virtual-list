export function addTombStoneProperty(arg: any[], offsetHeight: any) {
    arg.map(element => {
        return Object.assign(element, {isTombstone: true, offsetHeight})
    })
    
    return arg
}