<?php

namespace App\Services;

use App\Actions\Comments\StoreCommentAction;
use App\Models\Comment;

class CommentService
{
    public function __construct(
        private StoreCommentAction $storeCommentAction,
    ) {}

    public function store(array $data): Comment
    {
        return $this->storeCommentAction->handle($data);
    }
}
