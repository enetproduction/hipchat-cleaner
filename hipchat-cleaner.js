const hipchat = require('node-hipchat');
const inquirer = require('inquirer');
const colors = require('colors');
const moment = require('moment');
const cli = require('cli');

const functions = require('./src/functions.js');
const apiMethods = require('./src/apiMethods.js');

const options = cli.parse({
    interactive: ['i', 'Interactive mode (recommended)', 'bool', false],
    apiKey: [ 'a', 'HipChat API Key', 'string', false],
    duration: ['d', 'Duration from last active date to remove after, use ISO 8601 duration format (P1M, P1Y)', 'string', 'P6M'],
});

cli.setApp('HipChat Cleaner', '1.0.0');

/**
 * Fired when no rooms were found
 *
 * @param  {String} duration duration in ISO 8601 format
 */
function noRoomsFound(duration) {
    cli.info(`No unactive rooms for this criteria [${moment().from(functions.getTimeBeforeDuration(duration))}]`);
    process.exit(1);
}

/**
 * Fired when API does not return results
 */
function apiException() {
    cli.fatal(`Error resolving API request. Are you sure API key is correct?`);
    return;
}

/**
 * Fired when exception is rised while removing a room
 *
 * @param  {Number} roomId  Id of the room
 */
function removeExeption(room) {
    const crossRed = '✗'.red;
    cli.error(`${crossRed} Cannot remove room "${room.name}" (${room.room_id})`);
}

/**
 * Fired when a room is succesfully removed
 *
 * @param  {Object} room Room object from HipChat Api
 */
function removeSuccess(room) {
    const checkGreen = '✓'.green;

    cli.ok(`${checkGreen} ${room.name} has been removed`.bold.green);
}

/**
 * Filters out only inactive rooms and checks if list is not empty
 *
 * @param  {Array}  rooms     HipChat rooms array
 * @param  {String} duration  Duration in ISO 8601 format
 * @return {Array}            List of only inactive rooms
 */
function getRoomsAndCheck(rooms, duration) {
    const inactiveRooms = functions.getRoomsToRemove(rooms, duration);

    if (inactiveRooms.length === 0) {
        noRoomsFound(duration);
    }

    return inactiveRooms;
}


/**
 * Fire CLI in normal mode
 */
function exec () {
    if (!options.apiKey) {
        cli.error(`API Key is required to run the script. See help below\n\n`.bold.red);
        return cli.getUsage();
    }

    // Set API key as we already have it
    apiMethods.setApiKey(options.apiKey);

    apiMethods.getRooms()
    .then((rooms) => {

        getRoomsAndCheck(rooms, options.duration).forEach((room) => {
            apiMethods.removeRoom(room.room_id)
            .then(removeSuccess.bind(null, room))
            .catch(removeExeption.bind(null, room))
        });

    })
    .catch(apiException);
}


/**
 * Fire cli in interactive mode
 */
function interactive () {

    const keyAndDurationPrompt = [
        {
            type: 'input',
            message: 'Please provide your HipChat API key: ',
            name: 'apiKey',
        },
        {
            type: 'list',
            message: 'Please select time before which unactive rooms will be removed',
            name: 'duration',
            choices: [
                { name: 'One month', value: 'P1M' },
                { name: 'Two months', value: 'P2M' },
                { name: 'Half year', value: 'P6M' },
                { name: 'One year', value: 'P1Y' },
                { name: 'Two years', value: 'P2Y' },
            ]
        }
    ];

    inquirer
    .prompt(keyAndDurationPrompt).then((answers) => {

        // Set API key as user already provided it
        apiMethods.setApiKey(answers.apiKey);

        apiMethods.getRooms()
        .then((rooms) => {
            const inactiveRooms = getRoomsAndCheck(rooms, answers.duration);

            const roomsPrompt = [
                {
                    type: 'checkbox',
                    message: `I\'ve found those rooms were not active in ${moment().from(functions.getTimeBeforeDuration(answers.duration))}`,
                    name: 'selectedRooms',
                    choices: inactiveRooms.map((room) => {
                        return {
                            name: room.name,
                            value: room.room_id,
                        }
                    })
                }
            ];

            inquirer
            .prompt(roomsPrompt)
            .then((answers) => {

                inactiveRooms
                .filter((room) => {
                    return answers.selectedRooms.indexOf(room.room_id) !== -1;
                })
                .forEach((room) => {
                    apiMethods.removeRoom(room.room_id)
                    .then(removeSuccess.bind(null, room))
                    .catch(removeExeption.bind(null, room))
                });

            });

        })
        .catch(apiException);
    });
}

options.interactive ? interactive() : exec();
