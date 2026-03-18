<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $provinces = DB::table('provinces')
            ->select(['id', 'code', 'name'])
            ->orderBy('name')
            ->get();

        $dpdCity = $this->getCityWithProvince($user->dpd_city_id);
        $dpcCity = $this->getCityWithProvince($user->dpc_city_id);

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'provinces' => $provinces,
            'dpdCity' => $dpdCity,
            'dpcCity' => $dpcCity,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'specialization' => $validated['specialization'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'is_member' => (bool) ($validated['is_member'] ?? false),
            'dpd_city_id' => $validated['dpd_city_id'] ?? null,
            'dpc_city_id' => $validated['dpc_city_id'] ?? null,
            'kta' => $validated['kta'] ?? null,
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            $user->profile_photo = $path;
        }

        $user->save();

        return redirect()->back()->with('success', 'Profile berhasil diperbarui');
    }

    private function getCityWithProvince(?int $cityId): ?object
    {
        if (empty($cityId)) {
            return null;
        }

        return DB::table('cities')
            ->join('provinces', 'provinces.id', '=', 'cities.province_id')
            ->select([
                'cities.id',
                'cities.name',
                'cities.code',
                'cities.type',
                'cities.province_id',
                'provinces.name as province_name',
                'provinces.code as province_code',
            ])
            ->where('cities.id', $cityId)
            ->first();
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
