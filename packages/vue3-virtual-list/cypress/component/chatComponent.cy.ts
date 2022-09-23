import VirtualList from './../../src/index.vue'
import { VirtualScrollExpose } from './../../src/index.d'
import ScrollItem from './scrollItem.vue'
import { getMessage } from './mock'

// expose function
let exposeFn: VirtualScrollExpose
// selector
const container = '[data-testid=container]'
// default setting
const height = 1000

describe('chat mode test', () => {
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
        .then(instance => {
            exposeFn = instance.componentVM.$.exposed
        })
        cy.wait(1000) // wait for component mounted and set exposeFn 
    })
    
    // it('mounted at bottom position', async() => {
    //     exposeFn.setSourceData(await getMessage(100))
    //     cy.wait(100).get(container).invoke('scrollTop')
    //     .then(scrollTop => {
    //         cy.get('.fishUI-virtual-list__inner').should('have.css', 'height', `${scrollTop! + height}px`)
    //     })
    // })
    // it('add item and keep bottom position',async() => {
    //     exposeFn.setSourceData(await getMessage(100))
    //     const listLenth = exposeFn.getData().length
    //     cy.wait(5000)
    //     exposeFn.add(listLenth, await getMessage(1))
    //     // cy.wait(1000).get(container).invoke('scrollTop')
    //     // .then(scrollTop => {
    //     //     cy.get('.fishUI-virtual-list__inner').should('have.css', 'height', `${scrollTop! + height}px`)
    //     // })
    // })
    it('test', async() => {
        exposeFn.setSourceData(await getMessage(20))
        cy.wait(1000)
        for(let i = 0; i < 1000; i += 1){
            cy.wait(20).then(async() => {
                // exposeFn.locate(55)
                // cy.wait(2000).then(async() => {
                //     exposeFn.setSourceData(await getMessage(100))
                // })
                const listLenth = exposeFn.getData().length
                exposeFn.update(listLenth-2, await getMessage(1)[0])
                exposeFn.add(listLenth, await getMessage(1))
            })
            // cy.wait(500).then(async() => {
            //     const list = await exposeFn.getData()
            //     for(let j = 0, len = list.length; j < len; j += 1) {
            //         if(j > 0) {
            //             if(list[j].transformY != list[j - 1].offsetHeight + list[j - 1].transformY) {
            //                 debugger
            //             }
            //         }
            //     }
            // })
        }
    })
})