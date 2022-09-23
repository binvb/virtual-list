import Normal from './../../example/src/test/normal.vue'

// selector
const container = '[data-testid=container]'
// locate
const locateNum = '[data-testid=locateNum]'
const locateTo = '[data-testid=locateTo]'
// update
const updateNum = '[date-testid=updateNum]'
const updateBtn = '[data-testid=updateBtn]'
// del
const delNum = '[data-testid=delNum]'
const delBtn = '[data-testid=delBtn]'
// add
const addNum = '[data-testid=addNum]'
const addBtn = '[data-testid=addBtn]'

describe('nomal mode test', () => {
  beforeEach(() => {
    cy.viewport(1200, 1200)
    cy.mount(Normal)
  }) 
  it('mount', () => {
    // should render 40 scroll item
    cy.get('li').should('have.length', 40)
  }) 
  it('locate at 100', () => {
    cy.wait(3000) // wait for message
    cy.get(locateNum).clear().type('100')
    cy.get(locateTo).click()
    
    cy.wait(100).get(container).find('div').invoke('scrollTop')
    .then(scrollTop => {
      cy.get('li').eq(20).should('have.css', 'transform', `matrix(1, 0, 0, 1, 0, ${scrollTop})`)
    })
  })
  it('update item', () => {
    cy.get('.bubble').eq(3).invoke('text')
    .then(content => {
      cy.get(updateNum).clear().type('3')
      cy.get(updateBtn).click()
      cy.wait(100).get('.bubble').eq(3).invoke('text').should('not.eq', content)
    })
  })
  it('del item', () => {
    cy.get('li').eq(5).invoke('attr', 'data-key')
    .then(key => {
      cy.get(delNum).clear().type('5')
      cy.get(delBtn).click()

      cy.wait(100).get('li').eq(5).invoke('attr', 'data-key').should('not.eq', key)
    })
  })
  it('add item', () => {
    cy.get('li').eq(5).invoke('attr', 'data-key')
    .then(key => {
      cy.get(addNum).clear().type('5')
      cy.get(addBtn).click()

      cy.wait(100).get('li').eq(5).invoke('attr', 'data-key').should('not.eq', key)
    })
  })
})