describe('Order Product', () => {
	beforeEach(() => {
        cy.accessStore(Cypress.env('country'))
        
        cy.fixture('products').then((data) => { 
            cy.wrap(data.products[0]).as('product')
        })

        cy.fixture('customers').then((data) => { 
            cy.wrap(data).as('customer')
        })

        cy.get('@product').then(product => {
            const productName = product.productName
            const productUrl = `${product.productUrl}/${product.productId}`
            cy.addProductCart(productName, productUrl)
            cy.goToCart()
        })
        cy.origin('https://demo-store.commercelayer.app',  () => {
            cy.get('[data-test-id="button-checkout"]')
            .should('be.visible')
            .and('not.be.disabled')
            .click()
        })
	})

	it('should shows the order summary', () => {
        cy.get('@product').then(product => {
            cy.origin('https://demo-store.commercelayer.app',  { args: { product } }, ({ product }) => {
                //check all informartion about order summary
                cy.get(`[data-testid="order-summary"]`).should('exist')

                cy.get(`[data-testid="test-summary"]`).should('exist')
                // product image
                cy.get(`[data-testid="line-item-image-${product.productId}"]`)
                .should('be.visible')

                // product name
                cy.get(`[data-testid="line-item-name-${product.productId}"]`)
                .should('exist')
                .and('contain.text', product.productName)
                    
                // product price
                cy.get(`[data-testid="line-item-amount"]`)
                .should('exist')
                .and('contain.text', product.currentPrice)

                // check total price and taxes component
                cy.get('.styled__AmountWrapper-sc-1ymmtm9-5').should('exist')
                cy.get(`[data-testid="input_giftcard_coupon"]`).should('exist')
                cy.get('.dpNqkh').should('exist').and('contain.text', 'Return to cart')

                cy.get('[data-testid="line-items-skus"]').should('have.length', 1).then( () => {
                    // product current price
                    cy.get('.feinrg')
                    .should('exist')
                    .and('contain.text', 'QUANTITY: 1')

                    cy.get('[data-testid="total-amount"]')
                    .should('exist')
                    .and('contain.text', product.currentPrice)
                })
            })
        })
	})

    it('should shows checkout customer form', () => {
        cy.checkCustomerForm()
	})

    it('should shows error message when email is not in the format', () => {
        cy.origin('https://demo-store.commercelayer.app', () => { 
            cy.get('[data-testid="customer_email"]').should('be.visible').type('testnoemail')
            cy.get('[data-testid="input_billing_address_first_name"]').should('exist').click()
            cy.get('[data-testid="customer_email_error"]')
            .should('be.visible')
            .and('contain.text', 'Please enter a valid email')
        })
	})

    it('should allows to continue delivery when all required inputs are filled', () => {
        cy.get('@customer').then(customer => {
            cy.fillRequiredCustomerInputs(customer)
        })
	})

    it('should returns order confirmation number after place an order', () => {
        cy.get('@customer').then(customer => {
            cy.placeAnOrder(customer)

            cy.origin('https://demo-store.commercelayer.app', () => { 
                cy.get('[data-testid="complete-checkout-summary"]', { timeout: 10000 })
                .should('exist')
                .and('contain.text', 'Order confirmation number:')
    
                cy.get('[data-testid="complete-checkout-summary"] > .text-black')
                .should('exist')
                .and('contain.text', '#')
            })
        })
	})
})