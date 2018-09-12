<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Store extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Return the user's addresses
     */
    public function addresses(): BelongsToMany
    {
        return $this->belongsToMany(Address::class, 'store_addresses', 'store_id', 'address_id')
            ->withTimestamps();
    }

    /**
     * Return the user's products
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class)
            ->with(
                'currency',
                'widthUnit',
                'heightUnit',
                'lengthUnit',
                'weightUnit'
            );// Always send these relations with the product.
    }

    /**
     * Return the user's addresses
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'store_users', 'store_id', 'user_id')
            ->withTimestamps();
    }

    /**
     * Scope a query to search products
     */
    public function scopeSearch(Builder $query, ?string $search)
    {
        if ($search) {
            return $query->where('name', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%");
        }

        return $query;
    }

    /**
     * Scope a query by user.
     *
     * @param string $user_id The user to which you would like to scope.
     */
    public function scopeUser(Builder $query, $user_id): Builder
    {
        return $query->whereHas('users', function ($query) use ($user_id) {
            $query->where('store_users.user_id', $user_id);
        });
    }

    /**
     * Whether the authenticated user has authorization to modify the store.
     */
    public function userHasAuth(): bool
    {
        return Auth::check() && (
            Auth::user()->isSiteAdmin()
            || $this->hasUser(Auth::user()->id)
        );
    }

    /**
     * Whether the user has authorization to modify the store.
     *
     * @param string $user_id The user to which you would like to scope.
     */
    public function hasUser($user_id): bool
    {
        return $this->users()->where('users.id', $user_id)->count() > 0;
    }
}
