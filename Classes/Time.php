<?php
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


namespace Iresults\Time;

use DateInterval;
use DateTimeInterface;

/**
 * Representation of a time of day
 */
class Time
{
    /**
     * @var int
     */
    private $hour;

    /**
     * @var int
     */
    private $minute;

    /**
     * @var int
     */
    private $second;

    /**
     * Time constructor
     *
     * @param int|string $hour
     * @param int        $minute
     * @param int        $second
     */
    public function __construct(int $hour, int $minute = 0, int $second = 0)
    {
        if ($hour >= 24) {
            if ($hour === 24 && ($minute > 0 || $second > 0)) {
                throw new \OutOfBoundsException('If hour is 24 minute and second must be 0', 1441889380);
            } elseif ($hour > 24) {
                throw new \OutOfBoundsException(sprintf('Argument hour "%d" is higher than 24', $hour), 1441889380);
            }
        }
        if ($minute > 59) {
            throw new \OutOfBoundsException(sprintf('Argument minute "%d" is higher than 59', $minute), 1441889381);
        }
        if ($second > 59) {
            throw new \OutOfBoundsException(sprintf('Argument second "%d" is higher than 59', $second), 1441889382);
        }

        if ($hour < 0) {
            throw new \OutOfBoundsException(sprintf('Argument hour "%d" is lower than 0', $hour), 1441889390);
        }
        if ($minute < 0) {
            throw new \OutOfBoundsException(sprintf('Argument minute "%d" is lower than 0', $minute), 1441889391);
        }
        if ($second < 0) {
            throw new \OutOfBoundsException(sprintf('Argument second "%d" is lower than 0', $second), 1441889392);
        }

        $this->hour = $hour;
        $this->minute = $minute;
        $this->second = $second;
    }

    /**
     * @return int
     */
    public function getHour(): int
    {
        return $this->hour;
    }

    /**
     * @return int
     */
    public function getMinute(): int
    {
        return $this->minute;
    }

    /**
     * @return int
     */
    public function getSecond(): int
    {
        return $this->second;
    }

    /**
     * Returns the number of seconds since midnight
     *
     * @return int
     */
    public function getSecondsSinceMidnight(): int
    {
        return $this->getHour() * 60 * 60
            + $this->getMinute() * 60
            + $this->getSecond();
    }

    /**
     * Returns date formatted according to given format
     *
     * @link http://www.php.net/manual/en/datetime.format.php
     * @param string $format Format accepted by  {@link http://www.php.net/manual/en/function.date.php date()}.
     * @return string Returns the formatted date string on success or <b>FALSE</b> on failure.
     */
    public function format(string $format): string
    {
        return gmdate($format, $this->getSecondsSinceMidnight());
    }

    /**
     * Returns the difference between two DateTime objects
     *
     * @link http://www.php.net/manual/en/datetime.diff.php
     * @param Time $datetime2 The time to compare to.
     * @param bool $absolute  Should the interval be forced to be positive?
     * @return DateInterval The http://www.php.net/manual/en/class.dateinterval.php DateInterval} object representing the difference between the two dates or FALSE on failure.
     */
    public function diff(Time $datetime2, $absolute = false): DateInterval
    {
        $negative = false;
        $seconds1 = $this->getSecondsSinceMidnight();
        $seconds2 = $datetime2->getSecondsSinceMidnight();
        if ($seconds2 >= $seconds1) {
            $diff = $seconds2 - $seconds1;
        } else {
            $diff = $seconds1 - $seconds2;
            $negative = ($absolute !== true) ? true : false;
        }

        list($hours, $minutes, $seconds) = self::splitSeconds($diff);

        $interval = DateInterval::createFromDateString(
            sprintf(
                '%d hours %d minutes %d seconds',
                $hours,
                $minutes,
                $seconds
            )
        );

        if ($negative) {
            $interval->invert = 1;
        }

        return $interval;
    }


    /**
     * The __toString method allows a class to decide how it will react when it is converted to a string.
     *
     * @return string
     * @link http://php.net/manual/en/language.oop5.magic.php#language.oop5.magic.tostring
     */
    function __toString()
    {
        return $this->format('H:i:s');
    }

    /**
     * Creates a new time object from the given formatted string
     *
     * @param string $formattedTime
     * @return Time
     */
    public static function timeFromString(string $formattedTime): self
    {
        $trimmedString = trim($formattedTime);

        $properties = array_map('intval', sscanf($trimmedString, '%d:%d:%d'));
        if (substr(strtolower($trimmedString), -2) === 'pm') {
            $properties[0] += 12;
        }

        return new static(...$properties);
    }

    /**
     * Creates a new time object with the seconds since midnight
     *
     * @param int $secondsSinceMidnight
     * @return Time
     */
    public static function timeFromSecondsSinceMidnight(int $secondsSinceMidnight): self
    {
        if ($secondsSinceMidnight > 24 * 60 * 60) {
            throw new \OutOfBoundsException(
                sprintf('Argument secondsSinceMidnight "%d" is to high', $secondsSinceMidnight),
                1441889370
            );
        } elseif ($secondsSinceMidnight < 0) {
            throw new \OutOfBoundsException(
                sprintf('Argument secondsSinceMidnight "%d" is to low', $secondsSinceMidnight),
                1441889371
            );
        }

        $properties = array_map('intval', self::splitSeconds($secondsSinceMidnight));

        return new static(...$properties);
    }

    /**
     * Creates a new time object with the time from the given DateTime instance
     *
     * @param DateTimeInterface $dateTime
     * @return Time
     */
    public static function timeFromDateTime(DateTimeInterface $dateTime): self
    {
        return new static($dateTime->format('H'), $dateTime->format('i'), $dateTime->format('s'));
    }


    /**
     * Split the seconds into hours, minutes and seconds
     *
     * @param int $secondsSinceMidnight
     * @return int[]
     */
    private static function splitSeconds($secondsSinceMidnight)
    {
        $hour = floor($secondsSinceMidnight / 60 / 60);
        $minute = floor(($secondsSinceMidnight - $hour * 60 * 60) / 60);
        $second = floor(($secondsSinceMidnight - $hour * 60 * 60 - $minute * 60));

        return array($hour, $minute, $second);
    }

}
