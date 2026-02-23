<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Services\CommentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function __construct(
        private CommentService $commentService,
    ) {}

    public function store(StoreCommentRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $this->commentService->store([
                'post_id'   => $validated['post_id'],
                'user_id'   => $request->user()->id,
                'parent_id' => $validated['parent_id'] ?? null,
                'content'   => $validated['content'],
            ]);

            return redirect()
                ->back()
                ->with('success', 'Komentar berhasil ditambahkan.');
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal menambahkan komentar.');
        }
    }

    public function update(UpdateCommentRequest $request, Comment $comment): RedirectResponse
    {
        $user = Auth::user();

        if ($user->id !== $comment->user_id && $user->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        try {
            $validated = $request->validated();

            $this->commentService->update($comment, [
                'content' => $validated['content'],
            ]);

            return redirect()
                ->back()
                ->with('success', 'Komentar berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal memperbarui komentar.');
        }
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        try {
            $this->commentService->delete($comment);

            return redirect()
                ->back()
                ->with('success', 'Komentar berhasil dihapus.');
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Gagal menghapus komentar.');
        }
    }
}
