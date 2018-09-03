<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Role extends Model
{
    use SoftDeletes;

    const ROLE_ADMIN = 'admin';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * Return the user's roles
     */
    public function roleScopes(): BelongsTo
    {
        return $this->belongsTo(RoleScope::class, 'role_scope_id', 'id');
    }

    /**
     * Scope a query by name.
     *
     * @param string $name The name to which you would like to scope.
     */
    public function scopeName(Builder $query, $name): Builder
    {
        return $query->where('name', $name);
    }

    /**
     * Scope a query to filter available author users.
     */
    public function scopeSiteAdmin(Builder $query): Builder
    {
        return $query->name(Role::ROLE_ADMIN)
                  ->roleScope(RoleScope::ROLE_SCOPE_SITE);
    }


    /**
     * Scope a query by role scope.
     *
     * @param string $scope The role scope to which you would like to scope.
     */
    public function scopeRoleScope(Builder $query, $scope): Builder
    {
        return $query->whereHas('roleScopes', function ($query) use ($scope) {
            $query->where('role_scopes.name', $scope);
        });
    }
}
