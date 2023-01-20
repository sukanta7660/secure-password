<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Credential extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function folder() :BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function user() :BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
