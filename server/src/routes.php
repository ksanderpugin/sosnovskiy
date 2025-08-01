<?php

return [
    '~^$~' => [\App\Controllers\MainController::class, 'main'],

    '~^api/products$~' => [\App\Controllers\ProductController::class, 'main'],
    '~^api/categories$~' => [\App\Controllers\ProductController::class, 'showCategories'],
];