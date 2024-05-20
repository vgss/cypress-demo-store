
Cypress.Commands.add('ui_checkAvailableCountries', () => {
    cy.fixture('countries').then((data) => {
        // Checking america countries
        data.america.forEach((country) => {
            cy.get('.CountrySelector_accordionContainer__cVZbh > :nth-child(1)').contains(country).should('exist')
        })

        // Checking europe countries
        data.europe.forEach((country) => {
            cy.get('.CountrySelector_accordionContainer__cVZbh > :nth-child(2)').contains(country).should('exist');
        })

        // Checking oceania countries
        data.oceania.forEach((country) => {
            cy.get('.CountrySelector_accordionContainer__cVZbh > :nth-child(3)').contains(country).should('exist');
        })

        // Checking asia countries
        data.asia.forEach((country) => {
            cy.get('.CountrySelector_accordionContainer__cVZbh > :nth-child(4)').contains(country).should('exist');
        })

        // Checking africa countries
        data.africa.forEach((country) => {
            cy.get('.CountrySelector_accordionContainer__cVZbh > :nth-child(5)').contains(country).should('exist');
        })
    })
})

Cypress.Commands.add('selectRegion', (country = Cypress.env('country')) => {
    cy.get(`[href="/demo-store-core/${country}"]`).click()
    cy.location('pathname').should('be.equal', `/demo-store-core/${country}`)
      
})

Cypress.Commands.add('accessStore', (country = $Cypress.env('country')) => {
    cy.visit(`${Cypress.config('baseUrl')}/${country}`)
    cy.location('pathname').should('be.equal', `/demo-store-core/${country}`)
      
})

Cypress.Commands.add('searchProduct', (product) => {
    cy.get('.block.relative').eq(2).should('be.visible')
    cy.get('.form-input').should('be.visible').click()
    cy.get('.form-input').should('be.visible').type(product+'{enter}')
})

Cypress.Commands.add('checkUrlSearch', (productName) => {
    const queryName = productName.replace(/ /g, '%20')
    cy.location('pathname').should('be.equal', `/demo-store-core/${Cypress.env('country')}/search?q=${queryName}`)
})

Cypress.Commands.add('accessProductCategory', (category) => {
    cy.get(`.hidden > [href="/demo-store-core/${Cypress.env('country')}/search/${category}"]`).click()
    cy.location('pathname').should('be.equal', `/demo-store-core/${Cypress.env('country')}/search/${category}`)
})

Cypress.Commands.add('checkProducts', (numberOfProducts, productName) => {
    cy.get('.text-2xl').contains(`${numberOfProducts} results for "${productName}"`).should('be.visible')
})

Cypress.Commands.add('selectProduct', (productName, productUrl) => {
    cy.searchProduct(productName)

    cy.get('.grid').children().each(($child) => {
        cy.wrap($child).invoke('text').then((text) => {   
            if (text == productName) {
                cy.get($child).click()
            }
        }) 
    })

    cy.location('pathname').should('be.equal', `/demo-store-core/${Cypress.env('country')}/product/${productUrl}`)

    cy.get('.text-3xl')
    .should('be.visible')
    .and('contain.text', productName)
})

// Cypress.Commands.add('removeProductCart', (productName) => { 

// })

Cypress.Commands.add('removeAllProductsFromCart', () => {
    
    cy.get('items-start').then(($body) => {
        if ($body.find('[data-test*="button-remove-item"]')) {
            cy.get('[data-test*="button-remove-item"]').then(($buttons) => {
                if ($buttons.length > 0) {
                    $buttons.each((button) => {
                        cy.wrap(button).click()
            
                        cy.wait(500)
                    });
                }
            })
        }
    })
})

Cypress.Commands.add('addProductCart', (productName, productUrl) => {
    cy.searchProduct(productName)

    cy.get('.grid').children().each(($child) => {
        cy.wrap($child).invoke('text').then((text) => {   
            if (text == productName) {
                cy.get($child).click()
            }
        }) 
    })
    cy.location('pathname').should('be.equal', `/demo-store-core/${Cypress.env('country')}/product/${productUrl}`)

    cy.get('.text-3xl')
    .should('be.visible')
    .and('contain.text', productName)

    cy.get('.grow-0 > .block').should('be.visible').and('contain.text', 'Add to cart').click()

    cy.intercept('POST', '/api/line_items').as('req')
    cy.wait('@req').then((intercept) => {
        expect(intercept.response.statusCode).to.equal(201)
    })
})

Cypress.Commands.add('goToCart', () => {
    cy.get('.bottom-0 > .text-white')
    .should('be.visible')
    .click()
})

Cypress.Commands.add('checkCartValues', (checkoutStatus) => {
    cy.origin('https://demo-store.commercelayer.app', { args: { checkoutStatus } }, ( { checkoutStatus } ) => { 
        // product name
        cy.get('[data-test-id="coupon-input"]').should('be.visible')
    
        cy.get('[data-test-id="coupon-submit"]').should('be.visible')
    
        cy.get('[data-test-id="label-total"]')
        .should('exist')
        .and('contain.text', 'Total')
    
        cy.get('[data-test-id="total-amount"]').should('exist')
    
        cy.get('[data-test-id="label-subtotal"]')
        .should('exist')
        .and('contain.text', 'Subtotal')
    
        cy.get('[data-test-id="subtotal-amount"]').should('exist')
    
        cy.get('[data-test-id="return-url"]')
        .should('exist')
    
        cy.get('[data-test-id="button-checkout"]')
        .should('be.visible')
        .and(checkoutStatus)
    })
})

