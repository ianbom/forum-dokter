<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'content'         => $this->content,
            'views'           => $this->views,
            'is_hidden'       => $this->is_hidden,
            'created_at'      => $this->created_at->toISOString(),
            'updated_at'      => $this->updated_at->toISOString(),
            'comments_count'  => $this->whenCounted('comments'),
            'user'            => [
                'id'            => $this->user?->id,
                'name'          => $this->user?->name,
                'profile_photo' => $this->user?->profile_photo,
            ],
            'categories'      => $this->whenLoaded('categories', fn () =>
                $this->categories->map(fn ($c) => [
                    'id'   => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                ])->values()
            ),
        ];
    }
}
