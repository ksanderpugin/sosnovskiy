<?php

namespace App\Models;

use App\Services\Database;
use App\Structures\ProductPack;

class Product extends DatabaseModel {

    public string $barcode, $nameUK, $nameRU, $nameEN, $ingredientsUK, $ingredientsRU, $ingredientsEN, $iconLink, $part;
    public float $protein, $fat, $carb, $cal;
    public array $photos, $packs;
    public bool $actual;

    public static function getActuals(
        string $category = "All", 
        array $settings = []): array {

        $query = 'SELECT * FROM `' . static::getTableName() . '` WHERE `actual` = 1';
        $params = [];
        if (strtolower($category) !== 'all') {
            $query .= ' AND `part` = :part';
            $params['part'] = $category;
        }
        if (array_key_exists('orderBy', $settings)) {
            $query .= ' ORDER BY `' . $settings['orderBy'] . '`';
            if (array_key_exists('descOrder', $settings)) $query .= ' DESC';
        }

        if (array_key_exists('limit', $settings)) {
            $offset = (int) $settings['offset'] ?? 0;
            $limit = (int) $settings['limit'];
            $query .= " LIMIT $offset, $limit";
        }
        
        $req = Database::getInst()->execute($query, $params);
        
        $result = [];
        foreach ($req as $item) $result[] = static::createObjectFromDBArray($item);

        return $result;
    }

    private function __construct(int $id, string $barcode, string $nameUK, string $nameRU, string $nameEN, string $ingredientsUK,
                                 string $ingredientsRU, string $ingredientsEN, string $iconLink, string $part, float $protein,
                                 float $fat, float $carb, float $cal, array $packs, array $photos, bool $actual)
    {
        $this->setId($id);
        $this->barcode = $barcode;
        $this->nameUK = $nameUK;
        $this->nameRU = $nameRU;
        $this->nameEN = $nameEN;
        $this->ingredientsUK = $ingredientsUK;
        $this->ingredientsRU = $ingredientsRU;
        $this->ingredientsEN = $ingredientsEN;
        $this->iconLink = $iconLink;
        $this->part = $part;
        $this->protein = $protein;
        $this->fat = $fat;
        $this->carb = $carb;
        $this->cal = $cal;
        $this->packs = $packs;
        $this->photos = $photos;
        $this->actual = $actual;
    }
    
    protected static function getTableName() : string {
        return 'products';
    }

    protected static function createTable() : void {
        Database::getInst()->execute(
            'CREATE TABLE IF NOT EXISTS `' . static::getTableName() . '` (' .
            '`id` SERIAL, ' .
            '`barcode` INT UNSIGNED NOT NULL, ' .
            '`name_uk` TEXT, ' .
            '`name_ru` TEXT, ' .
            '`name_en` TEXT, ' .
            '`ingredients_uk` TEXT, ' .
            '`ingredients_ru` TEXT, ' .
            '`ingredients_en` TEXT, ' .
            '`icon_link` TEXT, ' .
            '`part` VARCHAR(16), ' .
            '`photos` TEXT, ' .
            '`protein` FLOAT DEFAULT 0, ' .
            '`fat` FLOAT DEFAULT 0, ' .
            '`carb` FLOAT DEFAULT 0, ' .
            '`cal` FLOAT DEFAULT 0, ' .
            '`packs` TEXT, ' .
            '`actual` INT(1) UNSIGNED DEFAULT 1, ' .
            'PRIMARY KEY(`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
        );
    }
    
    protected static function createObjectFromDBArray(array $data) {
        $packs = [];
        $packData = json_decode($data['packs']);
        foreach ($packData as $item) {
            $packs[] = new ProductPack($item->weight, $item->type, $item->cost, $item->opt);
        }
        $photos = json_decode($data['photos']);
        if (is_null($photos)) $photos = [];
        return new static(
            $data['id'],
            $data['barcode'],
            $data['name_uk'],
            $data['name_ru'],
            $data['name_en'],
            $data['ingredients_uk'],
            $data['ingredients_ru'],
            $data['ingredients_en'],
            $data['icon_link'],
            $data['part'],
            $data['protein'],
            $data['fat'],
            $data['carb'],
            $data['cal'],
            $packs,
            $photos,
            $data['actual'] > 0
        );
    }
    
    public function getValues() : array {
        return [
            'barcode' => $this->barcode,
            'name_uk' => $this->nameUK,
            'name_ru' => $this->nameRU,
            'name_en' => $this->nameEN,
            'ingredients_uk' => $this->ingredientsUK,
            'ingredients_ru' => $this->ingredientsRU,
            'ingredients_en' => $this->ingredientsEN,
            'icon_link' => $this->iconLink,
            'part' => $this->part,
            'protein' => $this->protein,
            'fat' => $this->fat,
            'carb' => $this->carb,
            'cal' => $this->cal,
            'packs' => json_encode($this->packs),
            'photos' => json_encode($this->photos),
            'actual' => $this->actual ? 1 : 0
        ];
    }
}