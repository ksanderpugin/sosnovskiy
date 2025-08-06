<?php

namespace App\Models;
use App\Services\Database;
use App\Services\MathService;

class Order extends DatabaseModel {

    public string $number, $clientName, $phone, $dateCreate, $dateDelivery;
    public int $deliveryType, $contactType, $state, $payType, $payState;
    public array $basket, $deliveryData;

    public static function create($fullName, $phone, $basket, $deliveryType, $contactType, $dateDelivery, $deliveryData)
    {
        $order = new static(0, '', $fullName, $phone, date('Y-m-d'), $dateDelivery, $deliveryType, $contactType, 0, 0,0,$basket,$deliveryData);
        Database::getInst()->execute('LOCK TABLES `' . static::getTableName() . '` WRITE;');
        $order->save(false);
        $order->number = MathService::getTimePlusNumber($order->bId, 34);
        $order->save(false);
        Database::getInst()->execute('UNLOCK TABLES');
        return $order;
    }

    public static function getByNumber($number) {
        $result = static::findByField('number', $number);
        if (count($result) > 0) return $result[0];
        return null;
    }

    private function __construct(int $id, string $number, string $clientName, string $phone, string $dateCreate, string $dateDelivery, int $deliveryType, int $contactType, int $state, int $payType, int $payState, array $basket, array $deliveryData)
    {
        $this->id = $id;
        $this->bId = $id;
        $this->number = $number;
        $this->clientName = $clientName;
        $this->phone = $phone;
        $this->dateCreate = $dateCreate;
        $this->dateDelivery = $dateDelivery;
        $this->deliveryType = $deliveryType;
        $this->contactType = $contactType;
        $this->state = $state;
        $this->payType = $payType;
        $this->payState = $payState;
        $this->basket = $basket;
        $this->deliveryData = $deliveryData;
    }

    protected static function getTableName() : string {
        return 'orders';
    }

    protected static function createTable() : void {
        Database::getInst()->execute(
            'CREATE TABLE IF NOT EXISTS `orders` (' .
            '`id` SERIAL, ' .
            '`number` VARCHAR(16) NOT NULL, ' .
            '`full_name` VARCHAR(256) DEFAULT NULL, ' .
            '`phone` VARCHAR(32) NOT NULL, ' .
            '`basket` TEXT, ' .
            '`date_create` DATE, ' .
            '`date_delivery` DATE, ' .
            '`delivery_type` TINYINT(1) UNSIGNED DEFAULT 0, ' .
            '`delivery_data` TEXT, ' .
            '`contact_type` TINYINT(1) UNSIGNED DEFAULT 0, ' .
            '`state` TINYINT(1) UNSIGNED DEFAULT 0, ' .
            '`pay_type` TINYINT(1) UNSIGNED DEFAULT 0, ' .
            '`pay_state` TINYINT(1) UNSIGNED DEFAULT 0, ' .
            'PRIMARY KEY(`id`), UNIQUE(`number`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
        );
    }

    protected static function createObjectFromDBArray(array $data) {
        return new self($data['id'],$data['number'],$data['full_name'],$data['phone'],$data['date_create'],$data['date_delivery'],
            $data['delivery_type'],$data['contact_type'],$data['state'],$data['pay_type'],$data['pay_state'],json_decode($data['basket'], true),
            json_decode($data['delivery_data'], true));
    }

    public function getValues() : array {
        return [
            'number' => $this->number,
            'full_name' => $this->clientName,
            'phone' => $this->phone,
            'basket' => json_encode($this->basket, JSON_UNESCAPED_UNICODE),
            'date_create' => $this->dateCreate,
            'delivery_type' => $this->deliveryType,
            'date_delivery' => $this->dateDelivery,
            'delivery_data' => json_encode($this->deliveryData, JSON_UNESCAPED_UNICODE),
            'contact_type' => $this->contactType,
            'state' => $this->state,
            'pay_type' => $this->payType,
            'pay_state' => $this->payState
        ];
    }
}