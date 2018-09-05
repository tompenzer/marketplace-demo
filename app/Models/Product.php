<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use SoftDeletes;

    /**
     * The table for the model.
     *
     * @var array
     */
    protected $table = 'products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'store_id',
        'name',
        'description',
        'width',
        'width_unit_id',
        'length',
        'length_unit_id',
        'height',
        'height_unit_id',
        'weight',
        'weight_unit_id',
        'price',
        'currency_id',
    ];

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function widthUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'width_unit_id');
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function heightUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'height_unit_id');
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function lengthUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'length_unit_id');
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function weightUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'weight_unit_id');
    }

    /**
     * Scope a query by store.
     *
     * @param string $store_id The store to which you would like to scope.
     */
    public function scopeStore(Builder $query, $store_id): Builder
    {
        return $query->where('store_id', $store_id);
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
}
