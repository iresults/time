<?php

namespace Iresults\Time\Test;

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

use Iresults\Time\Time;

/**
 * Test case for class \Iresults\ResourceBooking\Domain\Model\Booking.
 *
 * @copyright Copyright belongs to the respective authors
 * @license   http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 or later
 *
 * @author    Andreas Thurnheer-Meier <tma@iresults.li>
 * @author    Daniel Corn <cod@iresults.li>
 */
class TimeTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @test
     */
    public function initializeWithIntTest()
    {
        $time = new Time(2, 12, 34);
        $this->assertSame(2, $time->getHour());
        $this->assertSame(12, $time->getMinute());
        $this->assertSame(34, $time->getSecond());

        $time = new Time(2, 12);
        $this->assertSame(2, $time->getHour());
        $this->assertSame(12, $time->getMinute());
        $this->assertSame(0, $time->getSecond());

        $time = new Time(2);
        $this->assertSame(2, $time->getHour());
        $this->assertSame(0, $time->getMinute());
        $this->assertSame(0, $time->getSecond());
    }

    /**
     * @test
     * @dataProvider timeFromStringDataProvider
     * @param string $formattedString
     * @param int    $hour
     * @param int    $minute
     * @param int    $second
     */
    public function timeFromStringTest(string $formattedString, int $hour, int $minute, int $second)
    {
        $time = Time::timeFromString($formattedString);
        $this->assertSame($hour, $time->getHour());
        $this->assertSame($minute, $time->getMinute());
        $this->assertSame($second, $time->getSecond());
    }

    public function timeFromStringDataProvider(): array
    {
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

    /**
     * @test
     */
    public function timeFromSecondsSinceMidnightTest()
    {
        $time = Time::timeFromSecondsSinceMidnight(13 * 60 * 60 + 7 * 60 + 4);
        $this->assertSame(13, $time->getHour());
        $this->assertSame(7, $time->getMinute());
        $this->assertSame(4, $time->getSecond());

        $time = Time::timeFromSecondsSinceMidnight(2 * 60 * 60 + 12 * 60 + 34);
        $this->assertSame(2, $time->getHour());
        $this->assertSame(12, $time->getMinute());
        $this->assertSame(34, $time->getSecond());
    }

    /**
     * @test
     * @dataProvider timeFromUnixTimestampDataProvider
     * @param int $timestamp
     * @param int $hour
     * @param int $minute
     * @param int $second
     */
    public function timeFromUnixTimestampTest(int $timestamp, int $hour, int $minute, int $second)
    {
        $time = Time::timeFromTimestamp($timestamp);
        $this->assertSame($hour, $time->getHour());
        $this->assertSame($minute, $time->getMinute());
        $this->assertSame($second, $time->getSecond());
    }

    public function timeFromUnixTimestampDataProvider(): array
    {
        return [
            [time(), intval(date('H')), intval(date('i')), intval(date('s'))],
            [1484921125, 14, 05, 25],
            [1484917525, 13, 05, 25],
            [0, 0, 0, 0],
            [-1, 23, 59, 59],
        ];
    }

    /**
     * @test
     */
    public function timeFromDateTimeTest()
    {
        $time = Time::timeFromDateTime(new \DateTime('Fri 11.09.2015 17:07:32'));
        $this->assertSame(17, $time->getHour());
        $this->assertSame(7, $time->getMinute());
        $this->assertSame(32, $time->getSecond());

        $time = Time::timeFromDateTime(new \DateTime('Fri 11.09.2015 02:12:34'));
        $this->assertSame(2, $time->getHour());
        $this->assertSame(12, $time->getMinute());
        $this->assertSame(34, $time->getSecond());
    }


    /**
     * @test
     */
    public function getSecondsSinceMidnightTest()
    {
        $secondsSinceMidnight = 13 * 60 * 60 + 7 * 60 + 4;
        $time = Time::timeFromSecondsSinceMidnight($secondsSinceMidnight);
        $this->assertSame($secondsSinceMidnight, $time->getSecondsSinceMidnight());

        $secondsSinceMidnight = 2 * 60 * 60 + 12 * 60 + 34;
        $time = Time::timeFromSecondsSinceMidnight($secondsSinceMidnight);
        $this->assertSame($secondsSinceMidnight, $time->getSecondsSinceMidnight());

        $secondsSinceMidnight = 0;
        $time = Time::timeFromSecondsSinceMidnight($secondsSinceMidnight);
        $this->assertSame($secondsSinceMidnight, $time->getSecondsSinceMidnight());

        $time = new Time(2, 12, 34);
        $this->assertSame(7954, $time->getSecondsSinceMidnight());

        $time = new Time(13, 7, 4);
        $this->assertSame(47224, $time->getSecondsSinceMidnight());

        $time = new Time(0, 0, 0);
        $this->assertSame(0, $time->getSecondsSinceMidnight());

        $time = Time::timeFromString('2:12:34');
        $this->assertSame(7954, $time->getSecondsSinceMidnight());

        $time = Time::timeFromString('13:7:4');
        $this->assertSame(47224, $time->getSecondsSinceMidnight());

        $time = Time::timeFromString('0:0:0');
        $this->assertSame(0, $time->getSecondsSinceMidnight());
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToHighHourTest()
    {
        new Time(25);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithMaxHourAndToHighMinuteTest()
    {
        new Time(24, 1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithMaxHourAndToHighSecondTest()
    {
        new Time(24, 0, 1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToHighMinuteTest()
    {
        new Time(2, 60);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToHighSecondTest()
    {
        new Time(0, 0, 60);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToHighHourInStringTest()
    {
        Time::timeFromString('25:00:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithMixedAmPmTest()
    {
        Time::timeFromString('22:00:00 pm');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToMaxHourAndHighMinuteInStringTest()
    {
        Time::timeFromString('24:01:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToMaxHourAndHighSecondInStringTest()
    {
        Time::timeFromString('24:00:01');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToHighMinuteInStringTest()
    {
        Time::timeFromString('2:60:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToHighSecondInStringTest()
    {
        Time::timeFromString('0:0:60');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToLowHourTest()
    {
        new Time(-1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToLowMinuteTest()
    {
        new Time(2, -1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToLowSecondTest()
    {
        new Time(0, 0, -1);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToLowHourInStringTest()
    {
        Time::timeFromString('-1:00:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToLowMinuteInStringTest()
    {
        Time::timeFromString('2:-1:00');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     */
    public function initializeWithToLowSecondInStringTest()
    {
        Time::timeFromString('0:0:-1');
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     * @expectedExceptionCode 1441889370
     */
    public function timeFromSecondsSinceMidnightToHighTest()
    {
        Time::timeFromSecondsSinceMidnight(24 * 60 * 60 + 12 * 60 + 34);
    }

    /**
     * @test
     * @expectedException \OutOfBoundsException
     * @expectedExceptionCode 1441889371
     */
    public function timeFromSecondsSinceMidnightToLowTest()
    {
        Time::timeFromSecondsSinceMidnight(-1);
    }

    /**
     * @test
     */
    public function formatTest()
    {
        $time = new Time(2);
        $this->assertSame('02:00:00', $time->format('H:i:s'));

        $time = new Time(2, 12, 34);
        $this->assertSame('02:12:34', $time->format('H:i:s'));

        $time = new Time(13, 2, 34);
        $this->assertSame('01 PM 02:34', $time->format('h A i:s'));

        $time = new Time(13, 2, 34);
        $this->assertSame('1 PM 02:34', $time->format('g A i:s'));
    }

    /**
     * @test
     */
    public function diffTest()
    {
        $diff = (new Time(2))->diff(new Time(2));
        $this->assertSame('+0 hours 0 minutes 0 seconds', $diff->format('%R%h hours %i minutes %s seconds'));

        $diff = (new Time(2))->diff(new Time(2, 12));
        $this->assertSame('+0 hours 12 minutes 0 seconds', $diff->format('%R%h hours %i minutes %s seconds'));

        $diff = (new Time(2))->diff(new Time(23));
        $this->assertSame('+21 hours 0 minutes 0 seconds', $diff->format('%R%h hours %i minutes %s seconds'));

        $diff = (new Time(2, 10, 53))->diff(new Time(23));
        $this->assertSame('+20 hours 49 minutes 7 seconds', $diff->format('%R%h hours %i minutes %s seconds'));

        $diff = (new Time(2, 12))->diff(new Time(2));
        $this->assertSame('-0 hours 12 minutes 0 seconds', $diff->format('%R%h hours %i minutes %s seconds'));

        $diff = (new Time(23))->diff(new Time(2));
        $this->assertSame('-21 hours 0 minutes 0 seconds', $diff->format('%R%h hours %i minutes %s seconds'));

        $diff = (new Time(23))->diff(new Time(2, 10, 53));
        $this->assertSame('-20 hours 49 minutes 7 seconds', $diff->format('%R%h hours %i minutes %s seconds'));
    }
}