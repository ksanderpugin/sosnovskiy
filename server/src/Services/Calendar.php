<?php

namespace App\Services;

class Calendar
{
    public static function getDatesToDelivery() : array
    {
        $firstDate = 1;
        $time = time() + $firstDate*24*3600;
        $result = [];
        for ($i=0; $i<7; ) {
            $day = (int) date('N', $time);
            if (!in_array($day, [1,3,7])) {
                $result[] = [
                    'dayNumber' => $day,
                    'day' => (int) date('j', $time),
                    'month' => (int) date('m', $time),
                    'date' => date('Y-m-d', $time)
                ];
                $i++;
            }
            $time += 24*3600;
        }
        return $result;
    }
}