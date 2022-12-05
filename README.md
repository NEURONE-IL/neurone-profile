# About

Neurone-Profile is a node project that is part of the NEURONE Framewok. It serves as part of the back-end that provides a REST API for that processes user data and saves it to a Mongo database. For more info check https://github.com/NEURONE-IL/neurone-core

# Running the back-end

* Install the dependencies with `npm install`
* Run in dev mode with `npm run dev:server`
* Build in production mode with `npm run build`
* Run in production mode with `npm run start`

# Env variables
```js
PORT: 3002 // port of the localhost
DB: "mongodb://127.0.0.1:27017/neurone", // url to the Mongo database, this example is the default local database
NEURONE_AUTH_PORT: 3005 // Neurone-Auth port, make sure it's in sync
DISABLEAUTH: true // disables auth check, for development purposes
```