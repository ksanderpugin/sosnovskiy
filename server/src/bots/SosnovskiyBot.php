<?php

namespace App\bots;

use App\bots\Telegraf;

class SosnovskiyBot extends Telegraf
{

    public function clientListener(TelegrafHandler $handler)
    {
        // TODO: Implement clientListener() method.
    }

    protected static function getToken() : string
    {
        return '8097785805:AAEdmc5y73jEsLm9bGTvkfLV6UQ8MfER8zM';
    }

    protected static function getWebHook() : string
    {
        return '';
    }
}