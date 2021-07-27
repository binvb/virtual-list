export function sleep(period):Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, period)
    })
}