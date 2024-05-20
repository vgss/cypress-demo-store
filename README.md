# Demo Store UI Tests (Cypress)

---

## Overview

This repository contains the UI test automation project for a open source demo store app: https://github.com/commercelayer/demo-store-core?tab=readme-ov-file.
The project focuses on three main functionalities: store, products, and order. It follows the recommended design patterns by Cypress for efficient testing.

## How to Run Locally

To run the project locally, follow these steps:

1. **Clone the Repository**: Clone this repository to your local machine using the following command:

```javascript
git clone https://github.com/your-username/project-name.git
```

2. **Install Cypress**: Navigate to the project directory and install Cypress using npm or yarn:

```javascript
cd project-name
npm install cypress --save-dev

or

cd project-name
yarn add cypress --dev
```

3. **Run Cypress Tests**: Once Cypress is installed, you can run the Cypress tests using the following command:

```javascript
npx cypress run
```

This command will execute all the Cypress tests in headless mode and display the results in the terminal.

## Main Functionalities

The project encompasses the following main functionalities:

1. **Store**: [Features: Choose Region to access, Main menu and search for a product from menu bar]
2. **Products**: [Features: Check all the informations from a product]
3. **Order**: [Features: Cart and Checkout products]

## Design Patterns

The project follows the recommended design patterns by Cypress to ensure efficient and maintainable testing practices. Cypress provides a robust framework for writing tests that are easy to read, write, and maintain.

For more information on Cypress and its design patterns, please refer to the official Cypress documentation: [Cypress Documentation](https://docs.cypress.io/)

## Information

This is just a simple collection of a few UI tests using Cypress to check the main features. (Does not cover check all elements, negative scenarios, edge cases, API testing, etc)

## Autor

Victor Santos


