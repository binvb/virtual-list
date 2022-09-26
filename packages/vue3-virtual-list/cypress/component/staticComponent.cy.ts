import VirtualList from './../../src/index.vue'
import { VirtualScrollExpose } from './../../src/index.d'
import StaticScrollItem from './staticScrollItem.vue'
import { getMessage } from './mock'

let exposeFn: VirtualScrollExpose
describe('test static scroll item', () => {
    beforeEach(() => {
        cy.viewport(800, 1000)
        cy.mount(VirtualList, {
            props: {
                initDataNum: 40,
                ScrollItemComponent: StaticScrollItem,
                retainHeightValue: 42
            },
            ref: 'VirtualList'
        }).then(componentInstance => {
            exposeFn = componentInstance.componentVM.$.exposed
        })
        cy.wait(1000) // wait for component mounted and set exposeFn 
    })
    it('static scroll item mount', async () => {
        exposeFn.setSourceData(await getMessage(10000))
        cy.get('li').should('have.length', 80)
    })
    it('locate and resetData', async() => {
        exposeFn.setSourceData(await getMessage(10000))
        cy.wait(1000)
        .then(async() => {
            exposeFn.locate(29)
            cy.wait(1000)
            exposeFn.setSourceData(await getMessage(35))
            cy.wait(1000).get('li').should('have.length', 35)
        })
    })
})