<?php

namespace App\Services;

class Data {

    public static function getRawData(bool $assoc = false) : mixed {
        $body = file_get_contents('php://input');
        return json_decode($body, $assoc);
    }

    public static function getFormData(bool $assoc = false): mixed {
        $result = $assoc ? $_POST : (object) $_POST;
        return $result;
    }

    public static function getURIData(bool $assoc = false): mixed {
        $result = $assoc ? $_GET : (object) $_GET;
        return $result;
    }
}