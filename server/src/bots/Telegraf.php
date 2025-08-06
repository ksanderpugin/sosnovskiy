<?php

namespace App\bots;

abstract class Telegraf {

    public const NO_PARSE_MODE = 0;
    public const PARSE_HTML_MODE = 1;
    public const PARSE_MDV2_MODE = 2;

    public function sendText(int $chatId, string $text, TelegrafSendTextSettings $settings = null) : string 
    {
        $result = '{}';
        if (is_null($settings)) $settings = new TelegrafSendTextSettings();
        
        if (count($settings->inlineKeys) > 0) {
            $keyboard = [
                'inline_keyboard' => []
            ];
            foreach ($settings->inlineKeys as $inlineKey) {
                if (strlen($inlineKey->url) > 0) {
                    $keyboard['inline_keyboard'][] = [['text' => $inlineKey->name, 'url' => $inlineKey->url]];
                }
                else if (strlen($inlineKey->callback) > 0) {
                    $keyboard['inline_keyboard'][] = [['text' => $inlineKey->name, 'callback_data' => $inlineKey->callback]];
                }
            }
            if (count($keyboard['inline_keyboard']) == 0) 
                return $this->sendText($chatId, $text, new TelegrafSendTextSettings($settings->parceMode, [], $settings->assoc));

            $data = [
                'chat_id' => $chatId,
                'text' => $text,
                'reply_markup' => json_encode($keyboard)
            ];
                
            $url = 'https://api.telegram.org/bot' . static::getToken() . '/sendMessage';
            $options = [
                'http' => [
                    'header'  => "Content-Type: application/json\r\n",
                    'method'  => 'POST',
                    'content' => json_encode($data),
                ]
            ];
                
            $context  = stream_context_create($options);
            $result = file_get_contents($url, false, $context);
        } else {
            $url = 'https://api.telegram.org/bot' . static::getToken() . 
                    '/sendMessage?chat_id=' . $chatId . 
                    '&text=' . urlencode($text);
            
            if ($settings->parceMode == self::PARSE_MDV2_MODE) $url .= '&parse_mode=MarkdownV2';
            else if ($settings->parceMode == self::PARSE_HTML_MODE) $url .= '&parse_mode=HTML';
            $result = file_get_contents($url);
        }
        return $result;
    }

    public function editMessage(int $chatId, int $messageId, string $text, TelegrafSendTextSettings $settings = null) : string
    {
        if (is_null($settings)) $settings = new TelegrafSendTextSettings();

        $url = 'https://api.telegram.org/bot' . static::getToken() . '/editMessageText';

        $data = [
            'chat_id' => $chatId,
            'message_id' => $messageId,
            'text' => $text
        ];

        if ($settings->parceMode == self::PARSE_MDV2_MODE) $data['parse_mode'] = 'MarkdownV2';
        else if ($settings->parceMode == self::PARSE_HTML_MODE) $data['parse_mode'] = 'HTML';

        if (count($settings->inlineKeys) > 0) {
            $keyboard = [
                'inline_keyboard' => []
            ];
            foreach ($settings->inlineKeys as $inlineKey) {
                if (strlen($inlineKey->url) > 0) {
                    $keyboard['inline_keyboard'][] = [['text' => $inlineKey->name, 'url' => $inlineKey->url]];
                }
                else if (strlen($inlineKey->callback) > 0) {
                    $keyboard['inline_keyboard'][] = [['text' => $inlineKey->name, 'callback_data' => $inlineKey->callback]];
                }
            }
            if (count($keyboard['inline_keyboard']) > 0) $data['reply_markup'] = json_encode($keyboard);
        }

        $options = [
            'http' => [
                'header'  => "Content-Type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data),
            ]
        ];

        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        return $result;
    }

    public function senPhotoByIdOrUrl(int $chatId, string $id, string $caption = '') : string
    {
        $url = 'https://api.telegram.org/bot' . static::getToken() . 
                '/sendPhoto?chat_id=' . $chatId . 
                '&photo=' . urlencode($id) . 
                '&caption=' . urlencode($caption);
        return file_get_contents($url);
    }

