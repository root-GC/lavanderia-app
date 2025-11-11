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
    $query = Pedido::query();

    // Filtro por user_id (obrigatório)
    if ($request->has('user_id')) {
        $query->where('user_id', $request->query('user_id'));
    }

    // Filtro por tipo
    if ($request->has('tipo') && $request->tipo != '') {
        $query->where('tipo', $request->tipo);
    }

    // Filtro por estado - CORRIGIDO
    if ($request->has('estado') && $request->estado != '') {
        $query->where('estado', $request->estado);
    }

    // Filtro por serviços adicionais
    if ($request->has('servico') && $request->servico != '') {
        $query->whereJsonContains('servicos_adicionais', $request->servico);
    }

    $pedidos = $query->get();

    // Processar serviços adicionais
    $pedidos->transform(function ($pedido) {
        $pedido->servicos_adicionais = json_decode($pedido->servicos_adicionais ?? '[]', true);
        return $pedido;
    });

    return response()->json(['pedidos' => $pedidos]);
}

// Lista todos os pedidos em uma página web com filtros
public function listaWeb(Request $request)
{
    $query = Pedido::query();

    if ($request->has('tipo') && $request->tipo != '') {
        $query->where('tipo', $request->tipo);
    }

    if ($request->has('estado') && $request->estado != '') {
        $query->where('estado', $request->estado);
    }

    if ($request->has('servico') && $request->servico != '') {
        $query->whereJsonContains('servicos_adicionais', $request->servico);
    }

    $pedidos = $query->get();

    // Processar serviços adicionais
    $pedidos->transform(function ($pedido) {
        $pedido->servicos_adicionais = json_decode($pedido->servicos_adicionais ?? '[]', true);
        return $pedido;
    });

    return view('admin.pedidos', compact('pedidos'));
}

// Marca o pedido como concluído
// E na função para concluir pedido:
public function concluirPedido($id)
{
    $pedido = Pedido::findOrFail($id);
    $pedido->estado = 'Concluído'; // ← IMPORTANTE: Com acento
    $pedido->save();

    return redirect('/admin/pedidos')->with('success', 'Pedido #' . $id . ' marcado como concluído!');
}

public function destroy($id)
{
    $pedido = Pedido::findOrFail($id);
    $pedido->delete();

    return redirect('/admin/pedidos')
        ->with('success', 'Pedido #' . $id . ' eliminado com sucesso!');
}
}