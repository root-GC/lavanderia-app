<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Pedido;

class FacturaProntaNotification extends Notification
{
    use Queueable;

    protected $pedido;

    public function __construct(Pedido $pedido)
    {
        $this->pedido = $pedido;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $pedido = $this->pedido;
        $url = config('app.frontend_url') . "/pedido/{$pedido->id}"; // front-end route to view invoice
        return (new MailMessage)
                    ->subject('Factura pronta: Pedido #' . $pedido->id)
                    ->greeting('Olá!')
                    ->line('A sua factura está pronta. Por favor verifique os detalhes e aceite ou recuse.')
                    ->line('Total: ' . number_format($pedido->total, 2) . ' MT')
                    ->action('Ver Factura', $url)
                    ->line('Obrigado por usar o nosso serviço.');
    }

    public function toArray($notifiable)
    {
        return [
            'pedido_id' => $this->pedido->id,
            'total' => $this->pedido->total,
            'tipo' => $this->pedido->tipo,
        ];
    }
}