<?php

namespace App\Helper;

class FrontEndHelper
{
    public static function getSidebarNavigation(): array
    {
        $navigationMenu = [
            [
                'link'      => 'dashboard',
                'text'      => 'Dashboard',
                'icon'      => 'bi bi-command',
                'active_on' => 'dashboard'
            ],
            [
                'link'      => 'credential.index',
                'text'      => 'Credentials',
                'icon'      => 'bi bi-shield-check',
                'active_on' => 'credential.index'
            ],
            [
                'link'      => 'folder.index',
                'text'      => 'Folder',
                'icon'      => 'bi bi-folder',
                'active_on' => 'folder.index'
            ],
            [
                'link'      => 'password.generator',
                'text'      => 'Password Generator',
                'icon'      => 'bi bi-lock',
                'active_on' => 'password.generator'
            ]
        ];

        // Add conditional checking for permissions

        return $navigationMenu;
    }
}
