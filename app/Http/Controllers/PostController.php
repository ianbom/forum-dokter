<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        private PostService $postService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'sort', 'per_page']);

        $posts = $this->postService->getPaginated($filters);

        return Inertia::render('admin/posts/index', [
            'posts'         => PostResource::collection($posts),
            'trendingPosts' => PostResource::collection($this->postService->getTrendingPosts())->resolve(),
            'filters'       => [
                'search'   => $filters['search'] ?? '',
                'sort'     => $filters['sort'] ?? 'latest',
                'per_page' => (int) ($filters['per_page'] ?? 12),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create', [
            'categories' => $this->postService->getCategories(),
        ]);
    }

    public function show(Post $post): Response
    {
        return Inertia::render('admin/posts/show', [
            'post' => $this->postService->getPostDetail($post),
        ]);
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'post'       => $this->postService->getPostForEdit($post),
            'categories' => $this->postService->getCategories(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $this->postService->store(
                data: [
                    'user_id'    => $request->user()->id,
                    'categories' => $validated['categories'],
                    'title'      => $validated['title'],
                    'content'    => $validated['content'],
                ],
                files: $request->file('attachments', []),
            );

            return redirect()
                ->route('posts.index')
                ->with('success', 'Diskusi berhasil dibuat.');
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Terjadi kesalahan']);
        }
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $this->postService->update($post, [
                'categories' => $validated['categories'],
                'title'      => $validated['title'],
                'content'    => $validated['content'],
            ]);

            return redirect()
                ->route('posts.show', $post)
                ->with('success', 'Diskusi berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with(['error' => 'Terjadi kesalahan saat memperbarui.']);
        }
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120', 'mimes:jpg,jpeg,png,gif,webp'],
        ]);

        $url = $this->postService->uploadImage($request->file('image'));

        return response()->json(['url' => $url]);
    }

    public function myPosts(Request $request): Response
    {
        $filters = $request->only(['search', 'sort', 'per_page']);

        $posts = $this->postService->getMyPostsPaginated($request->user()->id, $filters);

        return Inertia::render('admin/posts/my-post', [
            'posts'      => PostResource::collection($posts),
            'filters'    => [
                'search'   => $filters['search'] ?? '',
                'sort'     => $filters['sort'] ?? 'latest',
                'per_page' => (int) ($filters['per_page'] ?? 12),
            ],
        ]);
    }
}
