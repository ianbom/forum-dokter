<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'post_id'   => ['required', 'exists:posts,id'],
            'parent_id' => ['nullable', 'exists:comments,id'],
            'content'   => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'post_id.required' => 'Post wajib ditentukan.',
            'post_id.exists'   => 'Post tidak ditemukan.',
            'parent_id.exists' => 'Komentar induk tidak ditemukan.',
            'content.required' => 'Komentar wajib diisi.',
        ];
    }
}
