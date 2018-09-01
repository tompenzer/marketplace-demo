<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitType extends Model
{
    const UNIT_TYPE_DIMENSION = 'dimension';
    const UNIT_TYPE_WEIGHT = 'weight';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];
}
