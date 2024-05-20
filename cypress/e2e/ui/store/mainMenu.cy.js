describe('Main Menu', () => {
	beforeEach(() => {
        cy.accessStore(Cypress.env('country'))
	})

	it('should contains all the registered categories', () => {
        cy.fixture('products').then((data) => {
            // Checking america countries
            data.categories.forEach((category) => {
                if (category == "Home & Living") {
                    cy.get(`.hidden > [href="/demo-store-core/en-BR/search/home-and-living"]`).contains(category).should('exist')
                } else { cy.get(`.hidden > [href="/demo-store-core/en-BR/search/${category.toLowerCase()}"]`).contains(category).should('exist') }
                
            })
	    })
    })

    it('redirects to the Accessories product page', () => {
        cy.accessProductCategory('accessories')

        cy.get('.text-2xl').contains("Accessories")
    })

    it('redirects to the Bags product page', () => {
        cy.accessProductCategory('bags')

        cy.get('.text-2xl').contains("Bags")
    })

    it('redirects to the Hats product page', () => {
        cy.accessProductCategory('hats')

        cy.get('.text-2xl').contains("Hats")
    })

    it('redirects to the Home & Living product page', () => {
        cy.accessProductCategory('home-and-living')

        cy.get('.text-2xl').contains("Home & Living")
    })

    it('redirects to the Shirts product page', () => {
        cy.accessProductCategory('shirts')

        cy.get('.text-2xl').contains("Shirts")
    })

    it('redirects to the Sweatshirts product page', () => {
        cy.accessProductCategory('sweatshirts')

        cy.get('.text-2xl').contains("Sweatshirts")
    })
})