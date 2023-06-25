# Gettin started

First clone this repository:

~~~sh
git clone git@github.com:iktefish/ss-backend-task-ivan.git
~~~

Then `cd` into the project directory and install the necessary
modules and dependencies:

~~~sh
npm i
~~~

To run the server execute:

~~~sh
npm run dev
~~~

This will run the server loop at `localhost:8080`.

-   All HTTP handlers and controllers are implemented in `controllers/controllers.ts`
-   Database schema is implemented in `schema/media.ts` and `schema/user.ts`
-   Authentication middleware is implemented in `middleware/auth.ts`
-   Every piece of JSON data used and generated are provided below this document

# Dependencies

We will be using the following development dependencies:

-   Nodemon
-   TypeScript
-   TypeScript Language Server
-   TS Node Interpretor

~~~sh
npm i -D                        \
    nodemon                     \
    typescript                  \
    typescript-language-server  \
    ts-node                     \
    @types/node@"*"             \
    @types/express              \
    @types/bcrypt               \
    @types/jsonwebtoken         \
    @types/cookie-parser
~~~

We will need the following runtime dependencies:

-   Express
-   Mongoose
-   Dotenv
-   JSON Web Token
-   Bcrypt
-   Cookie Parser

~~~sh
npm i express mongoose dotenv jsonwebtoken bcrypt cookie-parser
~~~

# Queries for development and testing

-   Sign up using mock admin account:

~~~sh
curl -X POST 'localhost:8080/sign-up/' \
    -H 'Content-Type: application/json' \
    -d @dummy-json/sign-up-admin.json \
    -v | jq --tab
~~~

-   Sign in using mock admin account:

~~~sh
curl -X POST 'localhost:8080/sign-in/' \
    -H 'Content-Type: application/json' \
    -d @dummy-json/sign-in-admin.json \
    -c dummy-json/cookies-sign-in-admin \
    -v | jq --tab
~~~

-   Sign up using mock guest account:

~~~sh
curl -X POST 'localhost:8080/sign-up/' \
    -H 'Content-Type: application/json' \
    -d @dummy-json/sign-up-guest.json \
    -v | jq --tab
~~~

-   Sign in using mock guest account:

~~~sh
curl -X POST 'localhost:8080/sign-in/' \
    -H 'Content-Type: application/json' \
    -d @dummy-json/sign-in-guest.json \
    -c dummy-json/cookies-sign-in-guest \
    -v | jq --tab
~~~

-   Create entry using mock admin account:

~~~sh
curl -X POST 'localhost:8080/create-entry/' \
    -H 'Content-Type: application/json' \
    -d @dummy-json/create-entry-admin.json \
    -b dummy-json/cookies-sign-in-admin \
    -v | jq --tab
~~~

-   Create entry using mock guest account:

~~~sh
curl -X POST 'localhost:8080/create-entry/' \
    -H 'Content-Type: application/json' \
    -d @dummy-json/create-entry-guest.json \
    -b dummy-json/cookies-sign-in-guest \
    -v | jq --tab
~~~

-   List all media entries:

~~~sh
curl -X GET 'localhost:8080/list-entries/' \
    -b dummy-json/cookies-sign-in-guest \
    -v | jq --tab
~~~

-   List details of individual entry:

~~~sh
curl -X GET 'localhost:8080/get-details/' \
    -H 'Content-Type: application/json' \
    -d @dummy-json/get-details.json \
    -b dummy-json/cookies-sign-in-guest \
    -v | jq --tab
~~~
