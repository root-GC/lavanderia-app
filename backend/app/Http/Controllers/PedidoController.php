<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Notifications\FacturaProntaNotification;
use Illuminate\Support\Facades\Storage;




class PedidoController extends Controller
{
/**public function store(Request $request)
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
    */

public function index(Request $request)
{
     Log::info('REQUEST RECEBIDA:', $request->all());

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
//    $pedidos->transform(function ($pedido) {
//         if (is_string($pedido->servicos_adicionais)) {
//             $pedido->servicos_adicionais = json_decode($pedido->servicos_adicionais, true);
//         }
//         return $pedido;
//     });

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
   // $pedidos->transform(function ($pedido) {
   //     $pedido->servicos_adicionais = json_decode($pedido->servicos_adicionais ?? '[]', true);
    //    return $pedido;
    //});

    $pedidos->transform(function ($pedido) {
        $pedido->servicos_adicionais = $pedido->servicos_adicionais ?? [];
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



  // Recebe o pedido cru do frontend
   /* public function store(Request $request)
    {
        Log::info('📦 Dados recebidos no PedidoController:', $request->all());

        $request->validate([
            'imagem' => 'required|string',
            'tipo' => 'required|in:normal,delicada,seco',
            'servicos_adicionais' => 'nullable|array',
        ]);

        $pedido = Pedido::create([
            'user_id' => Auth::id() ?? $request->user_id,
            'imagem' => $request->imagem,
            'tipo' => $request->tipo,
            'servicos_adicionais' => $request->servicos_adicionais ?? [],
            'estado' => 'Aguardando Avaliação'
        ]);

        return response()->json(['success' => true, 'pedido' => $pedido], 201);
    }*/


    public function store(Request $request)
    {
        // Log dos dados recebidos
       

        // Validação
        $request->validate([
             'imagem' => 'required|file|image', // máximo 5MB
            'tipo' => 'required|in:normal,delicada,seco',
            'servicos_adicionais' => 'nullable|array',
        ]);
        Log::info('📦 Dados recebidos no PedidoController:', $request->all());
        // Guarda a imagem na pasta 'pedidos' dentro de storage/app/public
        //$path = $request->file('imagem')->store('pedidos', 'public');

        if ($request->hasFile('imagem')) {
            $path = $request->file('imagem')->store('pedidos', 'public');
             Log::info('📦 Request tem imagem:', $request->all());
        } else {
             Log::info('📦 Request nao tem:', $request->all());
            return response()->json(['error' => 'Imagem inválida'], 422);
        }

        Log::info('📦 Dados processados no PedidoController:', $request->all());
        // Criação do pedido
        $pedido = Pedido::create([
            'user_id' => Auth::id() ?? $request->user_id,
            'imagem' => $path, // guarda apenas o caminho
            'tipo' => $request->tipo,
            'servicos_adicionais' => $request->servicos_adicionais ?? [],
            'estado' => 'Aguardando Avaliação',
        ]);

        // Retorna resposta JSON
        return response()->json([
            'success' => true,
            'pedido' => $pedido,
            'imagem_url' => asset('storage/' . $path) // URL completa para exibir na view
        ], 201);
    }

    // Lista pedidos (filtrar por user_id ou admin)
    // public function index(Request $request)
    // {
    //     $query = Pedido::query();
    //     if ($request->has('user_id')) {
    //         $query->where('user_id', $request->query('user_id'));
    //     }
    //     if ($request->has('estado') && $request->estado != '') {
    //         $query->where('estado', $request->estado);
    //     }
    //     $pedidos = $query->get();
    //     return response()->json(['pedidos' => $pedidos]);
    // }

    // Rota admin: avaliar pedido -> inserir peso, calcular preços, notificar user
    public function avaliar(Request $request, $id)
    {
        $pedido = Pedido::findOrFail($id);

        $request->validate([
            'peso' => 'required|numeric|min:0.1',
            'preco_kg' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'iva' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        $pedido->update([
            'peso' => $request->peso,
            'subtotal' => $request->subtotal,
            'iva' => $request->iva,
            'total' => $request->total,
            'estado' => 'Aguardando Confirmação'
        ]);

        return response()->json(['success' => true, 'pedido' => $pedido]);
    }

    // Cliente aceita ou recusa a factura
    public function responderFactura(Request $request, $id)
    {
        $request->validate(['acao' => 'required|in:aceitar,recusar']);

        $pedido = Pedido::findOrFail($id);

        if ($request->acao === 'aceitar') {
            $pedido->estado = 'Confirmado';
            $pedido->save();
            // aqui poderias iniciar workflow (ex.: preparar, enviar para produção)
            return response()->json(['success' => true, 'message' => 'Pedido confirmado.']);
        } else {
            $pedido->estado = 'Recusado';
            $pedido->save();
            return response()->json(['success' => true, 'message' => 'Pedido recusado.']);
        }
    }

    // Formulário admin para avaliar pedido
    public function formAvaliar($id)
    {
        $pedido = Pedido::findOrFail($id);
        return view('admin.pedidos.avaliar', compact('pedido'));
    }
}