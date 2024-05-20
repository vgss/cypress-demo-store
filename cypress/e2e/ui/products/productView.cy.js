describe('Select a Product', () => {
	beforeEach(() => {
        cy.accessStore(Cypress.env('country'))
        
        cy.fixture('products').then((data) => { 
            cy.wrap(data.products[0]).as('product')
        })
        cy.get('@product').then(product => {
            const productName = product.productName
            const productUrl = `${product.productUrl}/${product.productId}`
            cy.selectProduct(productName, productUrl)
        })
	})

	it('returns expected infos from product page', () => {
        cy.get('@product').then(product => {
            // product image
            cy.get('.swiper-slide-active > .w-full').should('exist')
    
            // product name
            cy.get('.text-3xl')
            .should('exist')
            .should('contain.text', product.productName)
    
            // product current price
            cy.get('.flex > .text-black')
            .should('exist')
            .and('contain.text', product.currentPrice)
    
            // product original price
            cy.get('.line-through')
            .should('exist')
            .and('contain.text', product.originalPrice)
    
            // choose colors
            cy.get(':nth-child(1) > .text-gray-800').contains('Colors')
    
            // choose size
            cy.get(':nth-child(2) > .text-gray-800').contains('Choose size')
    
            // add to cart button
            cy.get('.grow-0 > .block')
            .should('be.visible')
            .and('contain.text', 'Add to cart')
            .and('not.be.disabled')
    
            // product info
            cy.get('[data-testid="accordion-title"]')
            .should('be.visible')
            .and('contain.text', 'Product info')
        })
	})
})