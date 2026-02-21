<?php

namespace App\Actions\Comments;

use App\Models\Comment;
use Illuminate\Support\Facades\DB;

class DeleteCommentAction
{
    public function handle(Comment $comment): void
    {
        DB::transaction(function () use ($comment) {
            $comment->replies()->delete();
            $comment->delete();
        });
    }
}
