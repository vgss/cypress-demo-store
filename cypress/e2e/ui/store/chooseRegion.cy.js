describe('Available Country/Region', () => {
	beforeEach(() => {
		cy.visit('')
	})

	it('redirects to the main page when country is selected', () => {
		cy.ui_checkAvailableCountries()
		cy.selectRegion()
	})
})