import VirtualList from './../../src/index.vue'
import { VirtualScrollExpose } from './../../src/index.d'
import ScrollItem from './help/dynamicScrollItem.vue'
import mock  from './help/mock'

// selector
const container = '[data-testid=container]'
const noMoreDataUp = '[data-testid=noMoreDataUp]'
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

describe('chat mode(dynamic) test', () => {
    beforeEach(() => {
        cy.viewport(800, 1000)
        cy.mount(VirtualList, {
            props: {
                perPageItemNum: 20,
                scrollItem: ScrollItem,
                height: 42,
                loadingOptions,
                direction: 'up'
            },
            ref: 'VirtualList'
        }).as('component')
        cy.get('@component').its('componentVM.$.exposed').as('exposeFn')
        cy.get('@component').its('setProps').as('setProps')
    })

    it('loading data', () => {
        // 设置初始消息
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await mock.getMessage(100)))
        // stub getMessage 函数
        cy.stub(loadingOptions, 'loadingFn').as('getMessage').callsFake(() => {
            return new Promise(resolve => {
                resolve(mock.getMessage(100)) 
            })
        })
        // 设置已loading所有数据
        cy.get<Function>('@setProps').then(setProps => {
            cy.get('@component').then(component => {
                setProps.call(component, {loadingOptions: {
                    loadingFn: loadingOptions.loadingFn,
                    nomoreData: true
                }})
                cy.get(noMoreDataUp).contains('no more data')
            })
        })
    })
    it('locate && get current viewport data', () => {
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await mock.getMessage(100)))
        cy.get<VirtualScrollExpose>('@exposeFn').invoke('locate', 33)
        cy.then(() => {
            cy.get<VirtualScrollExpose>('@exposeFn').invoke('getCurrentViewPortData').then(data => {
                cy.wrap(data[0]).its('index').should('eq', 33)
            })
        })
    })
    it('reset data', () => {
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => exposeFn.setSourceData(await mock.getMessage(100)))
        cy.get<VirtualScrollExpose>('@exposeFn').then(async(exposeFn) => {
            exposeFn.setSourceData(await mock.getMessage(15))
            cy.get('li').its('length').should('eq', 15)
        })
    })
})