    public function sendLocalPhoto(int $chatId, string $path, string $caption = '') : string
    {
        $url = 'https://api.telegram.org/bot' . static::getToken() . '/sendPhoto';

        $post_fields = [
            'chat_id' => $chatId,
            'photo' => new \CURLFile(realpath($path)),
            'caption' => $caption
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
        
        return $response;
    }

    public function setWebHook() : void
    {
        $tmURL = 'https://api.telegram.org/bot' . static::getToken() . '/setWebhook?url=' . static::getWebHook();
        $data = file_get_contents($tmURL);
        echo $data;
    }

    abstract public function clientListener(TelegrafHandler $handler);
    abstract protected static function getToken() : string;
    abstract protected static function getWebHook() : string;
}

class TelegrafSendTextSettings {
    public int $parceMode;
    public array $inlineKeys;
    public bool $assoc;

    public function __construct(int $parceMode = Telegraf::NO_PARSE_MODE, array $inlineKeys = [], bool $assoc = false)
    {
        $this->parceMode = $parceMode;
        $this->inlineKeys = $inlineKeys;
        $this->assoc = $assoc;
    }

    public function addKey(TelegrafInlineKey $key) : void
    {
        $this->inlineKeys[] = $key;
    }
}

class TelegrafInlineKey {
    public string $name;
    public string $callback;
    public string $url;

    public function __construct($name, $callback, $url = '')
    {
        $this->name = $name;
        $this->callback = $callback;
        $this->url = $url;
    }
}

class TelegrafHandler {

    public const COMMAND = 1;
    public const PHOTO = 2;
    public const TEXT = 3;
    public const VOICE = 4;
    public const CALLBACK = 5;

    public int $type = -1, $userId = -1, $chatId = -1, $date = -1, $messageId = -1;
    public string $firstName = '', $lastName = '', $nikName = '', $text = '', $captiion = '', $query = '';
    public bool $isBot = false;
    public array $photos = [];

    private static $inst;

    private function __construct()
    {
        // $data = Service::getRestJSON(true);
        // file_put_contents(dirname(__DIR__) . '/log/zs.log', date('d-m-Y H:i:s') . PHP_EOL . json_encode($data, JSON_UNESCAPED_UNICODE));
        $json = file_get_contents(dirname(__DIR__) . '/log/command.json');
        $data = json_decode($json, true);
        if (array_key_exists('message', $data)) {
            $this->userId = $data['message']['from']['id'] ?? -1;
            $this->isBot = $data['message']['from']['is_bot'] ?? false;
            $this->firstName = $data['message']['from']['first_name'] ?? '';
            $this->lastName = $data['message']['from']['last_name'] ?? '';
            $this->nikName = $data['message']['from']['username'] ?? '';
            
            $this->chatId = $data['message']['chat']['id'] ?? -1;
            $this->date = $data['message']['date'] ?? 0;

            $type = $data['message']['entities'][0]['type'] ?? 'no_command';
            if ($type == 'bot_command') {
                $this->type = self::COMMAND;
                preg_match('~\/([a-z0-9]+)$~', $data['message']['text'], $matches);
                if (count($matches) > 1) $this->text = $matches[1];
                else $this->text = '';

            } else if (array_key_exists('text', $data['message'])) {
                $this->type = self::TEXT;
                $this->text = $data['message']['text'];

            } else if (array_key_exists('photo', $data['message'])) {
                $this->type = self::PHOTO;

            } else if (array_key_exists('voice', $data['message'])) {
                $this->type = self::VOICE;
            }
        } else if (array_key_exists('callback_query', $data)) {
            $this->type = self::CALLBACK;
            $this->text = $data['callback_query']['data'];
            $this->chatId = $data['callback_query']['message']['chat']['id'] ?? 0;
            $this->firstName = $data['callback_query']['from']['first_name'] ?? '';
            $this->lastName = $data['callback_query']['from']['last_name'] ?? '';
            $this->nikName = $data['callback_query']['from']['username'] ?? '';
            $this->userId = $data['callback_query']['from']['id'] ?? 0;
            $this->messageId = $data['callback_query']['message']['message_id'] ?? 0;
            $this->query = $data['callback_query']['message']['text'] ?? '';
        }
    }

    public static function getInst() : TelegrafHandler
    {
        if (!self::$inst) self::$inst = new self();
        return self::$inst;
    }

    public function isCommand() : bool 
    {
        return $this->type == self::COMMAND;
    }

    public function isText() : bool
    {
        return $this->type == self::TEXT;
    }

    public function isPhoto() : bool
    {
        return $this->type == self::PHOTO;
    }

    public function isVoice() : bool
    {
        return $this->type == self::VOICE;
    }

    public function isCallback() : bool 
    {
        return $this->type == self::CALLBACK;
    }
}