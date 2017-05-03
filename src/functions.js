const moment = require('moment');

/**
 * Gets Moment.js time subtracked by given duration
 * to show a date back in time
 *
 * @param  {String} duration  Duration in ISO format (P1D, PT10H)
 * @return {Moment}             Reduced time as moment.js object
 */
function getTimeBeforeDuration (duration) {
    return moment().subtract(moment.duration(duration));
};

/**
 * Gets time between two given moment.js objects
 *
 * @param  {Moment} firstTime  First time object
 * @param  {Moment} secondTime Second time object
 * @return {Number}            Difference between times as number
 */
function timeBetween (firstTime, secondTime) {
    return firstTime.diff(secondTime);
};

/**
 * Filters out unactive rooms
 *
 * @param  {Array} rooms     HipChat rooms array
 * @param  {String} duration Duration in ISO format (P1D, PT10H)
 * @return {Array}           Filtered items
 */
function getRoomsToRemove (rooms, duration) {
    return rooms.filter((room) => {
        return timeBetween(moment.unix(room.last_active), getTimeBeforeDuration(duration)) < 0;
    });
};

module.exports = {
    getTimeBeforeDuration,
    timeBetween,
    getRoomsToRemove,
};
