[![Maintainability](https://api.codeclimate.com/v1/badges/9f48b8a2e10aae2a23aa/maintainability)](https://codeclimate.com/github/GammaGeeks/tura-backend/maintainability)

[![Coverage Status](https://coveralls.io/repos/github/GammaGeeks/tura-backend/badge.svg?branch=main)](https://coveralls.io/github/GammaGeeks/tura-backend?branch=main)

# Tura Backend

Tura is a real estate web application that facilitates users to rent and buy properties online. The backend is built using Node.js and Nest.js, with Prisma as the ORM for database interactions and PostgreSQL. The application allows users to share properties and earn commissions.

## Project Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Prisma setup:
   - Initialize Prisma:

        ```bash
        npx prisma init
        ```

   - Database migration:

        ```bash
        npx prisma migrate dev --name <migration_name>
        ```

   - Generate Prisma client:

        ```bash
        npx prisma generate
        ```

   - Seed database (optional):

        ```bash
        npx prisma db seed
        ```

3. Compile and run the project

## Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
