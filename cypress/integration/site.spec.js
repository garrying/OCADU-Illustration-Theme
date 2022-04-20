describe('ocaduillustration.com', () => {
  beforeEach(() => {
    cy.visit('https://www.ocaduillustration.com')
  })

  it('displays all illustrators', () => {
    cy.get('.gallery-item').should('have.length', 83)
  })

  it('can open year selection panel', () => {
    cy.get('#year-select-link').click()
    cy.get('#panel-year-select').within(() => {
      cy.root()
        .should('be.visible')
        .find('.year-list-item')
        .should('have.length', 15)
        .first()
        .find('.year-item')
        .first()
        .should('have.text', '2021')
        .root()
        .find('.close-panel')
        .click()
        .root()
        .should('be.hidden')
    })
  })

  it('can search in panel', () => {
    cy.get('#search-link').click()
    cy.get('#panel-search').within(() => {
      cy.root()
        .should('be.visible')
        .get('input[type=search]').type('Alex')
        .get('.autoComplete_result').should('have.length', 5)
        .first()
        .click()
        .location('pathname').should('eq', '/illustrators/alexandria-solorzano-caruso/')
    })
  })

  it('can open search', () => {
    cy.get('#search-link').click()
    cy.get('#panel-search').within(() => {
      cy.root()
        .should('be.visible')
        .get('input[type=search]').type('Alex')
        .root()
        .find('.close-panel')
        .click()
        .root()
        .should('be.hidden')
    })
  })

  it('can show illustrator bubble', () => {
    cy.get('.gallery-item').first().within(() => {
      cy.root()
        .find('.illustrator-meta-container')
        .wait(100)
        .should('be.hidden')
        .root()
        .trigger('mouseover')
        .find('.illustrator-meta-container')
        .wait(100)
        .should('be.visible')
        .find('h2, h3').should('have.length', 2)
        .invoke('text').should('have.length.gt', 10)
    })
  })

  it('can clickthrough to an illustrator', () => {
    cy.get('.gallery-item').first().within(() => {
      cy.root()
        .find('a')
        .click()
    })
  })

  it('can clickthrough to a year', () => {
    cy.get('#year-select-link').click()
    cy.get('#panel-year-select').within(() => {
      cy.root()
        .find('.year-item')
        .first()
        .click()
    })
  })
})
