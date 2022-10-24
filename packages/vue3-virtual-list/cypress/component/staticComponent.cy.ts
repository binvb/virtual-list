import VirtualList from './../../src/index.vue'
import { VirtualScrollExpose } from './../../src/index.d'
import StaticScrollItem from './help/staticScrollItem.vue'
import { getMessage } from './help/mock'

// selector
const container = '[data-testid=container]'

describe('test static item', () => {
    // mount component and aliase expose function
    beforeEach(() => {
        cy.viewport(800, 1000)
        cy.mount(VirtualList, {
            props: {
                perPageItemNum: 40,
                scrollItem: StaticScrollItem,
                height: 42
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
        // locate but !sourceData.length
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(0)))
        cy.then(() => {
            cy.get<VirtualScrollExpose>('@exposeFn').then(exposeFn => exposeFn.locate(99))
        })
        cy.get<VirtualScrollExpose>('@exposeFn').then(exposeFn => {
            cy.wrap(exposeFn.getCurrentViewPortData()).its('length').should('eq', 0)
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
    it('add item', () => {
        // add data after index 12, 13 should be 14
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(100)))
        cy.get('li').eq(13).invoke('attr', 'data-key').as('addItemOld13')
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.add(12, await getMessage(1)))
        cy.get('li').eq(14).invoke('attr', 'data-key')
        .then(key => {
            cy.get('@addItemOld13').should('eq', key)
        })
    })
    it('delete item', () => {
        // 34 should replace 33
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(100)))
        cy.get('li').eq(34).invoke('attr', 'data-key').as('deleteTestAfterItem')
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.del(33))
        cy.get('li[data-index=33]').invoke('attr', 'data-key')
        .then(key => {
            cy.get('@deleteTestAfterItem').should('eq', key)
        })
        // del [21,25], 22 should replace 21, 27 should replace 25
        cy.get('li').eq(22).invoke('attr', 'data-key').as('deleteTestAfterItem22')
        cy.get('li').eq(27).invoke('attr', 'data-key').as('deleteTestAfterItem27')
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.del([21, 25]))
        cy.get('li[data-index=21]').invoke('attr', 'data-key')
        .then(key => {
            cy.get('@deleteTestAfterItem22').should('eq', key)
        })
        cy.get('li[data-index=25]').invoke('attr', 'data-key')
        .then(key => {
            cy.get('@deleteTestAfterItem27').should('eq', key)
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
    it('set data(locate && update && del)', () => {
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await getMessage(10000)))
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => {
            const updateData = await getMessage(1)[0]
            // locate
            exposeFn.locate(2343)
            cy.wrap(exposeFn.getCurrentViewPortData()[0]).its('index').should('eq', 2343)
            // update
            exposeFn.update(2345, updateData)
            if(updateData.content) {
                cy.get('[data-index=2345]').contains(updateData.content)
            } else {
                cy.get('[data-index=2345]').contains('empty')
            }
            // del
            cy.get('[data-index=2348]').invoke('attr', 'data-key').as('delBeforeKey2348')
            cy.wait(1000).then(() => {
                exposeFn.del(2346)
                cy.get('@delBeforeKey2348').then(delBeforeKey2348 => {
                    cy.wait(1000).get('[data-index=2347]').invoke('attr', 'data-key').should('eq', delBeforeKey2348)
                })
            })
        })
    })
})