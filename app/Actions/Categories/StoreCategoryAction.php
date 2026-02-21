<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreCategoryAction
{
    public function handle(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            return Category::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
            ]);
        });
    }
}
