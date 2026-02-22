<?php

namespace App\Services;

use App\Actions\Posts\StorePostAction;
use App\Actions\Posts\UpdatePostAction;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostService
{
    public function __construct(
        private StorePostAction $storePostAction,
        private UpdatePostAction $updatePostAction,
    ) {}

    public function getPaginated(array $filters): LengthAwarePaginator
    {
        $query = Post::with(['user', 'category'])->withCount('comments');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->where('is_hidden', false);
            } elseif ($filters['status'] === 'hidden') {
                $query->where('is_hidden', true);
            }
        }

        $sort = $filters['sort'] ?? 'latest';
        $query = match ($sort) {
            'oldest'         => $query->oldest(),
            'most_viewed'    => $query->orderByDesc('views'),
            'most_commented' => $query->orderByDesc('comments_count'),
            default          => $query->latest(),
        };

        $perPage = (int) ($filters['per_page'] ?? 12);
        $perPage = min(max($perPage, 6), 50);

        return $query->paginate($perPage)->withQueryString();
    }

    public function getMyPostsPaginated(int $userId, array $filters): LengthAwarePaginator
    {
        $query = Post::with(['user', 'category'])->withCount('comments')
            ->where('user_id', $userId);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('title', 'like', "%{$search}%");
        }

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->where('is_hidden', false);
            } elseif ($filters['status'] === 'hidden') {
                $query->where('is_hidden', true);
            }
        }

        $sort = $filters['sort'] ?? 'latest';
        $query = match ($sort) {
            'oldest'         => $query->oldest(),
            'most_viewed'    => $query->orderByDesc('views'),
            'most_commented' => $query->orderByDesc('comments_count'),
            default          => $query->latest(),
        };

        $perPage = (int) ($filters['per_page'] ?? 12);
        $perPage = min(max($perPage, 6), 50);

        return $query->paginate($perPage)->withQueryString();
    }

    public function getCategories(): Collection
    {
        return Category::orderBy('name')->get(['id', 'name', 'slug']);
    }

    public function getPostDetail(Post $post): Post
    {
        $post->load([
            'user' => function ($query) {
                $query->withCount(['posts', 'comments']);
            },
            'category',
            'attachments',
            'comments' => function ($query) {
                $query->whereNull('parent_id')
                    ->with([
                        'user',
                        'attachments',
                        'replies' => function ($q) {
                            $q->with(['user', 'attachments'])
                              ->orderBy('created_at', 'asc');
                        },
                    ])
                    ->orderBy('created_at', 'asc');
            },
        ]);

        $post->loadCount('comments');

        return $post;
    }

    public function getPostForEdit(Post $post): Post
    {
        return $post->load(['category']);
    }

    public function store(array $data, array $files = []): Post
    {
        return $this->storePostAction->handle($data, $files);
    }

    public function update(Post $post, array $data): Post
    {
        return $this->updatePostAction->handle($post, $data);
    }

    public function uploadImage(UploadedFile $file): string
    {
        $fileName = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                    . '_' . Str::random(8)
                    . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs('post-images', $fileName, 'public');

        return Storage::disk('public')->url($path);
    }
}
