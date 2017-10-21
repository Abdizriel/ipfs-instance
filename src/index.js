'use strict';
const IPFS = require('ipfs');
const debug = require('debug')('ipfs');

const ipfsNode = new IPFS();

const validateIPFSConnected = (ipfs) => {
    if (!ipfs) {
        throw new Error("IPFS is not connected yet. Call client.getInstance() first!");
    }
};

const DEFAULT_DAG_CONFIG = { format: 'dag-cbor', hashAlg: 'sha3-512' };

const ipfs = (() => {
    let ipfsInstance;

    const instance = {
        /**
         * @function start
         * @description Start IPFS Node.
         */
        start() {
            validateIPFSConnected(ipfsInstance);
            ipfsInstance.start();
        },

        /**
         * @function stop
         * @description Stop IPFS Node.
         */
        stop() {
            validateIPFSConnected(ipfsInstance);
            ipfsInstance.stop();
        },

        /**
         * @function isOnline
         * @description Check IPFS Node status.
         */
        isOnline() {
            validateIPFSConnected(ipfsInstance);
            return ipfsInstance.isOnline();
        },

        /**
         * @async
         * @function putObject
         * @description Add object to IPFS network.
         * @param {object} dagNode - a DAG node that follows one of the supported IPLD formats.
         * @param {object} [options={ format: 'dag-cbor', hashAlg: 'sha3-512' }] - The options object.
         * @returns {Promise<string>} The response from action.
         */
        async putObject(dagNode, options = DEFAULT_DAG_CONFIG) {
            validateIPFSConnected(ipfsInstance);
            return await ipfsInstance.dag.put(dagNode, options);
        },

        /**
         * @function putObjectSync
         * @description Add object to IPFS network.
         * @param {object} dagNode - a DAG node that follows one of the supported IPLD formats.
         * @param {object} [options={ format: 'dag-cbor', hashAlg: 'sha3-512' }] - The options object.
         * @param {Function} callback - The callback that handles the response.
         */
        putObjectSync() {
            let obj, config = DEFAULT_DAG_CONFIG, callback;
            if(!arguments.length) {
                throw new Error('You have to provide object');
            }
            if(arguments.length === 3) {
                obj = arguments[0];
                config = arguments[1];
                callback = arguments[2];
            }
            if(arguments.length === 2) {
                obj = arguments[0];
                callback = arguments[1];
            }
            validateIPFSConnected(ipfsInstance);
            ipfsInstance.dag.put(obj, config, (err, cid) => {
                callback(err, cid);
            });
        },

        /**
         * @function onError
         * @description IPFS Node error listener,
         * @param {Function} callback - The callback that handles the response.
         */
        onError(callback) {
            validateIPFSConnected(ipfsInstance);
            ipfsInstance.on('error', (err) => {
                debug('IPFS Node has hit some error while initing/starting', err);
                callback(err);
            })
        },

        /**
         * @function onInit
         * @description IPFS Node init listener,
         * @param {Function} callback - The callback that handles the response.
         */
        onInit(callback) {
            validateIPFSConnected(ipfsInstance);
            ipfsInstance.on('init', () => {
                debug('IPFS Node has successfully finished initing the repo');
                callback();
            })
        },

        /**
         * @function onStart
         * @description IPFS Node start listener,
         * @param {Function} callback - The callback that handles the response.
         */
        onStart(callback) {
            validateIPFSConnected(ipfsInstance);
            ipfsInstance.on('start', () => {
                debug('IPFS Node has started');
                callback();
            })
        },

        /**
         * @function onStop
         * @description IPFS Node dtop listener,
         * @param {Function} callback - The callback that handles the response.
         */
        onStop(callback) {
            validateIPFSConnected(ipfsInstance);
            ipfsInstance.on('stop', () => {
                debug('IPFS Node has stopped');
                callback();
            })
        },
    };

    return new Promise((resolve) => {
        ipfsNode.on('ready', () => {
            ipfsInstance = ipfsNode;
            resolve(instance);
        });
    });
})();

exports = module.exports = ipfs;