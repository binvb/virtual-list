import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import App from './../example/src/App.vue'
import * as helper from './helper'

const _mount = (component, options) => {
    return mount(component, Object.assign({props: {}}, options, {attachTo: document.body}))
}

afterEach(() => {
    document.body.innerHTML = ''
})
beforeEach(async () => {
    _mount(App, {
        props: {
            initDataNum: 20
        }
    })
    await nextTick()
})

describe('🎏 scroll component init data', () => {
    it('init data render', async function () {
        document.body.innerHTML = ''
        const wrapper = _mount(App, {
            props: {
                initDataNum: 18
            }
        })
        await nextTick()
        expect(document.querySelectorAll('ul[data-testid="scroll-wrapper"] li')).toHaveLength(18)
    })
})
describe('🎏 scroll component init property', () => {
    let _preItemStyleTransform = 0

    for(let i = 0; i < 20; i ++) {
        it(`🎏 each item position index: ${i}`, () => {
            const _element = <HTMLElement>document.querySelectorAll('ul[data-testid="scroll-wrapper"] li')[i === 0 ? 0 : i - 1]
            const _styleTransform = _element.style.transform
            
            if(i === 0) {
                expect(_styleTransform).toBe('translateY(0px)')
            } else if(_element){
                expect(_styleTransform).toBe(`translateY(${_preItemStyleTransform + _element?.offsetHeight}px)`)
            }
            _preItemStyleTransform += _element?.offsetHeight
        })
    }
})


describe('scroll action', () => {
    it('🎏 direction "vertical" && scroll 100px', async () => {
        let _currentIndex = 0
        let _eleTranslateY = 0
        let _nodeList = document.querySelectorAll('ul[data-testid="scroll-wrapper"] li')

        document.querySelector('ul[data-testid="scroll-wrapper"]').scrollTop = 100
        await helper.sleep(1000)
        _nodeList.forEach((element:HTMLElement, index) => {
            _eleTranslateY += element.offsetHeight

            if(_eleTranslateY > 100) {
                _currentIndex = index > 0 ? index - 1 : 0
            }
        })
        expect(document.querySelectorAll('ul[data-testid="scroll-wrapper"] li')).toHaveLength(20 + _currentIndex + 1)
    })
})