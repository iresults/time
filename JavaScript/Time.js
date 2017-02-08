/*
 *  Copyright notice
 *
 *  (c) 2015 Andreas Thurnheer-Meier <tma@iresults.li>, iresults
 *  Daniel Corn <cod@iresults.li>, iresults
 *
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
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

/**
 * @author COD
 * Created 10.09.15 14:38
 */

/**
 * Representation of a time of day
 */
module.exports = class Time {
    /**
     * Time constructor
     *
     * @param {int} $hour
     * @param {int       } $minute
     * @param {int       } $second
     */
    constructor($hour, $minute = 0, $second = 0) {
        if ($hour >= 24) {
            if ($hour === 24 && ($minute > 0 || $second > 0)) {
                throw new RangeError('If hour is 24 minute and second must be 0', 1441889380);
            } else if ($hour > 24) {
                throw new RangeError(`Argument hour "${$hour}" is higher than 24`, 1441889380);
            }
        }
        if ($minute > 59) {
            throw new RangeError(`Argument minute "${$minute}" is higher than 59`, 1441889381);
        }
        if ($second > 59) {
            throw new RangeError(`Argument second "${$second}" is higher than 59`, 1441889382);
        }

        if ($hour < 0) {
            throw new RangeError(`Argument hour "${$hour}" is lower than 0`, 1441889390);
        }
        if ($minute < 0) {
            throw new RangeError(`Argument minute "${$minute}" is lower than 0`, 1441889391);
        }
        if ($second < 0) {
            throw new RangeError(`Argument second "${$second}" is lower than 0`, 1441889392);
        }

        this._hour = $hour;
        this._minute = $minute;
        this._second = $second;
    }

    /**
     * @returns {int}
     */
    get hour() {
        return this._hour;
    }

    /**
     * @returns {int}
     */
    get minute() {
        return this._minute;
    }

    /**
     * @returns {int}
     */
    get second() {
        return this._second;
    }

    /**
     * Returns the number of seconds since midnight
     *
     * @returns {int}
     */
    get secondsSinceMidnight() {
        return this.hour * 60 * 60
            + this.minute * 60
            + this.second;
    }

    /**
     * Returns the difference between two Time objects
     *
     * @link http://www.php.net/manual/en/datetime.diff.php
     * @param {Time} datetime2 The time to compare to.
     * @param {boolean} absolute  Should the interval be forced to be positive?
     * @return {number} Returns the difference in seconds
     */
    diff(datetime2, absolute = false) {
        const diff = datetime2.secondsSinceMidnight - this.secondsSinceMidnight;

        return (absolute) ? Math.abs(diff) : diff;
    }

    // /**
    //  * Returns date formatted according to given format
    //  *
    //  * @link http://www.php.net/manual/en/datetime.format.php
    //  * @param {string} $format Format accepted by  {@link http://www.php.net/manual/en/function.date.php date()}.
    //  * @returns {string }Returns the formatted date string on success or <b>FALSE</b> on failure.
    //  */
    // format($format) {
    //     return $format.split().map(
    //         (char) => {
    //             // 'H:i:s'
    //         }
    //     )
    //     return gmdate($format, this.getSecondsSinceMidnight());
    // }

    /**
     * Returns the string representation of the Time
     *
     * @returns {string}
     */
    toString() {
        const prependZeroIfLowerThan10 = (number) => {
            return number < 10 ? '0' + number : number;
        };
        // return this.format('H:i:s');
        return prependZeroIfLowerThan10(this.hour)
            + ':' + prependZeroIfLowerThan10(this.minute)
            + ':' + prependZeroIfLowerThan10(this.second);
    }

    /**
     * Creates a new time object from the given formatted string
     *
     * @param {string} formattedTime
     * @returns {Time}
     */
    static timeFromString(formattedTime) {
        const $trimmedString = formattedTime.trim();


        let $properties = formattedTime.trim().split(':').map((value) => {
            return parseInt(value, 10)
        });
        if ($trimmedString.substr(-2).toLowerCase() === 'pm') {
            $properties[0] += 12;
        }

        return new Time(...$properties);
    }

    /**
     * Creates a new time object from the given UNIX timestamp
     *
     * @param {int} unixTimestamp
     * @returns {Time}
     */
    static timeFromTimestamp(unixTimestamp) {
        const dateTime = new Date(unixTimestamp * 1000);

        return new Time(
            dateTime.getUTCHours(),
            dateTime.getUTCMinutes(),
            dateTime.getUTCSeconds()
        );
    }

    /**
     * Creates a new time object with the seconds since midnight
     *
     * @param {int} $secondsSinceMidnight
     * @returns {Time}
     */
    static timeFromSecondsSinceMidnight($secondsSinceMidnight) {
        if ($secondsSinceMidnight > 24 * 60 * 60) {
            throw new RangeError(
                `Argument secondsSinceMidnight "${$secondsSinceMidnight}" is to high'`,
                1441889370
            );
        } else if ($secondsSinceMidnight < 0) {
            throw new RangeError(
                `Argument secondsSinceMidnight "${$secondsSinceMidnight}" is to low'`,
                1441889371
            );
        }

        let $properties = Time.splitSeconds($secondsSinceMidnight);
        return new Time(...$properties);
    }

    /**
     * Creates a new time object with the time from the given DateTime instance
     *
     * @param {Date} dateTime
     * @returns {Time}
     */
    static timeFromDateTime(dateTime) {
        return new Time(
            dateTime.getHours(),
            dateTime.getMinutes(),
            dateTime.getSeconds()
        );
    }

    /**
     * Split the seconds into hours, minutes and seconds
     *
     * @param {int} secondsSinceMidnight
     * @returns {int[]}
     */
    static splitSeconds(secondsSinceMidnight) {
        const $hour = Math.floor(secondsSinceMidnight / 60 / 60);
        const $minute = Math.floor((secondsSinceMidnight - $hour * 60 * 60) / 60);
        const $second = Math.floor((secondsSinceMidnight - $hour * 60 * 60 - $minute * 60));

        return [$hour, $minute, $second];
    }
};
