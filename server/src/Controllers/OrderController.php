<?php

namespace App\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\Data;
use App\Views\View;
use App\bots\SosnovskiyBot;

class OrderController {

    public function main($number = '') {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') $this->create();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') $this->show($number);
    }

    public function create(): void {
        $data = Data::getRawData(true);
        
        $basket = json_decode($data['basket'], true);
        // $basketData = [];
        // foreach ($basket as $key => $num) {
        //     $dt = explode('_', $key);
        //     $product = Product::getById((int) $dt[1]);
        //     $pack = $product->packs[(int) $dt[2]];
        //     $basketData[] = [
        //         'posId' => $product->getId(),
        //         'num' => $num,
        //         'price' => $pack->cost,
        //         'packType' => $pack->type,
        //         'packWeight' => $pack->weight
        //     ];
        // }

        $order = Order::create(
            $data['first-name'] . ' ' . $data['last-name'],
            $data['phone'],
            $basket,
            $data['delivery-type'] == 'np' ? 1 : 0,
            $data['contact-by'],
            $data['delivery-day'],
            array_key_exists('shop', $data) ? 
                [
                    'shop' => $data['shop']
                ] :
                [
                    'city' => $data['city'],
                    'address' => $data['address']
                ]
        );
        $bot = new SosnovskiyBot();
        $result = $bot->sendText(
            208034373,
            'New order: ' . $order->id . PHP_EOL .
            'Contact By: ' . $order->contactType . PHP_EOL . 
            'phone: ' . $order->phone . PHP_EOL . 
            'Page: /order/' . $order->number
        );
        View::renderJSON([
            'ok' => true,
            'order' => $order
        ]);
    }

    public function show($number) {
        $order = Order::getByNumber($number);
        if ($order) {
            View::renderJSON([
                'ok' => true,
                'order' => $order
            ]);
        } else {
            View::renderJSON([
                'ok' => false,
                'error' => 'Order not found'
            ]);
        }
    }
}