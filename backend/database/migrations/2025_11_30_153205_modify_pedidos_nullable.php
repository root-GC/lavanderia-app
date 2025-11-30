<?php

// database/migrations/2025_11_29_modify_pedidos_nullable.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyPedidosNullable extends Migration
{
    public function up()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->float('peso')->nullable()->change();
            $table->float('subtotal')->nullable()->change();
            $table->float('iva')->nullable()->change();
            $table->float('total')->nullable()->change();
            $table->string('estado')->default('Aguardando Avaliação')->change();
        });
    }

    public function down()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->float('peso')->nullable(false)->change();
            $table->float('subtotal')->nullable(false)->change();
            $table->float('iva')->nullable(false)->change();
            $table->float('total')->nullable(false)->change();
            $table->string('estado')->default('Pendente')->change();
        });
    }
}