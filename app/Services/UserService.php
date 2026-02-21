<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function getPaginated(array $filters): LengthAwarePaginator
    {
        $query = User::withCount(['posts', 'comments']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        $sort = $filters['sort'] ?? 'latest';
        $query = match ($sort) {
            'oldest'       => $query->oldest(),
            'name_asc'     => $query->orderBy('name', 'asc'),
            'name_desc'    => $query->orderBy('name', 'desc'),
            'most_posts'   => $query->orderByDesc('posts_count'),
            default        => $query->latest(),
        };

        $perPage = (int) ($filters['per_page'] ?? 10);
        $perPage = min(max($perPage, 5), 50);

        return $query->paginate($perPage)->withQueryString();
    }

    public function getCounts(): array
    {
        return [
            'total' => User::count(),
            'admin' => User::where('role', 'admin')->count(),
            'user'  => User::where('role', 'user')->count(),
        ];
    }
}
