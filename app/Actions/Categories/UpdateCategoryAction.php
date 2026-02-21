<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UpdateCategoryAction
{
    public function handle(Category $category, array $data): Category
    {
        return DB::transaction(function () use ($category, $data) {
            $category->update([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
            ]);

            return $category->fresh();
        });
    }
}
