<?php

namespace App\Services;

use App\Actions\Categories\DeleteCategoryAction;
use App\Actions\Categories\StoreCategoryAction;
use App\Actions\Categories\UpdateCategoryAction;
use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CategoryService
{
    public function __construct(
        private StoreCategoryAction $storeCategoryAction,
        private UpdateCategoryAction $updateCategoryAction,
        private DeleteCategoryAction $deleteCategoryAction,
    ) {}

    public function getPaginated(array $filters): LengthAwarePaginator
    {
        $query = Category::withCount('posts');

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        $sort = $filters['sort'] ?? 'latest';
        $query->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');

        $perPage = $filters['per_page'] ?? 10;
        
        if ($perPage === 'all') {
            $perPage = $query->count();
            if ($perPage === 0) {
                $perPage = 1;
            }
        }

        return $query->paginate((int) $perPage)->withQueryString();
    }

    public function store(array $data): Category
    {
        return $this->storeCategoryAction->handle($data);
    }

    public function update(Category $category, array $data): Category
    {
        return $this->updateCategoryAction->handle($category, $data);
    }

    public function delete(Category $category): void
    {
        $this->deleteCategoryAction->handle($category);
    }
}
