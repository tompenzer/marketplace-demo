<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Currency extends Model
{
    use SoftDeletes;

    /**
     * The table for the model.
     *
     * @var array
     */
    protected $table = 'currencies';

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

    /**
     * Scope a query to a currency ISO code (i.e. 'USD' for US Dollar).
     */
    public function scopeCode(Builder $query, ?string $abbreviation)
    {
        if ($abbreviation) {
            return $query->where('abbreviation', $abbreviation);
        }

        return $query;
    }
}
