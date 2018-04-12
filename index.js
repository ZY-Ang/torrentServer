/**
 * Main backend API and entry point for express.
 */
const express = require('express');
const {auth, dbase} = require('./config');

/**
 * 1. Construct an express application.
 */
const app = express();

/**
 * 2. Use the static folder to serve files
 */
app.use('/', express.static('public'));

const port = process.env.PORT || 80;

/**
 * 3. Let the server begin listening to requests
 *      on the configured port.
 */
app.listen(port, error => {
    if (error) {
        throw error;
    }
    console.log('Server running on port: ', port.toString());
});

const signInLogic = () => {
    auth.signInWithEmailAndPassword(process.env.USER_EMAIL || 'error@error.com', process.env.USER_PASSWORD || 'errorPassword')
        .then(() => {
            const WebTorrent = require('webtorrent');
            const client = new WebTorrent();
            let activeTorrents = {};
            dbase.ref('torrents').on('value', snapshot => {
                const requestedTorrents = snapshot.val();
                for (let key in requestedTorrents) {
                    if (requestedTorrents.hasOwnProperty(key)) {
                        const value = requestedTorrents[key];
                        if (!activeTorrents[key] && value.status.trim() === 'start') {
                            activeTorrents[key] = true;
                            let tr = client.add(value.url, {path: './public'}, () => {
                                console.log(`Torrent ${key} starting...`);
                            });
                            tr.on('ready', () => {
                                tr.on('download', () => {
                                    dbase.ref(`torrents/${key}`).update({status:`${(tr.progress * 100).toFixed(2)}%, ${(tr.downloadSpeed / 1000).toFixed(1)}kbps, ${(tr.downloaded / 1000000).toFixed(2)}Mb`});
                                });
                                tr.on('done', () => {
                                    setTimeout(() => {
                                        dbase.ref(`torrents/${key}`).update({status:'finished'});
                                        tr.destroy(() => {
                                            console.log("Destroyed: ", key);
                                        });
                                        console.info('Completed: ', key);
                                    }, 3000);
                                });
                            });
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.error('Unable to initialize firebase, retrying again in 30s. ', err);
            setTimeout(signInLogic, 30000);
        });
};

/**
 * 4. Recursively sign in with firebase and begin listening on database values
 */
signInLogic();
