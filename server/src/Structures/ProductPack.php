<?php

namespace App\Structures;

class ProductPack
{
    public int $weight, $type;
    public float $cost, $opt;

    public const FULL = 1;
    public const HALF = 2;
    public const PACKAGE = 3;
    public const WEIGHT = 0;

    public function __construct(int $weight, int $type, float $cost, float $opt)
    {
        $this->weight = $weight;
        $this->type = $type;
        $this->cost = $cost;
        $this->opt = $opt;
    }
}