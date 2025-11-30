<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';

    protected $fillable = [
        'user_id',
        'imagem',
        'tipo',
        'servicos_adicionais', // array de serviços
        'peso',
        'subtotal',
        'iva',
        'total',
        'estado'
    ];

    protected $casts = [
        'servicos_adicionais' => 'array',
        'peso' => 'float',
        'subtotal' => 'float',
        'iva' => 'float',
        'total' => 'float',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}