<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\FileUploadException;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Admin/Profile/Profile', [
            'profile' => $user,
        ]);
    }

    /**
     */
    public function update(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => "required|email|max:255|unique:users,email,{$request->user()->id}"
        ]);

        /* @var $user User */
        $user = $request->user();

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        Helper::sendSuccessNotification('Profile details successfully updated');

        return back();
    }

    public function changePassword(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'old_password' => 'required|string|max:255',
            'password'     => 'required|string|max:255|confirmed'
        ]);

        if (!\Hash::check($request->old_password, $request->user()->password)) {
            Helper::sendErrorNotification('Password did not match');
            return redirect()->back();
        }

        if ($request->password === $request->old_password) {
            Helper::sendErrorNotification('Old password and new password cannot be same');
            return redirect()->back();
        }

        $request->user()->update([
            'password' => Hash::make($request->password)
        ]);

        Helper::sendSuccessNotification('Password successfully updated');
        return redirect()->back();
    }
}
