<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that are dates.
     *
     * @var array
     */
    protected $dates = [
        'email_verified_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Return the user's addresses
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function addresses(): BelongsToMany
    {
        return $this->belongsToMany(Address::class, 'user_addresses', 'user_id', 'address_id')
            ->withTimestamps();
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Return the user's roles
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')
            ->withTimestamps();
    }

    /**
     * Return the user's addresses
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function stores(): BelongsToMany
    {
        return $this->belongsToMany(Store::class, 'store_users', 'user_id', 'store_id')
            ->withTimestamps();
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function accessToken()
    {
        return $this->hasMany(AccessToken::class);
    }

    /**
     * Scope a query to filter available author users.
     */
    public function scopeSiteAdmin(Builder $query): Builder
    {
        return $query->whereHas('roles', function ($query) {
            $query->name(Role::ROLE_ADMIN)
                  ->roleScope(RoleScope::ROLE_SCOPE_SITE);
        });
    }

    /**
     * Scope a query by email.
     *
     * @param string $email The email to which you would like to scope.
     */
    public function scopeEmail(Builder $query, $email): Builder
    {
        return $query->where('email', $email);
    }

    /**
     * Whether a user is a site admin.
     */
    public function isSiteAdmin(): bool
    {
        return $this->roles()->siteAdmin()->get()->isNotEmpty();
    }

    /**
     * Whether the authenticated user has authorization to modify the user.
     */
    public function userHasAuth(): bool
    {
        return Auth::check() && (
            Auth::user()->isSiteAdmin()
            || $this->id === Auth::user()->id
        );
    }
}
