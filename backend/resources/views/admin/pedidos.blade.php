<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestão de Pedidos</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-blue: #3498db;
            --light-blue: #ecf0f1;
            --very-light-blue: #f8fbfd;
            --border-blue: #bdc3c7;
            --text-dark: #2c3e50;
            --text-light: #7f8c8d;
            --success-green: #27ae60;
            --danger-red: #e74c3c;
            --warning-red: #e74c3c;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f8fbfd 0%, #ecf0f1 100%);
            min-height: 100vh;
            color: var(--text-dark);
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px 0;
        }

        h1 {
            font-size: 2.2rem;
            font-weight: 300;
            color: var(--primary-blue);
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .subtitle {
            color: var(--text-light);
            font-size: 1rem;
            font-weight: 400;
        }

        .stats-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid var(--border-blue);
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.08);
            transition: transform 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.12);
        }

        .stat-number {
            font-size: 2.2rem;
            font-weight: 300;
            color: var(--primary-blue);
            margin-bottom: 5px;
        }

        .stat-label {
            color: var(--text-light);
            font-size: 0.85rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border-blue);
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.08);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: var(--light-blue);
            border-bottom: 1px solid var(--border-blue);
        }

        th {
            padding: 18px 20px;
            text-align: left;
            color: var(--text-dark);
            font-weight: 500;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        th i {
            margin-right: 8px;
            color: var(--primary-blue);
        }

        tbody tr {
            border-bottom: 1px solid var(--light-blue);
            transition: background-color 0.2s ease;
        }

        tbody tr:hover {
            background-color: var(--very-light-blue);
        }

        tbody tr:last-child {
            border-bottom: none;
        }

        td {
            padding: 18px 20px;
            color: var(--text-dark);
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .status-pendente {
            background: rgba(231, 76, 60, 0.1);
            color: var(--warning-red);
            border: 1px solid rgba(231, 76, 60, 0.2);
        }

        .status-concluído {
            background: rgba(39, 174, 96, 0.1);
            color: var(--success-green);
            border: 1px solid rgba(39, 174, 96, 0.2);
        }

        .servicos-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .servico-tag {
            background: var(--light-blue);
            color: var(--primary-blue);
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.75rem;
            border: 1px solid var(--border-blue);
        }

        .actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border: none;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .btn-concluir {
            background: var(--success-green);
            color: white;
        }

        .btn-concluir:hover {
            background: #219a52;
            transform: translateY(-1px);
        }

        .btn-delete {
            background: var(--danger-red);
            color: white;
        }

        .btn-delete:hover {
            background: #c0392b;
            transform: translateY(-1px);
        }

        .concluido-text {
            color: var(--success-green);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
        }

        .success-message {
            background: rgba(39, 174, 96, 0.1);
            color: var(--success-green);
            padding: 14px 18px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid rgba(39, 174, 96, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
        }

        .empty-state {
            text-align: center;
            padding: 50px 20px;
            color: var(--text-light);
        }

        .empty-state i {
            font-size: 3rem;
            color: var(--light-blue);
            margin-bottom: 16px;
        }

        .empty-state h3 {
            font-size: 1.3rem;
            margin-bottom: 8px;
            color: var(--text-dark);
            font-weight: 400;
        }

        .empty-state p {
            font-size: 0.9rem;
            color: var(--text-light);
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px 15px;
            }
            
            .stats-cards {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            table {
                display: block;
                overflow-x: auto;
            }
            
            .actions {
                flex-direction: column;
                align-items: flex-start;
                gap: 6px;
            }
            
            th, td {
                padding: 14px 12px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Gestão de Pedidos</h1>
            <p class="subtitle">Painel administrativo para gestão de pedidos de lavagem</p>
        </div>

        @if(session('success'))
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                {{ session('success') }}
            </div>
        @endif

        <div class="stats-cards">
            <div class="stat-card">
                <div class="stat-number">{{ $pedidos->count() }}</div>
                <div class="stat-label">Total de Pedidos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ $pedidos->where('estado', 'Pendente')->count() }}</div>
                <div class="stat-label">Pedidos Pendentes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ $pedidos->where('estado', 'Concluído')->count() }}</div>
                <div class="stat-label">Pedidos Concluídos</div>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th><i class="fas fa-hashtag"></i> ID</th>
                        <th><i class="fas fa-user"></i> Utilizador</th>
                        <th><i class="fas fa-tag"></i> Tipo</th>
                        <th><i class="fas fa-concierge-bell"></i> Serviços</th>
                        <th><i class="fas fa-info-circle"></i> Estado</th>
                        <th><i class="fas fa-cogs"></i> Ações</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($pedidos as $pedido)
                        <tr>
                            <td><strong>#{{ $pedido->id }}</strong></td>
                            <td>{{ $pedido->user_id }}</td>
                            <td>{{ $pedido->tipo }}</td>
                            <td>
                                <div class="servicos-list">
                                    @if(!empty($pedido->servicos_adicionais) && is_array($pedido->servicos_adicionais))
                                        @foreach($pedido->servicos_adicionais as $servico)
                                            <span class="servico-tag">{{ $servico }}</span>
                                        @endforeach
                                    @else
                                        <span style="color: var(--text-light);">-</span>
                                    @endif
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-{{ strtolower($pedido->estado) }}">
                                    <i class="fas fa-{{ $pedido->estado === 'Pendente' ? 'clock' : 'check-circle' }}"></i>
                                    {{ $pedido->estado }}
                                </span>
                            </td>
                            <td>
                                <div class="actions">
                                    @if($pedido->estado !== 'Concluído')
                                        <a href="{{ url('/admin/pedidos/' . $pedido->id . '/concluir') }}" class="btn btn-concluir">
                                            <i class="fas fa-check"></i>
                                            Concluir
                                        </a>
                                    @else
                                        <span class="concluido-text">
                                            <i class="fas fa-check-circle"></i>
                                            Concluído
                                        </span>
                                    @endif
                                    <a href="{{ url('/admin/pedidos/' . $pedido->id . '/delete') }}" class="btn btn-delete" onclick="return confirm('Tem certeza que deseja eliminar este pedido?')">
                                        <i class="fas fa-trash"></i>
                                        Eliminar
                                    </a>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6">
                                <div class="empty-state">
                                    <i class="fas fa-inbox"></i>
                                    <h3>Nenhum pedido encontrado</h3>
                                    <p>Não há pedidos para exibir no momento</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Adicionar animação suave ao carregar
        document.addEventListener('DOMContentLoaded', function() {
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach((row, index) => {
                row.style.animationDelay = `${index * 0.05}s`;
                row.style.animation = 'fadeIn 0.4s ease forwards';
            });
        });
    </script>
</body>
</html>