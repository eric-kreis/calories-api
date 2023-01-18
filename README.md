# Calories API

Welcome to CaloriesAPI! Here you will find an Application Programming Interface (API) focused on helping people to manage their meals and control the number of calories consumed per day based on [NutritionixAPI](https://www.nutritionix.com/business/api) data that is listed on [Public APIs repository](https://github.com/public-apis/public-apis).

## Description and Technologies

The CaloriesAPI is a TypeScript RESTful API and the main techologies used for its development were:
- [NestJS](https://www.mongodb.com/home) - Framework;
- [ExpressJS](https://www.mongodb.com/home) - Framework;
- [MongoDB](https://www.mongodb.com/home) - Database;
- [Prisma](https://www.prisma.io/) - ORM;
- [Jest](https://jestjs.io/) - Testing Framework;

## Running the app

### Requirements

How doees this project uses [NutritionixAPI](https://www.nutritionix.com/business/api) and a MongoDB ReplicaSet cluster. Thus, you must follow these steps:

1. Setting up NutritionixAPI's credentials in a `.env` file
    1. Create a free tier developer account in [NutritionixAPI](https://www.nutritionix.com/business/api) and get your personal credentials
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

**NOTE:** If you haven't done before, run `yarn` to install the dependencies before testing.

## Using the app

### Seeding

To improve your experience, some simple database seeds of users were created. Run the following command on your CLI:

```bash
$ npx prisma db seed
```

### Postman Collection

Thinking on practice, use the url: [https://www.getpostman.com/collections/91c478d0c1a7b9fd5d9c](https://www.getpostman.com/collections/91c478d0c1a7b9fd5d9c) to import a collection inside your Postman:

![image](https://user-images.githubusercontent.com/51938137/205108396-fb8f40e0-6d99-4668-a7fc-f6b223262ea9.png)
![image](https://user-images.githubusercontent.com/51938137/205108509-a3c51055-4b09-4009-a0df-cc6d0dbb45f2.png)

Afther that, you need to set the following globals variables on your workspace environment:

- `main_url` - http://localhost:3000;
- `access_token`;

![image](https://user-images.githubusercontent.com/51938137/205109243-8eed0f0a-6241-4817-8525-329539f60b21.png)

**Done!** Now you are ready to use the API locally. Make requests and change the parameters as you go.

![image](https://user-images.githubusercontent.com/51938137/205110693-8c682938-a862-4b3f-9686-73b8320f0191.png)
![image](https://user-images.githubusercontent.com/51938137/205110755-3d01a5cf-75ca-4c88-9874-684cc2affec7.png)

## Next steps

- Save public data from NutritionixAPI when getting a response from an user's input;
- Implement an own Natural Language Processing (NLP) to avoid calls to NutritionixAPI;
