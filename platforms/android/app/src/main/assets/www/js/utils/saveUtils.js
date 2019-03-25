"use strict";


var SaveUtils = function () {
    var self = this;

    self.dataStore = null;

    var DB_NAME = "MarbbleDB";
    var DB_VERSION = 1;
    var STORE_NAME = 'profile';


    self.init = function() {

        self.initDB();
    };

    /**
	 * Initialize the database
	 */
	self.initDB = function() {
        var indexedDB = self.getIndexedDB();

        if(indexedDB) {
            var database = null;

            var request = indexedDB.open(DB_NAME, DB_VERSION);

            // Create the schema
            request.onupgradeneeded = function() {

                database = request.result;

                var profileStore = database.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: 'true'
                });

                profileStore.createIndex('id', 'id');
                profileStore.createIndex('userId', 'userId');
                profileStore.createIndex('email', 'email');

                console.log('The database has been created/updated.');
            };

            request.onerror = function(event) {
                console.log('db error');
            };

            request.onsuccess = function(event) {

                self.dataStore = event.target.result;                

            };
        }

	};

    self.getIndexedDB = function() {

        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        if (!indexedDB) {
            console.error("IndexedDB unsupported...");
        }
        return indexedDB;
    };

    self.getPlayerProfileByUserId = function(userId, callback) {
        console.log("Getting player profile " + userId);

        var database = self.dataStore;
        var transaction = database.transaction(STORE_NAME, 'readonly');
        var profileStore = transaction.objectStore(STORE_NAME);
        var userIdIndex = profileStore.index('userId');

        var request = userIdIndex.get(userId);

        var result = null;

        request.onsuccess = function() {
            result = request.result;
            if(result) {
                console.log(" === user found === ");
            }
            else {
                console.log(" === user not found === ");
            }

        };

        request.onerror = function(event) {
            console.error(event);
        };

        transaction.oncomplete = function(e) {
          // Execute the callback function.
          callback(result);
        };


    };


    self.saveProfileData = function(data) {

        var database = self.dataStore;
        var transaction = database.transaction(STORE_NAME, 'readwrite');
        var profileStore = transaction.objectStore(STORE_NAME);
        var userIdIndex = profileStore.index('userId');

        var requestIndex = userIdIndex.get(data.userId);

        requestIndex.onsuccess = function(event) {

            var result = requestIndex.result;

            if(result) {
                console.log("profile exists, update...");
                data.id = result.id;
            }
            else {
                console.log("creating new account...");
            }

            var request = profileStore.put(data);

            request.onsuccess = function(event) {
                console.log("profile saved successfully...");
            };

        };

        requestIndex.onerror = function(event) {
            console.error('db error');
        };

    };

    self.updateProfileData = function(data) {

        if(data) {

            var database = self.dataStore;
            var transaction = database.transaction(STORE_NAME, 'readwrite');
            var profileStore = transaction.objectStore(STORE_NAME);
            var userIdIndex = profileStore.index('userId');

            console.log("updating userid: " + data.userId);

            var request = userIdIndex.get(data.userId);


            request.onsuccess = function(event) {
                console.log(" UPDATE === user found === ");
                var result = request.result;
                data.id = result.id;

                var requestUpdate = profileStore.put(data);

                requestUpdate.onerror = function(event) {
                    console.error(event);
                };

                requestUpdate.onsuccess = function(event) {
                    // Success - the data is updated!
                    console.log("PROFILE Successfully updated...");
               };

            }

            request.onerror = function(event) {
                console.error('db error');
            };

            request.onerror = function(event) {
                console.error('db error');
            };


        }

    };



    self.init();


    return self;
};
