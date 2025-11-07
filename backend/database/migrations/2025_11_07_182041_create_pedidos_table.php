<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // FK para users
            $table->string('imagem'); // link da imagem
            $table->enum('tipo', ['normal', 'delicada', 'expressa']); 
            $table->float('peso');
            $table->float('subtotal');
            $table->float('iva');
            $table->float('total');
            $table->enum('estado', ['pendente', 'aceite', 'recusado'])->default('pendente'); // controlar estado do pedido
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('pedidos');
    }
};