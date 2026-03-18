<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use RuntimeException;

class ProvinceCitySeeder extends Seeder
{
    public function run(): void
    {
        $sqlPath = public_path('wilayah.sql');

        if (! File::exists($sqlPath)) {
            throw new RuntimeException("File wilayah.sql tidak ditemukan di: {$sqlPath}");
        }

        $sql = File::get($sqlPath);

        $provinceRows = $this->extractInsertRows($sql, 'provinces');
        $cityRows = $this->extractInsertRows($sql, 'cities');

        if (empty($provinceRows) || empty($cityRows)) {
            throw new RuntimeException('Data provinces/cities tidak ditemukan pada file wilayah.sql');
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('cities')->truncate();
        DB::table('provinces')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $provinces = [];

        foreach ($provinceRows as $fields) {
            if (count($fields) < 5) {
                continue;
            }

            $provinces[] = [
                'id' => (int) $fields[0],
                'code' => $this->nullable($fields[1]),
                'name' => $this->nullable($fields[2]),
                'created_at' => $this->nullable($fields[3]),
                'updated_at' => $this->nullable($fields[4]),
            ];
        }

        foreach (array_chunk($provinces, 500) as $chunk) {
            DB::table('provinces')->insert($chunk);
        }

        $cities = [];

        foreach ($cityRows as $fields) {
            if (count($fields) < 6) {
                continue;
            }

            $name = (string) $this->nullable($fields[2]);

            $cities[] = [
                'id' => (int) $fields[0],
                'code' => $this->nullable($fields[1]),
                'name' => $name,
                'province_id' => (int) $fields[3],
                'type' => $this->resolveCityType($name),
                'created_at' => $this->nullable($fields[4]),
                'updated_at' => $this->nullable($fields[5]),
            ];
        }

        foreach (array_chunk($cities, 500) as $chunk) {
            DB::table('cities')->insert($chunk);
        }
    }

    /**
     * @return array<int, array<int, string>>
     */
    private function extractInsertRows(string $sql, string $table): array
    {
        $pattern = '/INSERT\s+INTO\s+`' . preg_quote($table, '/') . '`\s*\((?:[^()]|\([^)]*\))*\)\s*VALUES\s*(.*?);/is';

        if (! preg_match($pattern, $sql, $matches)) {
            return [];
        }

        $rows = [];

        preg_match_all('/\((.*?)\)(?:,\s*|\s*$)/s', trim($matches[1]), $tupleMatches);

        foreach ($tupleMatches[1] as $tuple) {
            $rows[] = str_getcsv($tuple, ',', "'", '\\');
        }

        return $rows;
    }

    private function resolveCityType(string $name): string
    {
        $normalized = strtolower($name);

        if (str_starts_with($normalized, 'kabupaten')) {
            return 'kabupaten';
        }

        if (str_starts_with($normalized, 'kota')) {
            return 'kota';
        }

        return 'kota';
    }

    private function nullable(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);

        return strtoupper($trimmed) === 'NULL' ? null : $trimmed;
    }
}
