<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $itemTypes = ['login', 'card', 'identity'];
        Schema::create('credentials', function (Blueprint $table) use ($itemTypes){
            $table->id();
            $table->foreignId('folder_id')
                ->nullable()
                ->constrained('folders');
            $table->foreignId('user_id')
                ->constrained('users');
            $table->enum('item_type', $itemTypes)->default($itemTypes[0]);
            $table->string('name');
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('url')->nullable();
            $table->mediumText('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('credentials');
    }
};
