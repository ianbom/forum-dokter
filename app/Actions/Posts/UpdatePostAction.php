<?php

namespace App\Actions\Posts;

use App\Models\Post;
use Illuminate\Support\Facades\DB;

class UpdatePostAction
{
    public function handle(Post $post, array $data): Post
    {
        return DB::transaction(function () use ($post, $data) {
            $post->update([
                'category_id' => $data['category_id'],
                'title'       => $data['title'],
                'content'     => $data['content'],
            ]);

            return $post->fresh(['user', 'category', 'attachments']);
        });
    }
}
