<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'specialization' => $this->specialization,
            'bio'            => $this->bio,
            'role'           => $this->role,
            'profile_photo'  => $this->profile_photo,
            'posts_count'    => $this->whenCounted('posts'),
            'comments_count' => $this->whenCounted('comments'),
            'created_at'     => $this->created_at->toISOString(),
        ];
    }
}
