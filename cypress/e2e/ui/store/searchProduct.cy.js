describe('Search for Product', () => {
	beforeEach(() => {
        cy.accessStore('en-BR')
        
        cy.fixture('products').then((data) => { 
            cy.wrap(data.products[0]).as('product')
        })
	})

	it('returns 0 results when store does not the product', () => {
        const productName = "not exists this product test"
		cy.searchProduct(productName)

        cy.checkProducts(0 , productName)
	})

    it('returns x results when store has the product', () => {
        cy.get('@product').then(product => {
            const productName = product.productName
            const numberOfProducts = product.similarProducts + 1

            cy.searchProduct(productName)

            cy.checkProducts(numberOfProducts , productName)
        
            cy.get('.grid').children().then($children => {
                const count = $children.length
            
                expect(count).to.be.equal(numberOfProducts)
            });
            cy.location('pathname').should('be.equal', '/demo-store-core/en-BR/search')
        })
	})

    it('should return at least the seached product', () => {
        cy.get('@product').then(product => {
            const productName = product.productName
            const numberOfProducts = product.similarProducts + 1
            var count = 0
            cy.searchProduct(productName)

            cy.checkProducts(numberOfProducts , productName)
            
            cy.get('.grid').children().each(($child) => {
                cy.wrap($child).invoke('text').then((text) => {   
                    if (text == productName) {
                        count = count + 1
                    }
                }) 
            }).then(() => {
                expect(count).to.be.equal(1)
            }) 
        })
	})
})