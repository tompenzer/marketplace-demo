<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitialStructure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('recipient');
            $table->string('street_1');
            $table->string('street_2')->nullable();
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('postal_code');
            $table->integer('country_id')->unsigned();
            $table->string('phone');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('countries', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('abbreviation');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('currencies', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('abbreviation');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('order_id')->unsigned();
            $table->integer('product_id')->unsigned();
            $table->float('price', 10, 2);
            $table->integer('currency_id')->unsigned();
            $table->integer('quantity')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('address_id')->unsigned();
            $table->float('subtotal', 10, 2);
            $table->float('shipping', 10, 2);
            $table->float('taxes', 10, 2);
            $table->float('total', 10, 2);
            $table->integer('currency_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('store_id')->unsigned();
            $table->string('name');
            $table->string('description');
            $table->float('width', 10, 2);
            $table->integer('width_unit_id')->unsigned();
            $table->float('length', 10, 2);
            $table->integer('length_unit_id')->unsigned();
            $table->float('height', 10, 2);
            $table->integer('height_unit_id')->unsigned();
            $table->float('weight', 10, 2);
            $table->integer('weight_unit_id')->unsigned();
            $table->float('price', 10, 2);
            $table->integer('currency_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('role_scopes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('role_scope_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('store_addresses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('store_id')->unsigned();
            $table->integer('address_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('store_users', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('store_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('role_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('stores', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('unit_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('units', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('abbreviation');
            $table->integer('unit_type_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('user_addresses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('address_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('role_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('currencies');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('products');
        Schema::dropIfExists('role_scopes');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('store_addresses');
        Schema::dropIfExists('store_users');
        Schema::dropIfExists('stores');
        Schema::dropIfExists('unit_types');
        Schema::dropIfExists('units');
        Schema::dropIfExists('user_addresses');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('users');
    }
}
