const functions = require('./functions.js');
const hipchat = require('node-hipchat');

let HC = null;

module.exports = {

    setApiKey: function setApiKey(apiKey) {
        if (!HC){
            HC = new hipchat(apiKey);
        }

        return HC;
    },

    getRooms: function getRooms() {
        return new Promise(function (resolve, reject) {
            HC.listRooms((data) => {
                if (data && data.rooms.length > 0) {
                    resolve(data.rooms);
                } else {
                    reject();
                }

            });
        });
    },

    removeRoom: function removeRoom (roomId) {
        return new Promise(function (resolve, reject) {
            HC.deleteRoom(roomId, (result) => {
                result.deleted ? resolve() : reject();
            });
        });
    }
};
