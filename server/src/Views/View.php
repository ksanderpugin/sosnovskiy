<?php

namespace App\Views;

class View {

    public static function renderJSON(array $data = [], int $status = 200): void
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, PUT");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header('Content-Type: application/json');
        http_response_code($status);
        if (count($data) > 0) echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public static function getHtml($templatePath): string {
        $path = __DIR__ . '/Templates/' . $templatePath;
        if (file_exists($path)) {
            ob_start();
            include $path;
            return ob_get_clean();
        }
        return '';
    }
}