# Calories API

## Running the app

### Requirements

This project uses [NutrionixAPI](https://www.nutritionix.com/business/api) and a MongoDB ReplicaSet cluster. Thus, you must follow these steps:

1. Setting up NutrionixAPI's credentials in a `.env` file
    1. Create a free tier developer account in [NutrionixAPI](https://www.nutritionix.com/business/api) and get your personal credentials
    2. In the project root, copy the content of `.env.example`, create a file called `.env` and pass it to your `.env` file.

    ![image](https://user-images.githubusercontent.com/51938137/205082180-eaad473c-fc89-4c62-b353-4a181bd71519.png)

2. Setting up MongoDB
You can choose two ways to setup the application's database:
    1. With Docker using docker compose (your don't need to change the copied `DATABASE_URL` in `.env`):
    ```bash
    # starts your mongodb replicaset locally
    $ docker compose up mongo -d

    # setup the collections and indexes
    $ npx prisma db push
    ```
    2. With MongoDB Atlas (free tier):
    The easiest way to setup a replica set cluster is using MongoDB Atlas. First, create a MongoDB Atlas instance, update the environment variable `DATABASE_URL` with your instance url adding the paramater `authSource=admin` (as it is in the `.env.example` file). To create your instance using atlas see: [Get Started with Atlas](https://www.mongodb.com/docs/atlas/getting-started/)

### All setted up? Let's execute!

1. With Docker:

```bash
# watch mode
$ docker compose up api-dev

# production mode
$ docker compose up api-prod
```

2. With Package manager:

**NOTE:** This project was created using the Node package manager [Yarn](https://yarnpkg.com/) (recommended), but feel free to use [NPM](https://www.npmjs.com/) or other ones.

```bash
# watch mode
$ yarn
$ yarn start:dev

# production mode
$ yarn
$ yarn build
$ yarn start
```

## Test

This project has 100% unit test coverage (ignoring files that cannot be unit tested). To run the tests execute in your command line (CLI):

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

**NOTE:** If you haven't done before, run `yarn` to install the dependencies before the tests commands. 
