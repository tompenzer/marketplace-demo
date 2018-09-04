<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Country extends Model
{
    use SoftDeletes;

    /**
     * The table for the model.
     *
     * @var array
     */
    protected $table = 'countries';

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
}
