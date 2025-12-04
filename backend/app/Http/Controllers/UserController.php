<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::all();

        return response()->json($user,200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        'telefone' => 'nullable|string|max:9', // novo campo
        'endereco' => 'nullable|string|max:255', // novo campo
    ],);

    

    // Cria o utilizador
    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
        'telefone' => $validated['telefone'] ?? null,
        'endereco' => $validated['endereco'] ?? null,
    ]);

    return response()->json([
        'message' => 'User created successfully',
        'user' => $user
    ], 201);
}

    /**
     * Display the specified resource.
     */
   public function show(Request $request)
    {
        return response()->json(Auth::user());
    }

/**
 * Update the specified resource in storage.
 */
public function update(Request $request)
{
    Log::info('Dados recebidos para update:', $request->all());

    $user = Auth::user();

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'telefone' => 'nullable|string|max:9',
        'endereco' => 'nullable|string|max:255',
    ]);

    //$user->update($validated);

    Log::info('Antes do update', ['user' => $user->toArray()]);
    $user->update($validated);
    Log::info('Depois do update', ['user' => $user->toArray()]);

    return response()->json([
        'message' => 'Dados atualizados com sucesso!',
        'user' => $user
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getNome($id): JsonResponse
{
    // Tenta buscar o utilizador pelo ID
    $user = User::find($id);

    if ($user) {
        // Retorna o nome em JSON
        return response()->json(['nome' => $user->name]);
    }

    // Se não existir, retorna um default
    return response()->json(['nome' => 'Desconhecido'], 404);
}
}
