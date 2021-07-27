import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import App from './../example/src/App.vue'

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

describe('scroll component init data', () => {
    it('init data render', async function () {
        document.body.innerHTML = ''
        _mount(App, {
            props: {
                initDataNum: 18
            }
        })
        await nextTick()
        expect(document.querySelectorAll('ul[data-testid="scroll-wrap"] li')).toHaveLength(18)
    })
})

describe('scroll component init property', () => {
    document.querySelectorAll('ul[data-testid="scroll-wrap"] li').forEach((element, index) => {
        let _preItemStyleTransform

        it(`each item position index: ${index}`, () => {
            const _styleTransform = element[0].style.transform
            const _element = <HTMLElement>document.querySelectorAll('ul[data-testid="scroll-wrap"] li')[index === 0 ? 0 : index - 1]
            
            if(index === 0) {
                expect(_styleTransform).toBe('translateY(0px)')
            } else if(_element){
                expect(_styleTransform).toBe(`translateY(${_preItemStyleTransform + _element?.offsetHeight}px)`)
            }
            _preItemStyleTransform = _styleTransform
        })
    })
})