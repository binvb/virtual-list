import VirtualList from './../../src/index.vue'
import { VirtualScrollExpose } from './../../src/index.d'
import ScrollItem from './dynamicScrollItem.vue'
import { getMessage } from './mock'

// expose function
let exposeFn: VirtualScrollExpose
// selector
const container = '[data-testid=container]'
// default setting
const height = 1000

describe('chat mode(dynamic) test', () => {
    beforeEach(() => {
        cy.viewport(800, height)
        cy.mount(VirtualList, {
            props: {
                initDataNum: 20,
                ScrollItemComponent: ScrollItem,
                retainHeightValue: 500,
                loadingOptions: {
                    loadingFn: getMessage(100),
                    nomoreData: false
                },
                direction: 'up'
            },
            ref: 'VirtualList'
        })
        .then(componentInstance => {
            exposeFn = componentInstance.componentVM.$.exposed
        })
        cy.wait(1000) // wait for component mounted and set exposeFn 
    })
    
    it('mounted at bottom position', async() => {
        exposeFn.setSourceData(await getMessage(100))
        cy.wait(100).get(container).invoke('scrollTop')
        .then(scrollTop => {
            cy.get('.fishUI-virtual-list__inner').should('have.css', 'height', `${scrollTop! + height}px`)
        })
    })
    it('add item and keep bottom position',async() => {
        exposeFn.setSourceData(await getMessage(100))
        const listLenth = exposeFn.getData().length
        const msgNum = 100

        for(let i = 0; i < msgNum; i += 1) {
            cy.wait(500)
            .then(async() => {
                exposeFn.add(listLenth + i, getMessage(1))
                cy.wait(500).get(container).invoke('scrollTop')
                .then(scrollTop => {
                    cy.get('.fishUI-virtual-list__inner').should('have.css', 'height', `${scrollTop! + height}px`)
                })
            })
        }
    })
})