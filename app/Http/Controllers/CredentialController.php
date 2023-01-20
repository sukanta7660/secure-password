<?php

namespace App\Http\Controllers;

use App\Helper\Helper;
use App\Models\Credential;
use App\Models\Folder;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CredentialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request) : Response
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

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request) :RedirectResponse
    {
        $data = $this->validateData($request);

        Credential::create([
            'user_id'   => $request->user()->id,
            'folder_id' => $data['folder'],
            'item_type' => $data['type'],
            'name'      => $data['name'],
            'username'  => $data['name'],
            'password'  => $data['password'],
            'url'       => $data['url'],
            'notes'     => $data['notes'],
        ]);

        Helper::sendSuccessNotification('Credential successfully added');

        return back();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Credential $credential
     * @return RedirectResponse
     */
    public function update(Request $request, Credential $credential) :RedirectResponse
    {
        $data = $this->validateData($request);

        $credential->update([
            'folder_id' => $data['folder'],
            'item_type' => $data['type'],
            'name'      => $data['name'],
            'username'  => $data['name'],
            'password'  => $data['password'],
            'url'       => $data['url'],
            'notes'     => $data['notes'],
        ]);

        Helper::sendSuccessNotification('Credential successfully updated');

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Credential $credential
     * @return RedirectResponse
     */
    public function destroy(Credential $credential) :RedirectResponse
    {
        try {
            $credential->delete();
            Helper::sendSuccessNotification('Credential successfully deleted');
        } catch (Exception $exception) {
            Helper::sendErrorNotification('Something went wrong');
        }

        return back();
    }

    public function move(Request $request) :RedirectResponse
    {
        $request->validate([
            'folder'    => 'nullable|integer|exists:folders,id',
            'credentials' => 'array'
        ]);

        $credentials = $request->credentials;

        try {
            if (count($credentials)) {
                foreach ($credentials as $credential) {
                    Credential::whereId($credential['id'])->first()->update([
                        'folder_id' => $request->folder
                    ]);
                }
            }

            Helper::sendSuccessNotification('Credential successfully moved');

        } catch (Exception $exception) {
            Helper::sendErrorNotification('Something went wrong');
        }

        return back();
    }

    public function importCsv(Request $request) :RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimetypes:text/csv,application/vnd.ms-excel,application/csv'
        ]);

        try {
            $file = $request->file;
            $path = $file->path();

            // read the csv file
            $data = array_map('str_getcsv', file($path));

            //Remove the header row
            unset($data[0]);

            foreach ($data as $row) {
                // check folder exists or not
                $folderExists = Folder::whereId($row[1])
                    ->where('user_id', $request->user()->id)
                    ->first()
                ;

                Credential::create([
                    'user_id' => $request->user()->id,
                    'folder_id' => $folderExists ? $row[1] : null,
                    'item_type' => $row[3],
                    'name'  => $row[4],
                    'username'  => $row[5],
                    'password'  => $row[6],
                    'url'  => $row[7],
                    'notes'  => $row[8],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            Helper::sendSuccessNotification('Credential successfully imported');
        } catch (Exception $exception) {
            Helper::sendErrorNotification('Something went wrong');
        }

        return back();

    }

    /**
     * @throws Exception
     */
    public function checkMasterPassword(Request $request) :RedirectResponse
    {
        $request->validate(['masterPassword' => 'required']);

        $matched = Hash::check($request->masterPassword, $request->user()->password);


        if (!$matched) {
            throw ValidationException::withMessages([
                'masterPassword' => 'Password Not correct',
            ]);
        }

        return back();
    }

    private function validateData(Request $request): array
    {
        $rules = [
            'type'      => 'required',
            'folder'    => 'nullable|integer|exists:folders,id',
            'name'      => 'required|string|min:3|max:255',
            'username'  => 'nullable|string|max:255',
            'password'  => 'nullable|string|max:255',
            'url'       => 'nullable|url|max:255',
            'notes'     => 'nullable|string',
        ];

        $validatedData = $request->validate($rules);

        return $validatedData;
    }
}
