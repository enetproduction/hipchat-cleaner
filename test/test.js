var assert = require('assert');
var moment = require('moment');

var functions = require('../src/functions.js');

function isArray(variable) {
    return Object.prototype.toString.call( variable ) === '[object Array]';
}

describe('duration is counted properly using ISO 8601', () => {
    it('should return correct time subtract from duration of one month', () => {
        const nowMinusMonthDuration = functions.getTimeBeforeDuration('P1M');
        const nowMinusMonth = moment().subtract(1, 'month');

        // reset miliseconds as they may differ even in runtime
        nowMinusMonthDuration.millisecond(0);
        nowMinusMonth.millisecond(0);

        assert.equal(nowMinusMonthDuration.isSame(nowMinusMonth), true);
    });

    it('should return correct time subtract from duration of one year', () => {
        const nowMinusYearDuration = functions.getTimeBeforeDuration('P1Y');
        const nowMinusYear = moment().subtract(1, 'year');

        // reset miliseconds as they may differ even in runtime
        nowMinusYearDuration.millisecond(0);
        nowMinusYear.millisecond(0);

        assert.equal(nowMinusYearDuration.isSame(nowMinusYear), true);
    });

    it('should return correct time subtract from duration of one year', () => {
        const nowMinusYearAndHalfDuration = functions.getTimeBeforeDuration('P1.5Y');
        const nowMinusYearAndHalf = moment().subtract(1.5, 'year');

        // reset miliseconds as they may differ even in runtime
        nowMinusYearAndHalfDuration.millisecond(0);
        nowMinusYearAndHalf.millisecond(0);

        assert.equal(nowMinusYearAndHalfDuration.isSame(nowMinusYearAndHalf), true);
    });
});

describe('time between two moment objects should be diffed correctly', () => {
    it('should return 0 for same times', () => {

        assert.equal(functions.timeBetween(moment(), moment()), 0);
    });

    it('should return 60000ms if one hour difference', () => {

        assert.equal(functions.timeBetween(moment(), moment().subtract(1, 'm')), 60000);
    });

    it('should return -60000ms if one hour difference inverted', () => {

        assert.equal(functions.timeBetween(moment().subtract(1, 'm'), moment()), -60000);
    });

});

describe('rooms are filtered correctly', () => {
    const rooms = [
        { room_id: 3815709,
            name: 'SampleRoomActive',
            topic: 'SampleRoom1',
            created: 1493754031,
            owner_user_id: 0,
            is_archived: false,
            guest_access_url: null,
            xmpp_jid: '704997_test2@conf.hipchat.com',
            is_private: false,
            last_active: (+new Date())
        },
        {
            room_id: 3815711,
            name: 'SampleRoomUnactive11Months',
            topic: 'SampleRoom2',
            created: 1493754049,
            owner_user_id: 0,
            is_archived: false,
            guest_access_url: null,
            xmpp_jid: '704997_test4@conf.hipchat.com',
            is_private: false,
            last_active: moment().subtract(11, 'month').format('X')
        },

        {
            room_id: 3815711,
            name: 'SampleRoomUnactive6Months',
            topic: 'SampleRoom2',
            created: 1493754049,
            owner_user_id: 0,
            is_archived: false,
            guest_access_url: null,
            xmpp_jid: '704997_test4@conf.hipchat.com',
            is_private: false,
            last_active: moment().subtract(6, 'month').format('X')
        }
    ];

    it('should return empty array if all rooms are active', () => {

        const output = functions.getRoomsToRemove(rooms, 'P1Y');

        assert.equal(isArray(output), true);
        assert.equal(output.length, 0);

    });

    it('should return one rooms not active for at least 10 months', () => {

        const output = functions.getRoomsToRemove(rooms, 'P11M');

        assert.equal(isArray(output), true);
        assert.equal(output.length, 1);
        assert.equal(output[0].name, 'SampleRoomUnactive11Months');
    });


    it('should return two rooms not active for at least 5 months', () => {

        const output = functions.getRoomsToRemove(rooms, 'P5M');

        assert.equal(isArray(output), true);
        assert.equal(output.length, 2);
        assert.equal(output[0].name, 'SampleRoomUnactive11Months');
        assert.equal(output[1].name, 'SampleRoomUnactive6Months');
    });
});
