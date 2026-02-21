<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $categoryService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'sort', 'per_page']);

        $categories = $this->categoryService->getPaginated($filters);

        return Inertia::render('admin/category/index', [
            'categories' => CategoryResource::collection($categories),
            'filters'    => [
                'search'   => $filters['search'] ?? '',
                'sort'     => $filters['sort'] ?? 'latest',
                'per_page' => (int) ($filters['per_page'] ?? 10),
            ],
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $this->categoryService->store([
                'name' => $validated['name'],
            ]);

            return redirect()
                ->back()
                ->with('success', 'Kategori berhasil ditambahkan.');
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal menambahkan kategori.');
        }
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $this->categoryService->update($category, [
                'name' => $validated['name'],
            ]);

            return redirect()
                ->back()
                ->with('success', 'Kategori berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal memperbarui kategori.');
        }
    }

    public function destroy(Category $category): RedirectResponse
    {
        try {
            $this->categoryService->delete($category);

            return redirect()
                ->back()
                ->with('success', 'Kategori berhasil dihapus.');
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal menghapus kategori.');
        }
    }
}
