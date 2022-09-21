import random from 'lodash/random'
import Chat from './../../example/src/test/chat.vue'

// selector
const sendBtn = '[data-testid=sendBtn]'
const sendContent = '[data-testid=sendContent]'

describe('chat mode test', () => {
    beforeEach(() => {
        cy.viewport(1200, 1200)
        cy.mount(Chat)
        cy.wait(3000)
    })
    
    it('add item and keep bottom position', () => {
        // 10 messages
        const times = 10

        for(let i = 0; i <= times; i += 1) {
            // random 0/1 content/image
            const _content = random(0,1)

            if(_content) {
                cy.get(sendContent).type(`${i}`)
            }
            cy.get(sendBtn).click()
            cy.wait(3000)
        }
    })
})