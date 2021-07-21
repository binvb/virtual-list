const EventQueue: Promise<void>[] = []
let pending: boolean = false

function addQueue(event: Promise<void>) {
    EventQueue.push(event)
    if(!pending) {
        executionQueue(event)
    }
}

async function executionQueue(event) {
    pending = true
    await event
    EventQueue.shift()
    pending = false
    if(EventQueue.length) {
        executionQueue(EventQueue[0])
    }
}

export default addQueue