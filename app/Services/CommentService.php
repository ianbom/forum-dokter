<?php

namespace App\Services;

use App\Actions\Comments\DeleteCommentAction;
use App\Actions\Comments\StoreCommentAction;
use App\Actions\Comments\UpdateCommentAction;
use App\Models\Comment;

class CommentService
{
    public function __construct(
        private StoreCommentAction $storeCommentAction,
        private UpdateCommentAction $updateCommentAction,
        private DeleteCommentAction $deleteCommentAction,
    ) {}

    public function store(array $data): Comment
    {
        return $this->storeCommentAction->handle($data);
    }

    public function update(Comment $comment, array $data): Comment
    {
        return $this->updateCommentAction->handle($comment, $data);
    }

    public function delete(Comment $comment): void
    {
        $this->deleteCommentAction->handle($comment);
    }
}
