<?php

namespace App\Actions\Posts;

use App\Models\Post;
use App\Models\PostAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StorePostAction
{
    public function handle(array $data, array $files = []): Post
    {
        return DB::transaction(function () use ($data, $files) {
            $post = Post::create([
                'user_id'     => $data['user_id'],
                'category_id' => $data['category_id'],
                'title'       => $data['title'],
                'content'     => $data['content'],
            ]);

            if (!empty($files)) {
                $this->storeAttachments($post, $files);
            }

            return $post->load('attachments');
        });
    }

    private function storeAttachments(Post $post, array $files): void
    {
        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            $originalName = $file->getClientOriginalName();
            $extension    = $file->getClientOriginalExtension();
            $fileName     = Str::slug(pathinfo($originalName, PATHINFO_FILENAME))
                            . '_' . Str::random(8)
                            . '.' . $extension;

            $path = $file->storeAs(
                'post-attachments/' . $post->id,
                $fileName,
                'public'
            );

            $post->attachments()->create([
                'file_name'  => $originalName,
                'file_path'  => $path,
                'file_type'  => $this->resolveFileType($extension),
                'file_size'  => $file->getSize(),
                'created_at' => now(),
            ]);
        }
    }

    private function resolveFileType(string $extension): string
    {
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        $docExtensions   = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

        if (in_array(strtolower($extension), $imageExtensions)) {
            return 'image';
        }

        if (strtolower($extension) === 'pdf') {
            return 'pdf';
        }

        if (in_array(strtolower($extension), $docExtensions)) {
            return 'doc';
        }

        return 'other';
    }
}
