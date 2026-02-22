<?php

namespace App\Actions\Posts;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UpdatePostAction
{
    public function handle(Post $post, array $data): Post
    {
        return DB::transaction(function () use ($post, $data) {
            $post->update([
                'title'   => $data['title'],
                'content' => $data['content'],
            ]);

            $categoryIds = $this->resolveCategories($data['categories']);
            $post->categories()->sync($categoryIds);

            return $post->fresh(['user', 'categories', 'attachments']);
        });
    }

    private function resolveCategories(array $names): array
    {
        $ids = [];

        foreach ($names as $name) {
            $name = strtolower(trim($name));
            if (empty($name)) {
                continue;
            }

            $category = Category::firstOrCreate(
                ['name' => $name],
                ['slug' => Str::slug($name)],
            );

            $ids[] = $category->id;
        }

        return array_unique($ids);
    }
}
