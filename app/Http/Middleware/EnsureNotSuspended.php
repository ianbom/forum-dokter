<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureNotSuspended
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->is_suspended) {
            $routeName = $request->route() ? $request->route()->getName() : '';
            
            if (!$request->isMethod('get') || str_ends_with($routeName, '.create') || str_ends_with($routeName, '.edit')) {
                if ($request->expectsJson()) {
                    return response()->json(['message' => 'Akun Anda sedang disuspend.'], 403);
                }

                return redirect()->route('posts.index')->with('error', 'Akun Anda sedang disuspend. Fitur ini tidak dapat digunakan.');
            }
        }

        return $next($request);
    }
}
