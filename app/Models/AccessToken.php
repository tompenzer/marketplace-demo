<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessToken extends Model
{
    /**
     * The table for the model.
     *
     * @var array
     */
    protected $table = "oauth_access_tokens";
}
