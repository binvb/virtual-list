const EventQueue: Function[] = []
let pending: boolean = false

function addQueue(event: Function) {
    EventQueue.push(event)
    if(!pending) {
        executionQueue(event)
    }
}

async function executionQueue(event: Function) {
    pending = true
    await event()
    EventQueue.shift()
    pending = false
    if(EventQueue.length) {
        executionQueue(EventQueue[0])
    }
}

export default addQueue