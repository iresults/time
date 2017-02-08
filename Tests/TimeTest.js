/*
 *  Copyright notice
 *
 *  (c) 2015 Andreas Thurnheer-Meier <tma@iresults.li>, iresults
 *           Daniel Corn <cod@iresults.li>, iresults
 *
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 */

const TestCase = require('./TestCase');
const Time = require('../JavaScript/Time');

/**
 * Test case for class \Iresults\ResourceBooking\Domain\Model\Booking.
 *
 * @copyright Copyright belongs to the respective authors
 * @license   http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 or later
 *
 * @author    Andreas Thurnheer-Meier <tma@iresults.li>
 * @author    Daniel Corn <cod@iresults.li>
 */
class TimeTest extends TestCase {
    /**
     * @test
     */
    initializeWithIntTest() {
        let $time;
        $time = new Time(2, 12, 34);
        this.assertSame(2, $time.hour);
        this.assertSame(12, $time.minute);
        this.assertSame(34, $time.second);

        $time = new Time(2, 12);
        this.assertSame(2, $time.hour);
        this.assertSame(12, $time.minute);
        this.assertSame(0, $time.second);

        $time = new Time(2);
        this.assertSame(2, $time.hour);
        this.assertSame(0, $time.minute);
        this.assertSame(0, $time.second);
    }

    /**
     * @test
     * @dataProvider timeFromStringDataProvider
     * @param {string} $formattedString
     * @param {int} $hour
     * @param {int} $minute
     * @param {int} $second
     */
    timeFromString($formattedString, $hour, $minute, $second) {
        let $time = Time.timeFromString($formattedString);
        this.assertSame($hour, $time.hour);
        this.assertSame($minute, $time.minute);
        this.assertSame($second, $time.second);
    }

    timeFromStringDataProvider() {
        return [
            ['2:12:34', 2, 12, 34],
            ['2:12:34 ', 2, 12, 34],
            [' 2:12:34', 2, 12, 34],
            [' 2:12:34 ', 2, 12, 34],
            ['02:12:34', 2, 12, 34],
            ['02:12:34', 2, 12, 34],
            ['02 pm', 14, 0, 0],
            ['02:12 pm', 14, 12, 0],
            ['02:12:34 pm', 14, 12, 34],
            ['02:12:34 pm ', 14, 12, 34],
            ['02:12:34pm', 14, 12, 34],
            ['22:12:34', 22, 12, 34],
            ['13:7:4', 13, 7, 4],
            ['13:7:04', 13, 7, 4],
            ['13:07:4', 13, 7, 4],
            ['13:07:04', 13, 7, 4],
        ];
    }

    callTimeFromString() {
        this.timeFromStringDataProvider().forEach((testSet) => {
            this.timeFromString(...testSet);
        });
    }

    /**
     * @test
     */
    timeFromSecondsSinceMidnightTest() {
        let $time;
        $time = Time.timeFromSecondsSinceMidnight(13 * 60 * 60 + 7 * 60 + 4);
        this.assertSame(13, $time.hour);
        this.assertSame(7, $time.minute);
        this.assertSame(4, $time.second);

        $time = Time.timeFromSecondsSinceMidnight(2 * 60 * 60 + 12 * 60 + 34);
        this.assertSame(2, $time.hour);
        this.assertSame(12, $time.minute);
        this.assertSame(34, $time.second);
    }

    /**
     * @test
     * @dataProvider timeFromUnixTimestampDataProvider
     * @param {int} $timestamp
     * @param {int} $hour
     * @param {int} $minute
     * @param {int} $second
     */
    timeFromUnixTimestamp($timestamp, $hour, $minute, $second) {

        let $time = Time.timeFromTimestamp($timestamp);
        this.assertSame($hour, $time.hour);
        this.assertSame($minute, $time.minute);
        this.assertSame($second, $time.second);
    }

    timeFromUnixTimestampDataProvider() {
        const now = new Date();
        return [
            // [+now, now.getHours(), now.getMinutes(), now.getSeconds()],
            // [1484921125, 14, 5, 25],
            // [1484917525, 13, 5, 25],
            [0, 0, 0, 0],
            [-1, 23, 59, 59],
        ];
    }

    callTimeFromUnixTimestampTest() {
        this.timeFromUnixTimestampDataProvider().forEach((testSet) => {
            this.timeFromUnixTimestamp(...testSet);
        });
    }

    /**
     * @test
     */
    timeFromDateTimeTest() {
        let $time;
        $time = Time.timeFromDateTime(new Date('Fri 11.09.2015 17:07:32'));
        this.assertSame(17, $time.hour);
        this.assertSame(7, $time.minute);
        this.assertSame(32, $time.second);

        $time = Time.timeFromDateTime(new Date('Fri 11.09.2015 02:12:34'));
        this.assertSame(2, $time.hour);
        this.assertSame(12, $time.minute);
        this.assertSame(34, $time.second);
    }


