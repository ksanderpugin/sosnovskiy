<?php

namespace App\Services;

use App\Settings\Config;

class Database
{
    public const DB_CONNECT_ERROR_EX = 0;
    public const DB_TABLE_NOT_EXISTS_EX = 1;
    public const DB_QUERY_ERROR_EX = 2;

    private static Database $inst;
    private \PDO $connection;
    private static bool $connect = false;

    private function __construct()
    {
        $this->connect();
    }


    private function connect() {
        try {
            $this->connection = new \PDO(
                Config::DB_TYPE.':host=' . Config::DB_HOST . ';dbname=' . Config::DB_NAME,
                Config::DB_USER,
                Config::DB_PASS
            );

            $this->connection->exec('set names utf8');

            self::$connect = true;
        } catch (\PDOException $ex) {
            self::$connect = false;
            throw new \Exception(json_encode([
                'type' => self::DB_CONNECT_ERROR_EX,
                'error' => $ex->getMessage()
            ]));
        }
    }

    public static function getInst() : Database
    {
        if (!self::$connect) self::$inst = new self();
        return self::$inst;
    }

    public function execute(string $query, array $params = []) : bool | int | array
    {
        if (!self::$connect) return false;
        try {
            $stm = $this->connection->prepare($query);
            $respond = $stm->execute($params);
            if ($respond !== false) {
                preg_match('~^select(.*)$~i', $query, $matches);
                if (!empty($matches)) return $stm->fetchAll(\PDO::FETCH_ASSOC);
                preg_match('~^insert(.*)$~i', $query, $matches);
                if (!empty($matches)) return $this->connection->lastInsertId();
                return true;
            } else {
                preg_match('~.* exist$~', trim($this->connection->errorInfo()[2]), $matches);
                if (!empty($matches)) throw new \Exception(json_encode([
                    'type' => self::DB_TABLE_NOT_EXISTS_EX,
                    'error' => $this->connection->errorInfo()[2]
                ]));
                throw new \Exception(json_encode([
                    'type' => self::DB_QUERY_ERROR_EX,
                    'Query error' => $this->connection->errorInfo()[2],
                    'Query' => $query,
                    'params' => $params
                ]));
            }
        } catch (\PDOException $ex) {
            preg_match('~.* exist$~', trim($ex->getMessage()), $matches);
            if (!empty($matches)) {
                throw new \Exception(json_encode([
                    'type' => self::DB_TABLE_NOT_EXISTS_EX,
                    'error' => $ex->getMessage()
                ]));
            }
            throw new \Exception(json_encode([
                'type' => self::DB_QUERY_ERROR_EX,
                'Query error' => $ex->getMessage(),
                'Query' => $query,
                'params' => $params
            ]));
        }
    }
}