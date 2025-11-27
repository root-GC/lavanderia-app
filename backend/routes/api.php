<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PedidoController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/users', [UserController::class,'index']);
Route::post('/users', [UserController::class, 'store']);

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->post('/update', [UserController::class, 'update']);
//Route::post('/update', [UserController::class, 'update']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pedidos', [PedidoController::class, 'store']);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->get('/pedidos', [PedidoController::class, 'index']);

Route::middleware('auth:sanctum')->delete('/pedidos/{id}', [PedidoController::class, 'destroy']);


