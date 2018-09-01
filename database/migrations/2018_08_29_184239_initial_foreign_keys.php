<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitialForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('RESTRICT');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('RESTRICT');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('RESTRICT');
            $table->foreign('currency_id')->references('id')->on('currencies')->onDelete('RESTRICT');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('RESTRICT');
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('RESTRICT');
            $table->foreign('currency_id')->references('id')->on('currencies')->onDelete('RESTRICT');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('CASCADE');
            $table->foreign('width_unit_id')->references('id')->on('units')->onDelete('RESTRICT');
            $table->foreign('length_unit_id')->references('id')->on('units')->onDelete('RESTRICT');
            $table->foreign('height_unit_id')->references('id')->on('units')->onDelete('RESTRICT');
            $table->foreign('weight_unit_id')->references('id')->on('units')->onDelete('RESTRICT');
            $table->foreign('currency_id')->references('id')->on('currencies')->onDelete('RESTRICT');
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->foreign('role_scope_id')->references('id')->on('role_scopes')->onDelete('RESTRICT');
        });

        Schema::table('store_addresses', function (Blueprint $table) {
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('CASCADE');
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('RESTRICT');
        });

        Schema::table('store_users', function (Blueprint $table) {
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('CASCADE');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('CASCADE');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('RESTRICT');
        });

        Schema::table('units', function (Blueprint $table) {
            $table->foreign('unit_type_id')->references('id')->on('unit_types')->onDelete('RESTRICT');
        });

        Schema::table('user_addresses', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('CASCADE');
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign(['country_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign([
                'order_id',
                'product_id',
                'currency_id',
            ]);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign([
                'user_id',
                'address_id',
                'currency_id',
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign([
                'store_id',
                'width_unit_id',
                'length_unit_id',
                'height_unit_id',
                'weight_unit_id',
                'currency_id'
            ]);
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign(['role_scope_id']);
        });

        Schema::table('store_addresses', function (Blueprint $table) {
            $table->dropForeign([
                'store_id',
                'address_id',
            ]);
        });

        Schema::table('store_users', function (Blueprint $table) {
            $table->dropForeign([
                'store_id',
                'user_id',
                'role_id',
            ]);
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropForeign(['unit_type_id']);
        });

        Schema::table('user_addresses', function (Blueprint $table) {
            $table->dropForeign([
                'user_id',
                'address_id',
            ]);
        });
    }
}
