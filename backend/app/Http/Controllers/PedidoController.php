<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use Illuminate\Support\Facades\Auth;

class PedidoController extends Controller
{
   public function store(Request $request)
{
    $request->validate([
        'imagem' => 'required|string',
        'tipo' => 'required|in:normal,delicada,expressa',
        'servicos_adicionais' => 'nullable|array',
        'peso' => 'required|numeric|min:0.1',
        'subtotal' => 'required|numeric',
        'iva' => 'required|numeric',
        'total' => 'required|numeric',
        'estado' => 'required|string'
    ]);

    $pedido = Pedido::create([
        'user_id' => Auth::id() ?? $request->user_id, // usa o id autenticado ou o enviado
        'imagem' => $request->imagem,
        'tipo' => $request->tipo,
        'servicos_adicionais' => json_encode($request->servicos_adicionais ?? []),
        'peso' => (float)$request->peso,
        'subtotal' => (float)$request->subtotal,
        'iva' => (float)$request->iva,
        'total' => (float)$request->total,
        'estado' => $request->estado,
    ]);

    return response()->json([
        'success' => true,
        'pedido' => $pedido
    ]);
}
}