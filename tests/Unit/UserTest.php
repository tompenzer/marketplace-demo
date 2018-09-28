<?php

namespace Tests\Unit;

use App\Models\Role;
use App\Models\RoleScope;
use App\Models\User;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function testUserIsSiteAdmin()
    {
        $user = factory(User::class)->create();
        $user->roles()->attach(
            Role::name(Role::ROLE_ADMIN)
                ->roleScope(RoleScope::ROLE_SCOPE_SITE)
                ->first()->id
        );

        $this->assertTrue($user->isSiteAdmin());
    }

    public function testUserIsNotSiteAdmin()
    {
        $user = factory(User::class)->create();
        $user->roles()->attach(
            Role::name(Role::ROLE_ADMIN)
                ->roleScope(RoleScope::ROLE_SCOPE_STORE)
                ->first()->id
        );

        $this->assertFalse($user->isSiteAdmin());
    }

    public function testScopeSiteAdmin()
    {
        $user = factory(User::class)->create();
        $user->roles()->attach(
            Role::name(Role::ROLE_ADMIN)
                ->roleScope(RoleScope::ROLE_SCOPE_SITE)
                ->first()->id
        );

        $this->assertTrue(User::siteAdmin()->find($user->id)->count() > 0);
    }

    public function testScopeEmail()
    {
        $faker = Factory::create();

        $email = $faker->safeEmail;

        $this->assertTrue(User::email($email)->count() === 0);

        $user = factory(User::class)->create(['email' => $email]);

        $this->assertTrue(User::email($email)->find($user->id)->count() > 0);
    }
}
