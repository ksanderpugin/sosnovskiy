<?php

namespace App\Models;

use App\Services\Database;
use Exception;

function strToCamelCase(string $string): string {
    return str_replace('_', '', ucwords($string, '_'));
}

abstract class DatabaseModel
{
    protected int $bId;
    public int $id;

    public function getId() : int
    {
        return $this->bId;
    }

    protected function setId($id) : void {
        $this->id = $id;
        $this->bId = $id;
    }

    public function save($withLock = true) {
        $query = ''; $params = []; $values = $this->getValues();
        $qu = []; $qi = [[],[]];
        
        foreach ($values as $dbName => $val) {
            $paramName = strToCamelCase($dbName);
            $qu[] = "`$dbName` = :$paramName";
            $qi[0][] = "`$dbName`";
            $qi[1][] = ":$paramName";
            $params[$paramName] = $val;
        }
        if ($this->getId() > 0) {
            $query = 'UPDATE `' . static::getTableName() . '` SET ';
            $query .= implode(', ', $qu) . ' WHERE `id` = :id;';
            $params['id'] = $this->getId();
        } else {
            $qf = function ($value) {return "`$value`";};
            $pf = function ($value) {return ":$value";};
            
            $query = 'INSERT INTO `' . static::getTableName() . '` (' . implode(', ', $qi[0]) . 
            ') VALUES (' . implode(', ', $qi[1]) . ');';
        }

        try {
            if ($withLock) Database::getInst()->execute('LOCK TABLES `' . static::getTableName() . '` WRITE;');
            $result = Database::getInst()->execute($query, $params);
            if ($this->getId() == 0) $this->setId($result);
            if ($withLock) Database::getInst()->execute('UNLOCK TABLES');
        } catch (\Exception $ex) {
            $exData = json_decode($ex->getMessage());
            if ($exData->type == Database::DB_TABLE_NOT_EXISTS_EX) static::createTable();
            else throw $ex;
            $this->save();
        }
    }

    protected static function findByField(string $field, $value) : array
    {
        try {
            $result = Database::getInst()->execute(
                'SELECT * FROM `' . static::getTableName() . '` WHERE `' . $field . '` = :value',
                [
                    'value' => $value
                ]
            );
            $arr = [];
            foreach ($result as $item) {
                $arr[] = static::createObjectFromDBArray($item);
            }
            return $arr;
        } catch (\Exception $ex) {
            $exData = json_decode($ex->getMessage());
            if ($exData->type == Database::DB_TABLE_NOT_EXISTS_EX) static::createTable();
            return [];
        }
    }

    // protected static function findByParams($fields = [], $orders = [], $groups = []) : array {
    //     $query = 'SELECT * FROM `' . static::getTableName() . '`';
    //     $params = [];
    //     if (count($fields) > 0) {
    //         $qp = [];
    //         foreach( $fields as $name => $value ) {
    //             $paramName = strToCamelCase($name);
    //             $qp[] = "`$name` = :$paramName";
    //             $params[$paramName] = $value;
    //         }
    //         $query .= ' WHERE ' . join(' AND ', $qp);
    //     }
    //     if (count($orders) > 0) {
    //         $qp = [];
    //         foreach ($orders as $name => $direction) {
    //             $qp[] = $direction === 'DESC' ? "`$name` DESC" : "`$name`";
    //         }
    //         $query .= ' ORDER BY ' . join(', ', $qp);
    //     }
    // }

    public static function fetchAll() : array
    {
        try {
            $result = Database::getInst()->execute('SELECT * FROM `' . static::getTableName() . '`');
            $arr = [];
            foreach ($result as $item) {
                $arr[] = static::createObjectFromDBArray($item);
            }
            return $arr;
        } catch (\Exception $ex) {
            $exData = json_decode($ex->getMessage());
            if ($exData->type == Database::DB_TABLE_NOT_EXISTS_EX) static::createTable();
            return [];
        }
    }

    public static function getById(int $id) : static | null
    {
        $result = static::findByField('id', $id);
        return count($result) > 0 ? $result[0] : null;
    }

    abstract protected static function getTableName() : string;
    abstract protected static function createTable() : void;
    abstract protected static function createObjectFromDBArray(array $data);
    abstract public function getValues() : array;
}