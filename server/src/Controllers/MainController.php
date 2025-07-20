<?php

namespace App\Controllers;

use App\Views\View;

class MainController {
    
    public function main(): void {
        View::renderJSON([
            'ok' => true,
            'msg' => 'Hello! This is Sosnovskiy Shop'
        ]);
    }
}