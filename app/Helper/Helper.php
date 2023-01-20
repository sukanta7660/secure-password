<?php

namespace App\Helper;

use Session;
class Helper
{

    public static function sendSuccessNotification(string $message): void
    {
        static::setNotification(['message' => $message, 'type' => 'success']);
    }

    public static function sendErrorNotification(string $message = 'Something went wrong'): void
    {
        static::setNotification(['message' => $message, 'type' => 'error']);
    }

    public static function setNotification(array $notification): void
    {
        Session::flash('toast', $notification);
    }

    public static function generateRandomString($length = 10): string
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public static function generatePassword(): string
    {
        return md5(static::generateRandomString());
    }


    public static function sendUnauthorizedNotification(): void
    {
        static::sendErrorNotification('You are not authorized to perform this action');
    }
}
