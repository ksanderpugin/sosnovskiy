<?php

namespace App\Services;

class MathService {
    public static function getTimePlusNumber($i = 0, $osn = 60) : string {
        if ($osn > 60) return false;
        $number = time() + $i;
        $numberStr = '';
        $alphabet = '123456789ABCDIFGHIJKLMNOPQRSTUVWXYZ0abcdefghjkmnopqrstuvwxyz';
        $floor = $number;
        do {
            $ost = $floor%$osn;
            $numberStr = $alphabet[$ost] . $numberStr;
            $floor = floor($floor/$osn);
        } while ($floor > 0);
        return $numberStr;
    }
}