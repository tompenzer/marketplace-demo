<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Unit extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'abbreviation',
    ];

    /**
     * Return the user's roles
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(UnitType::class, 'unit_type_id', 'id');
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
     * Scope a query to search.
     */
    public function scopeSearch(Builder $query, ?string $search)
    {
        if ($search) {
            return $query->where('name', 'LIKE', "%{$search}%")
                ->orWhere('abbreviation', 'LIKE', "%{$search}%");
        }

        return $query;
    }

    /**
     * Scope a query by unit type.
     *
     * @param string $type The unit type to which you would like to scope.
     */
    public function scopeType(Builder $query, $type): Builder
    {
        return $query->whereHas('type', function ($query) use ($type) {
            $query->where('unit_types.name', $type);
        });
    }
}
