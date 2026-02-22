<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'categories'   => ['required', 'array', 'min:1'],
            'categories.*' => ['required', 'string', 'max:50'],
            'title'        => ['required', 'string', 'max:255'],
            'content'      => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'categories.required'   => 'Minimal satu kategori wajib diisi.',
            'categories.min'        => 'Minimal satu kategori wajib diisi.',
            'categories.*.required' => 'Nama kategori tidak boleh kosong.',
            'categories.*.max'      => 'Nama kategori maksimal 50 karakter.',
            'title.required'        => 'Judul diskusi wajib diisi.',
            'title.max'             => 'Judul diskusi maksimal 255 karakter.',
            'content.required'      => 'Konten diskusi wajib diisi.',
        ];
    }
}
