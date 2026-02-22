<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'categories'    => ['required', 'array', 'min:1'],
            'categories.*'  => ['required', 'string', 'max:50'],
            'title'         => ['required', 'string', 'max:255'],
            'content'       => ['required', 'string'],
            'attachments'   => ['nullable', 'array', 'max:10'],
            'attachments.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx'],
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
            'attachments.max'       => 'Maksimal 10 file lampiran.',
            'attachments.*.max'     => 'Ukuran file maksimal 10MB.',
            'attachments.*.mimes'   => 'Format file tidak didukung.',
        ];
    }
}
