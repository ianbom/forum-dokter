<?php

namespace App\Actions\Comments;

use App\Models\Comment;
use Illuminate\Support\Facades\DB;

class UpdateCommentAction
{
    public function handle(Comment $comment, array $data): Comment
    {
        return DB::transaction(function () use ($comment, $data) {
            $comment->update([
                'content' => $data['content'],
            ]);

            return $comment->fresh(['user']);
        });
    }
}
