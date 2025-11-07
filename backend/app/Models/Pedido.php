<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';
    use HasFactory;

    protected $fillable = [
        'user_id', 'imagem', 'tipo', 'secagem', 'passagem', 'perfumaria',
        'peso', 'subtotal', 'iva', 'total', 'estado'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}