<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class DeleteCategoryAction
{
    public function handle(Category $category): void
    {
        DB::transaction(function () use ($category) {
            $category->delete();
        });
    }
}
