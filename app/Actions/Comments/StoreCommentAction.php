<?php

namespace App\Actions\Comments;

use App\Models\Comment;
use Illuminate\Support\Facades\DB;

class StoreCommentAction
{
    public function handle(array $data): Comment
    {
        return DB::transaction(function () use ($data) {
            $comment = Comment::create([
                'post_id'   => $data['post_id'],
                'user_id'   => $data['user_id'],
                'parent_id' => $data['parent_id'] ?? null,
                'content'   => $data['content'],
            ]);

            return $comment->load('user');
        });
    }
}
