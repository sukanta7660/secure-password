<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request) :\Inertia\Response
    {
        $credentials = Credential::where('user_id', $request->user()->id)
            ->with(['user', 'folder'])
            ->paginate(10)
        ;

        $folders = Folder::where('user_id', $request->user()->id)->get();

        $data = [
            'credentials' => $credentials,
            'folders'     => $folders
        ];

        return Inertia::render('Admin/Credential/Credentials', $data);
    }
}
