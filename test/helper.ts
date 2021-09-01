export function sleep(period):Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, period)
    })
}

export function setElProperty(El, type, value) {
    Object.defineProperty(<HTMLElement>El, type, {
        configurable: true,
        value: value,
    })
}