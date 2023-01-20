<?php

namespace App\Http\Controllers;

use App\Helper\Helper;
use App\Models\Credential;
use App\Models\Folder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request) :\Inertia\Response
    {
        $folders = Folder::where('user_id', $request->user()->id)
            ->paginate(10)
        ;

        $data = [
            'folders'     => $folders,
        ];

        return Inertia::render('Admin/Folder/Folder', $data);
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
        Folder::create([
            'name'      => $data['name'],
            'user_id'   => $request->user()->id
        ]);

        Helper::sendSuccessNotification('Folder successfully created');

        return back();
    }
    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Folder $folder
     * @return RedirectResponse
     */
    public function update(Request $request, Folder $folder) :RedirectResponse
    {
        $data = $this->validateData($request);

        $folder->update($data);

        Helper::sendSuccessNotification('Folder successfully updated');

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Folder $folder
     * @return RedirectResponse
     */
    public function destroy(Folder $folder) :RedirectResponse
    {
        try {
            if (count($folder->credential)) {
                Credential::where('folder_id', $folder->id)->update([
                    'folder_id' => null
                ]);
            }
            $folder->delete();
            Helper::sendSuccessNotification('Folder successfully deleted');
        } catch (\Exception $exception) {
            Helper::sendErrorNotification('Something went wrong');
        }

        return back();
    }

    private function validateData(Request $request): array
    {
        $rules = [
            'name'      => 'required|string|min:3|max:255|unique:folders,name',
        ];

        if($request->id) {
            $rules['name'] .= ",{$request->id}";
        }

        $validatedData = $request->validate($rules);

        return $validatedData;
    }
}
