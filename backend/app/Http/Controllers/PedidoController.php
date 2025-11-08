<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PedidoController extends Controller
{
   public function store(Request $request)
{

        // Loga tudo o que chega do frontend (para debug)
    Log::info('📦 Dados recebidos no PedidoController:', $request->all());
    //dd($request->all());
    $request->validate([
        'imagem' => 'required|string',
        'tipo' => 'required|in:normal,delicada,seco',
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
public function index(Request $request)
{
    $user_id = $request->query('user_id');
    $pedidos = Pedido::where('user_id', $user_id)->get();
    
    // Converte JSON em array antes de enviar
    $pedidos->transform(function ($pedido) {
        $pedido->servicos_adicionais = json_decode($pedido->servicos_adicionais ?? '[]', true);
        return $pedido; // <-- super importante
    });

    return response()->json(['pedidos' => $pedidos]);
}

public function destroy($id)
{
    $pedido = Pedido::findOrFail($id);
    $pedido->delete();
    return response()->json(['success' => true]);
}
}