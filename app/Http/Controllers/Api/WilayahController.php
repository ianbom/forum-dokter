<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WilayahController extends Controller
{
    public function provinces(): JsonResponse
    {
        $provinces = DB::table('provinces')
            ->select(['id', 'code', 'name'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $provinces,
        ]);
    }

    public function cities(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'province_id' => ['required', 'integer', 'exists:provinces,id'],
        ]);

        $cities = DB::table('cities')
            ->select(['id', 'province_id', 'code', 'name', 'type'])
            ->where('province_id', (int) $validated['province_id'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $cities,
        ]);
    }
}
