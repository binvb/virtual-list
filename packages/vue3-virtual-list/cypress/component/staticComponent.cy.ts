import VirtualList from './../../src/index.vue'
import { VirtualScrollExpose } from './../../src/index.d'
import StaticScrollItem from './staticScrollItem.vue'
import { getMessage } from './mock'

// selector
const container = '[data-testid=container]'

describe('test static item', () => {
    // mount component and aliase expose function
    beforeEach(() => {
        cy.viewport(800, 1000)
        cy.mount(VirtualList, {
            props: {
                initDataNum: 40,
                ScrollItemComponent: StaticScrollItem,
                retainHeightValue: 42
            },
            ref: 'VirtualList'
        }).its('componentVM.$.exposed').as('exposeFn')
    })
    it('setSourceData', () => {
        // set source data
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(10000)))
        cy.get('li').should('have.length', 80)
    })
    it('locate', () => {
        // scrollTop should equal to located item's transformY
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(10000)))
        cy.then(() => {
            cy.get<VirtualScrollExpose>('@exposeFn').then(exposeFn => exposeFn.locate(99))
        })
        cy.get('li').should('have.length', 80)
        cy.get(container).invoke('scrollTop')
        .then(scrollTop => {
            cy.get('li[data-index="99"]').should('have.css', 'transform', `matrix(1, 0, 0, 1, 0, ${scrollTop})`)
        })
    })
    it('update item index 10', () => {
        // content should change
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(100)))
        cy.get('li[data-index=10]').find('div').invoke('text').as('updateTestOldContent')
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.update(10, getMessage(1)[0]))
        cy.get('li[data-index=10]').find('div').invoke('text')
        .then(content => {
            cy.get('@updateTestOldContent').should('not.be', content)
        })
    })
    it('delete item index 33', () => {
        // 34 should replace 33
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(100)))
        cy.get('li').eq(34).invoke('attr', 'data-key').as('deleteTestAfterItem')
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.del(33))
        cy.get('li').eq(33).invoke('attr', 'data-key')
        .then(key => {
            cy.get('@deleteTestAfterItem').should('eq', key)
        })
    })
    it('locate item index 88 and reset 80 length data', () => {
        // current data should be refresh(all in current source data)
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(300)))
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.locate(43))
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(45)))
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => {
            const list = exposeFn.getData()
            cy.get('li').each((item, index) => {
                cy.wrap(item).invoke('attr', 'data-key').then(key => {
                    expect(list.filter(listChild => listChild.nanoid === key)).length(1)
                })
            })
        })
    })
})