describe('Cart', () => {
    let numberProductsCart;

    context('Cart Empty', () => {
        beforeEach(() => {
            // remove all products in cart
            cy.accessStore(Cypress.env('country'))
            // cy.location('pathname').should('contain.text', `https://demo-store.commercelayer.app/cart`)
            cy.get('.w-auto > .block.relative').should('be.visible').click()
            cy.origin('https://demo-store.commercelayer.app', () => {
                cy.get('[data-test-id="total-amount"]').should('be.visible').then( () => {
                    cy.get('#root > .items-start').then(($body) => {
                        if ($body.find('[data-test-id="button-remove-item"]').length > 0) {
                            cy.get('[data-test-id="button-remove-item"]').then(($buttons) => {
                                if ($buttons.length > 0) {
                                    $buttons.each((index, button) => {
                                        cy.wrap(button).click()
                                        cy.wait(500)
                                    })
                                }
                            })
                        }
                    })
                })
            })
            cy.accessStore(Cypress.env('country'))
        })

        it('should returns empty and does not allow to checkout proccess', () => {
            // access the cart page
            cy.get('.w-auto > .block.relative').should('be.visible').click()
            cy.origin('https://demo-store.commercelayer.app', () => {
                cy.get('[data-test-id="button-checkout"]')
                .should('be.visible')
                .and('be.disabled')

                cy.get('.w-full > .text-lg')
                .should('exist')
                .and('contain.text', 'Your cart is empty')
            })
        })

        it('should contains no number in the cart icon', () => {
            cy.get('.bottom-0 > .text-white').should('not.be.visible')
        })
    })

    beforeEach(() => {
        cy.accessStore(Cypress.env('country'))
        
        cy.fixture('products').then((data) => { 
            cy.wrap(data.products[0]).as('product')
        })

        cy.get('.bottom-0 > .text-white').invoke('text').then( ($number) => {
            if ($number == '-1' ) {
                numberProductsCart = 0
            } else { numberProductsCart = $number }

        })
	})
    
	it('cart icon add +1 item when a product is added', () => {
        cy.get('@product').then(product => {
            const productName = product.productName
            const productUrl = `${product.productUrl}/${product.productId}`
            cy.addProductCart(productName, productUrl)
        })
        let num = Number(numberProductsCart) + 1
        cy.get('.bottom-0 > .text-white')
        .should('be.visible')
        .and('contain.text', `${num}`)
	})

    it('should list the product added to the cart', () => {
        cy.get('@product').then(product => {
            const productName = product.productName
            const productUrl = `${product.productUrl}/${product.productId}`
            cy.addProductCart(productName, productUrl).then( () => {
                cy.get('.w-auto > .block.relative').should('be.visible').click()
            })

            cy.origin('https://demo-store.commercelayer.app',  { args: { product } }, ({ product }) => { 
                // product image
                cy.get(`[data-testid="line-item-image-${product.productId}"]`)
                .should('be.visible')

                // product name
                cy.get(`[data-testid="line-item-name-${product.productId}"]`)
                .should('exist')
                .and('contain.text', product.productName)

                // amount of products
                cy.get('[data-test-id="input-spinner-element"]')
                .should('exist')
                .and('have.value', 1)

                // current price
                cy.get('.text-lg')
                .should('exist')
                .and('contain.text', product.currentPrice)

                cy.get('[data-test-id="button-checkout"]')
                .should('be.visible')
                .and('not.be.disabled')
            })
        })
	})
})