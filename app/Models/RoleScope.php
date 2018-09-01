<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleScope extends Model
{
    const ROLE_SCOPE_SITE = 'marketplace';
    const ROLE_SCOPE_STORE = 'store';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];
}
