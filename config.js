/**
 * Configuration for firebase and firebase instantiation.
 */

const firebase = require('firebase');

/**
 * TODO: Change to your own params. These are revoked.
 */
const config = {
    apiKey: "AIzaSyDfAr3Che_q_AAe3mLey2uGt7FaBClqqJ4",
    authDomain: "pitorrenti.firebaseapp.com",
    databaseURL: "https://pitorrenti.firebaseio.com",
    projectId: "pitorrenti"
};

/** 2. Initialize application using the provided {@see config} */
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

/** 3. Retrieve and make available
 * {@code firebase.auth()} module,
 * {@code firebase.database()} module,
 * {@code firebase.database} namespace,
 *  to other modules in application */
const auth = firebase.auth();
const dbase = firebase.database();
const authServices = firebase.auth;
const databaseServices = firebase.database;

module.exports = {
    auth,
    dbase,
    authServices,
    databaseServices
};
