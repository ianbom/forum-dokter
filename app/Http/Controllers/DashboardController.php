<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalPosts = Post::count();
        $totalComments = Comment::count();
        $totalCategories = Category::count();

        $usersThisMonth = User::where('created_at', '>=', Carbon::now()->startOfMonth())->count();
        $postsThisMonth = Post::where('created_at', '>=', Carbon::now()->startOfMonth())->count();
        $commentsThisMonth = Comment::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        $recentPosts = Post::with(['user:id,name,profile_photo', 'categories:id,name,slug'])
            ->withCount('comments')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'views' => $post->views,
                'comments_count' => $post->comments_count,
                'is_hidden' => $post->is_hidden,
                'created_at' => $post->created_at->diffForHumans(),
                'user' => $post->user ? [
                    'name' => $post->user->name,
                    'profile_photo' => $post->user->profile_photo,
                ] : null,
                'categories' => $post->categories->map(fn ($cat) => [
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                ]),
            ]);

        $topCategories = Category::withCount('posts')
            ->orderByDesc('posts_count')
            ->take(5)
            ->get()
            ->map(fn ($cat) => [
                'name' => $cat->name,
                'slug' => $cat->slug,
                'posts_count' => $cat->posts_count,
            ]);

        $chartData = $this->getChartData();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalPosts' => $totalPosts,
                'totalComments' => $totalComments,
                'totalCategories' => $totalCategories,
                'usersThisMonth' => $usersThisMonth,
                'postsThisMonth' => $postsThisMonth,
                'commentsThisMonth' => $commentsThisMonth,
            ],
            'recentPosts' => $recentPosts,
            'topCategories' => $topCategories,
            'chartData' => $chartData,
        ]);
    }

    private function getChartData(): array
    {
        $startDate = Carbon::now()->subDays(89)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $usersRaw = User::where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        $postsRaw = Post::where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        $period = CarbonPeriod::create($startDate, $endDate);
        $data = [];

        foreach ($period as $date) {
            $key = $date->format('Y-m-d');
            $data[] = [
                'date' => $key,
                'users' => (int) ($usersRaw[$key] ?? 0),
                'posts' => (int) ($postsRaw[$key] ?? 0),
            ];
        }

        return $data;
    }
}
