describe('ocaduillustration.com', () => {
  beforeEach(() => {
    cy.visit('https://www.ocaduillustration.com')
  })

  it('displays all illustrators', () => {
    cy.get('.gallery-item').should('have.length', 48)
  })

  it('can open year selection panel', () => {
    cy.get('#year-select-link').click()
    cy.get('#panel-year-select').within(() => {
      cy.root()
        .should('be.visible')
        .find('.year-list-item')
        .should('have.length', 16)
        .first()
        .find('.year-item')
        .first()
        .should('have.text', '2022')
        .root()
        .find('.close-panel')
        .click()
        .wait(1000)
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
        .wait(1000)
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

describe('ocaduillustration.com/illustrators/*', () => {
  beforeEach(() => {
    cy.visit('https://www.ocaduillustration.com/illustrators/yiren-tang/')
  })

  const openModal = () => {
    cy.get('.gallery-item').first().within(() => {
      cy.root()
        .find('a')
        .click()
    })
  }

  it('displays all information', () => {
    cy.get('.illustrator-meta-wrapper-inner').should('be.visible')
    cy.get('.thesis-title').contains('A slice of life')
    cy.get('.illustrator-meta-name').contains('Yiren Tang')
    cy.get('.thesis-description p').invoke('text').should('have.length', 221)
    cy.get('.illustrator-meta-items a').should('have.length', 2)
  })

  it('displays navigation', () => {
    cy.get('.illustrator-nav-single-wrapper').should('be.visible')
    cy.get('.section-indicator-single')
      .click()
      .location('pathname').should('eq', '/year/2022/')
      .go('back')
    cy.get('.nav-previous a')
      .click()
      .location('pathname').should('eq', '/illustrators/xin/')
      .go('back')
    cy.get('.nav-next a')
      .click()
      .location('pathname').should('eq', '/illustrators/yoana-vasileva/')
  })

  it('displays all work', () => {
    cy.get('.gallery-item').should('have.length', 7)
    cy.get('#image-modal').should('be.hidden')
  })

  it('can clickthrough to an image', () => {
    openModal()
    cy.get('#image-modal').should('be.visible')
  })

  it('can close image modal', () => {
    openModal()
    cy.get('#image-modal').within(() => {
      cy.root()
        .find('.close-panel')
        .click()
        .wait(1000)
        .root()
        .should('be.hidden')
    })
  })

  it('can navigate image modal', () => {
    openModal()
    cy.get('#image-modal').within(() => {
      cy.root()
        .find('#full-image')
        .invoke('attr', 'src')
        .should('eq', 'https://www.ocaduillustration.com/files/yiren_tang_01.jpg')
        .root()
        .find('#full-image')
        .click()
        .wait(1000)
        .invoke('attr', 'src')
        .should('eq', 'https://www.ocaduillustration.com/files/yiren_tang_02.jpg')
    })
  })
})
