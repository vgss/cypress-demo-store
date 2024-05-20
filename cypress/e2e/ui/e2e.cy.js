describe('Complete a order', () => {
	beforeEach(() => { 
		cy.visit('')

		cy.fixture('products').then((data) => { 
            cy.wrap(data.products[0]).as('product')
        })
		cy.fixture('customers').then((data) => { 
            cy.wrap(data).as('customer')
        })
	})
	// simple example e2e
	it('As an user I want to be able to search for a black shirt so that add to the cart and order to my address', () => {
		cy.selectRegion()
		cy.get('@product').then(product => {
			cy.addProductCart(product.productName, `${product.productUrl}/${product.productId}`)
			cy.goToCart()
			cy.checkoutProduct(product, 1)
		})
		cy.checkCustomerForm()
		cy.get('@customer').then(customer => {
            cy.placeAnOrder(customer)
        })
		cy.checkOrderSuccess()
	})
})