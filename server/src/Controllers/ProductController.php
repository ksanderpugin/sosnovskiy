<?php

namespace App\Controllers;

use App\Models\Product;
use App\Views\View;

class ProductController {

    public function main() : void {
        $category = $_GET['category'] ?? 'All';
        $limit = $_GET['limit'] ?? false;
        $offset = $_GET['offset'] ?? 0;
        $settings = [];
        if ($limit) {
            $settings['limit'] = (int) $limit;
            $settings['offset'] = (int) $offset;
        }
        View::renderJSON([
            'ok' => true,
            'products' => Product::getActuals($category, $settings)
        ]);
    }

    public function getByIds() : void {
        $ids = $_GET['ids'] ?? '';
        if (strlen($ids) < 1) return;

        $arrId = explode(',', $ids);
        $posIds = [];
        foreach ($arrId as $item) {
            $posIds[] = (int) $item;
        }
        View::renderJSON([
            'ok' => true,
            'products' => Product::getByIds($posIds)
        ]);
    }

    public function showCategories(): void {

        View::renderJSON([
            'ok' => true,
            'categories' => [
                [
                    'en' => 'Boiled',
                    'uk' => 'Варені ковбаси',
                    'ru' => 'Вареные колбасы',
                    'name' => 'boiled'
                ],
                [
                    'en' => 'Sausages',
                    'uk' => 'Сосиски та сардельки',
                    'ru' => 'Сосиски и сардельки',
                    'name' => 'sausages'
                ],
                [
                    'en' => 'Semi-smoked',
                    'uk' => 'Напівкопчені ковбаси',
                    'ru' => 'Полукопченые колбасы',
                    'name' => 'semi-smoked'
                ],
                [
                    'en' => 'Delicacies',
                    'uk' => 'Делікатеси',
                    'ru' => 'Деликатесы',
                    'name' => 'delicacies'
                ]
            ]
        ]);
    }
}