import VirtualList from './../../src/index.vue'
import { VirtualScrollExpose } from './../../src/index.d'
import ScrollItem from './help/dynamicScrollItem.vue'
import mock from './help/mock'

// selector
const container = '[data-testid=container]'
const loading = '[data-testid=loadingDown]'
const noMoreDataDown = '[data-testid=noMoreDataDown]'
// props
const loadingOptions = {
    loadingFn: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mock.getMessage(100)) 
            }, 1000)
        })
    },
    nomoredata: false
}

describe('loading mode test', () => {
    beforeEach(() => {
        cy.viewport(800, 1000)
        cy.mount(VirtualList, {
            props: {
                perPageItemNum: 40,
                scrollItem: ScrollItem,
                height: 42,
                loadingOptions,
                direction: 'down'
            },
            ref: 'VirtualList'
        }).as('component')
        cy.get('@component').its('componentVM.$.exposed').as('exposeFn')
        cy.get('@component').its('setProps').as('setProps')
    })

    it('loading data', () => {
        cy.get<VirtualScrollExpose>('@exposeFn').invoke('setSourceData', mock.getMessage(100))
        cy.spy(mock, 'getMessage').as('getMessage')
        cy.get<VirtualScrollExpose>('@exposeFn').invoke('locate', 99)
        cy.get('@getMessage').should('have.been.called')
        cy.get<VirtualScrollExpose>('@exposeFn').then(exposeFn => {
            cy.wrap(exposeFn.getData()).should('length', 200)
        })
    })
})