Cypress.Commands.add('checkCartWithProduct', ( product, amount ) => {
    cy.origin('https://demo-store.commercelayer.app', { args: { product, amount } }, ( { product, amount } ) => { 
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
        .and('have.value', amount)
    
        // current price
        cy.get('.text-lg')
        .should('exist')
        .and('contain.text', product.currentPrice)
    })
    cy.checkCartValues('not.be.disabled')
})

Cypress.Commands.add('checkCartWithoutProduct', ( ) => {
    cy.checkCartValues('be.disabled')

    cy.get('.w-full > .text-lg')
    .should('exist')
    .and('contain.text', 'Your cart is empty')
})

Cypress.Commands.add('checkoutProduct', (product, amount) => {
    cy.checkCartWithProduct( product, amount )
    cy.origin('https://demo-store.commercelayer.app', () => { 
        cy.get('[data-test-id="button-checkout"]').click()
    })
})


Cypress.Commands.add('checkCustomerForm', ( ) => {
    cy.origin('https://demo-store.commercelayer.app', () => {
        cy.get('.Card__Wrapper-sc-1ska9ea-0 > :nth-child(1)').should('exist')

        // Customer form (short version)
        cy.get('[data-testid="accordion_customer"]').should('exist').and('contain.text', 'Customer')

        cy.get('[data-testid="customer_email"]').should('exist').and('have.attr', 'type', 'email')

        cy.get('[data-testid="input_billing_address_first_name"]').should('exist').and('have.attr', 'type', 'text')
        cy.get('[data-testid="input_billing_address_last_name"]').should('exist').and('have.attr', 'type', 'text')

        cy.get('[data-testid="input_billing_address_line_1"]').should('exist').and('have.attr', 'type', 'text')
        cy.get('[data-testid="input_billing_address_line_2"]').should('exist').and('have.attr', 'type', 'text')

        cy.get('[data-testid="input_billing_address_city"]').should('exist').and('have.attr', 'type', 'text')
        cy.get('[data-testid="input_billing_address_country_code"]').should('exist').and('have.prop', 'tagName', 'SELECT')
        cy.get('[data-testid="input_billing_address_state_code"]').should('exist').and('have.attr', 'type', 'text')
        cy.get('[data-testid="input_billing_address_zip_code"]').should('exist').and('have.attr', 'type', 'text')

        cy.get('[data-testid="input_billing_address_phone"]').should('exist').and('have.attr', 'type', 'tel')

        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        //
    })
})

Cypress.Commands.add('fillRequiredCustomerInputs', ( customer ) => {
    cy.origin('https://demo-store.commercelayer.app', { args: { customer } }, ( { customer } ) => {

        cy.get('[data-testid="accordion_customer"]').should('exist').and('contain.text', 'Customer')

        cy.get('[data-testid="customer_email"]').type(customer.email)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_first_name"]').type(customer.firstName)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_last_name"]').type(customer.lastName)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_line_1"]').type(customer.address1)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_city"]').type(customer.city)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_country_code"]').select(customer.country)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_state_code"]').type(customer.state)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_zip_code"]').type(customer.zipcode)
        cy.get('[data-testid="save-customer-button"]').should('exist').and('be.disabled')

        cy.get('[data-testid="input_billing_address_phone"]').type(customer.phone)

        cy.get('[data-testid="save-customer-button"]').should('exist').and('not.be.disabled')
    })
})

Cypress.Commands.add('placeAnOrder', ( customer ) => {
    cy.fillRequiredCustomerInputs(customer)

    cy.origin('https://demo-store.commercelayer.app', () => {
    cy.get('[data-testid="save-customer-button"]').click()
    cy.get('[data-testid="accordion_customer"] > .Accordion__AccordionTitle-sc-zmjwyf-3 > .StepHeader__Wrapper-sc-7c66lm-0 > .StepHeader__Body-sc-7c66lm-1 > .StepHeader__Top-sc-7c66lm-2 > [data-testid="step-header-badge"] > .CheckmarkIcon__Svg-sc-14jghfi-0').should('exist')

    // cy.intercept('POST', '/api/address').as('req')
    // cy.wait('@req').then((intercept) => {
    //     expect(intercept.response.statusCode).to.equal(201)
    // })

    cy.get('[data-testid="accordion_shipping"] > .Accordion__AccordionTitle-sc-zmjwyf-3 > .StepHeader__Wrapper-sc-7c66lm-0 > .StepHeader__Body-sc-7c66lm-1 > .StepHeader__Top-sc-7c66lm-2 > [data-testid="step-header-badge"]', { timeout: 10000 }).should('exist')
    cy.get('[data-testid="payment-method-item"]', { timeout: 10000 }).should('exist').and('contain.text', 'Wire transfer')

    cy.get('[data-testid="save-payment-button"]').should('exist').and('contain.text', 'Place order').click()
    })
})

Cypress.Commands.add('checkOrderSuccess', () => {
    cy.origin('https://demo-store.commercelayer.app', () => { 
        cy.get('.cmvprn', { timeout: 10000 })
        .should('exist')
        .and('contain.text', 'Thank you for your order!')

        cy.get('[data-testid="complete-checkout-summary"]')
        .should('exist')
        .and('contain.text', 'Order confirmation number:')

        cy.get('[data-testid="complete-checkout-summary"] > .text-black')
        .should('exist')
        .and('contain.text', '#')
    })
})