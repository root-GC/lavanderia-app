<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PedidoController;
use Barryvdh\DomPDF\Facade\Pdf;

//Route::get('/admin/pedidos', [PedidoController::class, 'listaWeb']);
Route::get('/admin/pedidos/{id}/concluir', [PedidoController::class, 'concluirPedido']);
Route::get('/admin/pedidos/{id}/delete', [PedidoController::class, 'destroy']);

Route::get('/', function () {
    return redirect('/admin/pedidos');
});


// Lista pedidos
Route::get('/admin/pedidos', [PedidoController::class, 'listaWeb'])->name('admin.pedidos');

// Formulário de avaliação/factura
Route::get('/admin/pedidos/{id}/avaliar', [PedidoController::class, 'formAvaliar'])->name('pedidos.avaliar');

// Recebe avaliação/factura
Route::post('/admin/pedidos/{id}/avaliar', [PedidoController::class, 'avaliar'])->name('pedidos.avaliar.submit');

Route::get('/admin/pedidos/{id}/factura', [PedidoController::class, 'verFactura'])->name('pedidos.factura');

Route::post('/admin/pedidos/{id}/atualizar-estado', [PedidoController::class, 'atualizarEstado']);


Route::get('/pedidos/exportar', [PedidoController::class, 'exportar']);

Route::get('/testar-pdf', function () {
    return Pdf::loadHTML('<h1>PDF OK</h1>')->download('teste.pdf');
});