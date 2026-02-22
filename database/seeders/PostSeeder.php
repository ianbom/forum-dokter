<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Ensure we have users
        if (User::count() === 0) {
            User::factory(5)->create();
        }
        $users = User::pluck('id');

        // Ensure we have at least 10 categories to pick from
        if (Category::count() < 10) {
            for ($i = 0; $i < 10; $i++) {
                $name = $faker->unique()->word . ' ' . $faker->word;
                Category::firstOrCreate([
                    'slug' => Str::slug($name),
                ], [
                    'name' => ucwords($name),
                ]);
            }
        }
        $categories = Category::pluck('id');

        // Create 20 posts
        for ($i = 0; $i < 20; $i++) {
            $post = Post::create([
                'user_id'   => $users->random(),
                'title'     => rtrim($faker->sentence(mt_rand(5, 10)), '.'),
                'content'   => '<p>' . implode('</p><p>', $faker->paragraphs(mt_rand(3, 7))) . '</p>',
                'views'     => $faker->numberBetween(50, 6000),
                'is_hidden' => false,
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
            ]);

            // Attach 5 random categories to the post
            $post->categories()->attach($categories->random(5));

            // Create 50 comments for this post
            for ($j = 0; $j < 50; $j++) {
                Comment::create([
                    'post_id'    => $post->id,
                    'user_id'    => $users->random(),
                    'parent_id'  => null,
                    'content'    => $faker->paragraph(mt_rand(1, 3)),
                    'created_at' => $faker->dateTimeBetween($post->created_at, 'now'),
                ]);
            }
        }
    }
}
