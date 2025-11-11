<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PedidoController;

Route::get('/admin/pedidos', [PedidoController::class, 'listaWeb']);
Route::get('/admin/pedidos/{id}/concluir', [PedidoController::class, 'concluirPedido']);
Route::get('/admin/pedidos/{id}/delete', [PedidoController::class, 'destroy']);

Route::get('/', function () {
    return redirect('/admin/pedidos');
});