    /**
     * @test
     */
    getSecondsSinceMidnightTest() {
        let $time;
        let $secondsSinceMidnight;

        $secondsSinceMidnight = 13 * 60 * 60 + 7 * 60 + 4;
        $time = Time.timeFromSecondsSinceMidnight($secondsSinceMidnight);
        this.assertSame($secondsSinceMidnight, $time.secondsSinceMidnight);

        $secondsSinceMidnight = 2 * 60 * 60 + 12 * 60 + 34;
        $time = Time.timeFromSecondsSinceMidnight($secondsSinceMidnight);
        this.assertSame($secondsSinceMidnight, $time.secondsSinceMidnight);

        $secondsSinceMidnight = 0;
        $time = Time.timeFromSecondsSinceMidnight($secondsSinceMidnight);
        this.assertSame($secondsSinceMidnight, $time.secondsSinceMidnight);

        $time = new Time(2, 12, 34);
        this.assertSame(7954, $time.secondsSinceMidnight);

        $time = new Time(13, 7, 4);
        this.assertSame(47224, $time.secondsSinceMidnight);

        $time = new Time(0, 0, 0);
        this.assertSame(0, $time.secondsSinceMidnight);

        $time = Time.timeFromString('2:12:34');
        this.assertSame(7954, $time.secondsSinceMidnight);

        $time = Time.timeFromString('13:7:4');
        this.assertSame(47224, $time.secondsSinceMidnight);

        $time = Time.timeFromString('0:0:0');
        this.assertSame(0, $time.secondsSinceMidnight);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToHighHourTestShouldFail() {
        new Time(25);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithMaxHourAndToHighMinuteTestShouldFail() {
        new Time(24, 1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithMaxHourAndToHighSecondTestShouldFail() {
        new Time(24, 0, 1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToHighMinuteTestShouldFail() {
        new Time(2, 60);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToHighSecondTestShouldFail() {
        new Time(0, 0, 60);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToHighHourInStringTestShouldFail() {
        Time.timeFromString('25:00:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithMixedAmPmTestShouldFail() {
        Time.timeFromString('22:00:00 pm');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToMaxHourAndHighMinuteInStringTestShouldFail() {
        Time.timeFromString('24:01:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToMaxHourAndHighSecondInStringTestShouldFail() {
        Time.timeFromString('24:00:01');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToHighMinuteInStringTestShouldFail() {
        Time.timeFromString('2:60:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToHighSecondInStringTestShouldFail() {
        Time.timeFromString('0:0:60');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToLowHourTestShouldFail() {
        new Time(-1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToLowMinuteTestShouldFail() {
        new Time(2, -1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToLowSecondTestShouldFail() {
        new Time(0, 0, -1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToLowHourInStringTestShouldFail() {
        Time.timeFromString('-1:00:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToLowMinuteInStringTestShouldFail() {
        Time.timeFromString('2:-1:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    initializeWithToLowSecondInStringTestShouldFail() {
        Time.timeFromString('0:0:-1');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     * @expectedExceptionCode 1441889370
     */
    timeFromSecondsSinceMidnightToHighTestShouldFail() {
        Time.timeFromSecondsSinceMidnight(24 * 60 * 60 + 12 * 60 + 34);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     * @expectedExceptionCode 1441889371
     */
    timeFromSecondsSinceMidnightToLowTestShouldFail() {
        Time.timeFromSecondsSinceMidnight(-1);
    }

    /**
     * @test
     */
    testStringTest() {
        let $time;
        $time = new Time(2);
        this.assertSame('02:00:00', '' + $time);

        $time = new Time(2, 12, 34);
        this.assertSame('02:12:34', '' + $time);

        $time = new Time(13, 2, 34);
        this.assertSame('13:02:34', '' + $time);

        $time = new Time(13, 2, 4);
        this.assertSame('13:02:04', '' + $time);
    }

    // /**
    //  * @test
    //  */
    // formatTest() {
    //     let $time;
    //     $time = new Time(2);
    //     this.assertSame('02:00:00', $time.format('H:i:s'));
    //
    //     $time = new Time(2, 12, 34);
    //     this.assertSame('02:12:34', $time.format('H:i:s'));
    //
    //     $time = new Time(13, 2, 34);
    //     this.assertSame('01 PM 02:34', $time.format('h A i:s'));
    //
    //     $time = new Time(13, 2, 34);
    //     this.assertSame('1 PM 02:34', $time.format('g A i:s'));
    // }

    /**
     * @test
     */
    diffTest() {
        const h = this.h;
        const m = this.m;
        const s = this.s;
        let $diff;
        $diff = (new Time(2)).diff(new Time(2));
        this.assertSame(0, $diff, '+0 hours 0 minutes 0 seconds');

        $diff = (new Time(2)).diff(new Time(2, 12));
        this.assertSame(h(0) + m(12) + s(0), $diff, '+0 hours 12 minutes 0 seconds');

        $diff = (new Time(2)).diff(new Time(23));
        this.assertSame(h(21) + m(0) + s(0), $diff, '+21 hours 0 minutes 0 seconds');

        $diff = (new Time(2, 10, 53)).diff(new Time(23));
        this.assertSame(h(20) + m(49) + s(7), $diff, '+20 hours 49 minutes 7 seconds');

        $diff = (new Time(2, 12)).diff(new Time(2));
        this.assertSame(-1 * (h(0) + m(12) + s(0)), $diff, '-0 hours 12 minutes 0 seconds');

        $diff = (new Time(23)).diff(new Time(2));
        this.assertSame(-1 * (h(21) + m(0) + s(0)), $diff, '-21 hours 0 minutes 0 seconds');

        $diff = (new Time(23)).diff(new Time(2, 10, 53));
        this.assertSame(-1 * (h(20) + m(49) + s(7)), $diff, '-20 hours 49 minutes 7 seconds');

        $diff = (new Time(2, 12)).diff(new Time(2), true);
        this.assertSame(h(0) + m(12) + s(0), $diff, '-0 hours 12 minutes 0 seconds');

        $diff = (new Time(23)).diff(new Time(2), true);
        this.assertSame(h(21) + m(0) + s(0), $diff, '-21 hours 0 minutes 0 seconds');

        $diff = (new Time(23)).diff(new Time(2, 10, 53), true);
        this.assertSame(h(20) + m(49) + s(7), $diff, '-20 hours 49 minutes 7 seconds');
    }

    h(hours) {
        return 60 * 60 * hours;
    }

    m(minutes) {
        return 60 * minutes;
    }

    s(seconds) {
        return seconds;
    }
}

(new TimeTest()).runTests();
