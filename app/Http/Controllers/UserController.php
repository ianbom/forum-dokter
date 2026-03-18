<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'sort', 'per_page']);

        $users  = $this->userService->getPaginated($filters);
        $counts = $this->userService->getCounts();

        return Inertia::render('admin/users/index', [
            'users'   => UserResource::collection($users),
            'counts'  => $counts,
            'filters' => [
                'search'   => $filters['search'] ?? '',
                'role'     => $filters['role'] ?? '',
                'sort'     => $filters['sort'] ?? 'latest',
                'per_page' => (int) ($filters['per_page'] ?? 10),
            ],
        ]);
    }

    public function suspend(User $user): RedirectResponse
    {
        $this->userService->toggleSuspend($user);

        return redirect()->back()->with(
            'success',
            $user->is_suspended ? "Akun pengguna berhasil ditangguhkan." : "Penangguhan akun dibatalkan."
        );
    }
}
