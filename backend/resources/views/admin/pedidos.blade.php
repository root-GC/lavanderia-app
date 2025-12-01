<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Gestão de Pedidos - Dashboard</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<style>
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #8b5cf6;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --info: #3b82f6;
    --dark: #1e293b;
    --light: #f8fafc;
    --border: #e2e8f0;
    --text: #334155;
    --text-light: #64748b;
}

* {margin:0; padding:0; box-sizing:border-box;}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height:100vh;
    color:var(--text);
    padding: 20px;
}

.container {
    max-width:1400px;
    margin:0 auto;
}

.header {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    padding: 30px 40px;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
}

.header-content p {
    color: var(--text-light);
    font-size: 0.95rem;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.btn-header {
    padding: 12px 24px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99,102,241,0.3);
}

.success-message {
    background: rgba(16,185,129,0.1);
    color: var(--success);
    padding: 16px 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    border: 1px solid rgba(16,185,129,0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
    font-weight: 500;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
}

.stat-icon.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 30%); color: white; }
.stat-icon.orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; }
.stat-icon.green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
.stat-icon.red { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }

.stat-number {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 5px;
}

.stat-label {
    color: var(--text-light);
    font-size: 0.9rem;
    font-weight: 500;
}

.stat-trend {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    margin-top: 8px;
}

.trend-up { color: var(--success); }
.trend-down { color: var(--danger); }

.charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.chart-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.chart-card h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.table-container {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.table-header {
    padding: 25px 30px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table-header h2 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--dark);
}

.search-box {
    display: flex;
    align-items: center;
    background: var(--light);
    padding: 10px 15px;
    border-radius: 10px;
    gap: 10px;
}

.search-box input {
    border: none;
    background: none;
    outline: none;
    font-size: 0.9rem;
    width: 250px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: var(--light);
}

th {
    padding: 18px 20px;
    text-align: left;
    font-weight: 600;
    color: var(--text);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

td {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
}

tbody tr {
    transition: all 0.2s;
}

tbody tr:hover {
    background: var(--light);
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-pendente { background: rgba(239,68,68,0.1); color: var(--danger); }
.status-aguardando { background: rgba(245,158,11,0.1); color: var(--warning); }
.status-confirmado { background: rgba(59,130,246,0.1); color: var(--info); }
.status-concluído { background: rgba(16,185,129,0.1); color: var(--success); }
.status-lavado { background: rgba(16,185,129,0.1); color: var(--success); }

.servicos-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.servico-tag {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
}

.actions {
    display: flex;
    gap: 8px;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-avaliar {
    background: var(--primary);
    color: white;
}

.btn-avaliar:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.3);
}

.btn-concluir {
    background: var(--success);
    color: white;
}

.btn-concluir:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16,185,129,0.3);
}

.concluido-text {
    color: var(--success);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 30px;
    border-radius: 20px;
    width: 600px;
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    position: relative;
}

.modal h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 20px;
}

.modal .close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: var(--light);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: var(--text);
    font-size: 1.2rem;
}

.modal .close:hover {
    background: var(--danger);
    color: white;
    transform: rotate(90deg);
}

.modal label {
    display: block;
    margin-top: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 5px;
}

.modal input {
    width: 100%;
    padding: 12px 15px;
    border-radius: 10px;
    border: 2px solid var(--border);
    font-size: 0.95rem;
    transition: all 0.3s;
}

.modal input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.modal button {
    margin-top: 15px;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
    width: 100%;
}

#btn-calcular {
    background: var(--info);
    color: white;
}

#btn-calcular:hover {
    background: #2563eb;
    transform: translateY(-2px);
}

#btn-enviar {
    background: var(--success);
    color: white;
}

#btn-enviar:hover {
    background: #059669;
    transform: translateY(-2px);
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-state i {
    font-size: 4rem;
    color: var(--border);
    margin-bottom: 20px;
}

.empty-state h3 {
    font-size: 1.3rem;
    color: var(--text);
    margin-bottom: 10px;
}

.empty-state p {
    color: var(--text-light);
}

@media (max-width: 1024px) {
    .charts-section {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    table {
        display: block;
        overflow-x: auto;
    }
    
    th, td {
        padding: 14px 12px;
    }
    
    .actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }
}
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="header-content">
            <h1><i class="fas fa-chart-line"></i> Dashboard Administrativo</h1>
            <p>Gestão completa de pedidos de lavagem</p>
        </div>
        <div class="header-actions">
            <button class="btn-header btn-primary">
                <i class="fas fa-download"></i> Exportar Relatório
            </button>
        </div>
    </div>

    @if(session('success'))
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            {{ session('success') }}
        </div>
    @endif

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-number">{{ $pedidos->count() }}</div>
                    <div class="stat-label">Total de Pedidos</div>
                    <div class="stat-trend trend-up">
                        <i class="fas fa-arrow-up"></i> +12% este mês
                    </div>
                </div>
                <div class="stat-icon blue">
                    <i class="fas fa-shopping-cart"></i>
                </div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-number">{{ $pedidos->where('estado', 'Pendente')->count() }}</div>
                    <div class="stat-label">Pedidos Pendentes</div>
                    <div class="stat-trend trend-down">
                        <i class="fas fa-arrow-down"></i> -5% esta semana
                    </div>
                </div>
                <div class="stat-icon orange">
                    <i class="fas fa-clock"></i>
                </div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-number">{{ $pedidos->where('estado', 'Concluído')->count() }}</div>
                    <div class="stat-label">Pedidos Concluídos</div>
                    <div class="stat-trend trend-up">
                        <i class="fas fa-arrow-up"></i> +18% este mês
                    </div>
                </div>
                <div class="stat-icon green">
                    <i class="fas fa-check-circle"></i>
                </div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-number">{{ $pedidos->where('estado', 'confirmado')->count() }}</div>
                    <div class="stat-label">Em Processo</div>
                    <div class="stat-trend trend-up">
                        <i class="fas fa-arrow-up"></i> +8% hoje
                    </div>
                </div>
                <div class="stat-icon red">
                    <i class="fas fa-spinner"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="charts-section">
        <div class="chart-card">
            <h3><i class="fas fa-chart-line"></i> Pedidos dos Últimos 7 Dias</h3>
            <canvas id="lineChart"></canvas>
        </div>
        <div class="chart-card">
            <h3><i class="fas fa-chart-pie"></i> Status dos Pedidos</h3>
            <canvas id="pieChart"></canvas>
        </div>
    </div>

    <div class="table-container">
        <div class="table-header">
            <h2><i class="fas fa-list"></i> Lista de Pedidos</h2>
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Pesquisar pedidos...">
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th><i class="fas fa-hashtag"></i> ID</th>
                    <th><i class="fas fa-user"></i> Utilizador</th>
                    <th><i class="fas fa-tag"></i> Tipo</th>
                    <th><i class="fas fa-concierge-bell"></i> Serviços</th>
                    <th><i class="fas fa-image"></i> Imagem</th>
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
                        @if($pedido->imagem)
                            <img src="{{ asset('storage/' . $pedido->imagem) }}" alt="Imagem" style="max-height:50px; border-radius:8px; object-fit:cover;">
                        @else
                            <span style="color: var(--text-light);">-</span>
                        @endif
                    </td>
                    <td>
                        <span class="status-badge status-{{ strtolower($pedido->estado) }}">
                            <i class="fas fa-{{ $pedido->estado === 'Pendente' ? 'clock' : ($pedido->estado === 'Lavado' || $pedido->estado === 'Concluído' ? 'check-circle' : 'spinner') }}"></i>
                            {{ $pedido->estado }}
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            @if($pedido->estado === 'Aguardando Avaliação')
                                <button class="btn btn-avaliar"
                                    onclick='openModal({{ $pedido->id }}, {!! json_encode($pedido->imagem) !!}, {!! json_encode($pedido->servicos_adicionais ?? []) !!}, {!! json_encode($pedido->tipo) !!}, false, false)'>
                                    <i class="fas fa-file-invoice-dollar"></i> Avaliar
                                </button>
                            @elseif($pedido->estado === 'Aguardando Confirmação')
                                <button class="btn btn-avaliar"
                                    onclick='openModal({{ $pedido->id }}, {!! json_encode($pedido->imagem) !!}, {!! json_encode($pedido->servicos_adicionais ?? []) !!}, {!! json_encode($pedido->tipo) !!}, true, true, {!! json_encode($pedido->peso ?? 0) !!}, {!! json_encode($pedido->preco_kg ?? 0) !!}, {!! json_encode($pedido->subtotal ?? 0) !!}, {!! json_encode($pedido->iva ?? 0) !!}, {!! json_encode($pedido->total ?? 0) !!})'>
                                    <i class="fas fa-eye"></i> Visualizar Factura
                                </button>
                            @elseif($pedido->estado === 'confirmado')
                                <button class="btn btn-concluir"
                                    onclick="atualizarEstado({{ $pedido->id }}, 'Lavado', this)">
                                    <i class="fas fa-check"></i> Concluir
                                </button>
                            @elseif($pedido->estado === 'Lavado')
                                <span class="concluido-text"><i class="fas fa-check-circle"></i> Lavado</span>
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7">
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

<!-- Modal Avaliar / Factura -->
<div class="modal-bg" id="modal-bg">
    <div class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2 id="modal-title">Avaliar Pedido</h2>
        <div id="pedido-image-container" style="text-align:center; margin: 20px 0;">
            <img id="pedido-image" src="" alt="Imagem do Pedido" style="max-width:100%; max-height:250px; border-radius:12px; object-fit:contain;">
        </div>
        <div id="pedido-servicos" class="servicos-list" style="margin-bottom:20px; justify-content:center;"></div>

        <form id="avaliarForm" method="POST">
            @csrf
            <input type="hidden" name="pedido_id" id="pedido_id">
            
            <label>Tipo de Lavagem:</label>
            <input type="text" id="tipo_lavagem" readonly style="background:var(--light);">

            <label>Peso (kg):</label>
            <input type="number" step="0.01" name="peso" id="peso" required>

            <label>Preço por Kg:</label>
            <input type="number" step="0.01" name="preco_kg" id="preco_kg" required>

            <label>Subtotal:</label>
            <input type="text" id="subtotal" readonly style="background:var(--light);">

            <label>IVA (13% se peso > 20kg):</label>
            <input type="text" id="iva" readonly style="background:var(--light);">

            <label>Total:</label>
            <input type="text" id="total" readonly style="background:var(--light);">

            <button type="button" onclick="calcularTotal()" id="btn-calcular">Calcular Total</button>
            <button type="submit" id="btn-enviar">Enviar Factura</button>
        </form>
    </div>
</div>

<script>
// Gráfico de Linha - Pedidos dos últimos 7 dias
const lineCtx = document.getElementById('lineChart').getContext('2d');
new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Pedidos',
            data: [12, 19, 15, 25, 22, 30, 28],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#6366f1',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
            x: { grid: { display: false } }
        }
    }
});

// Gráfico de Pizza - Status dos pedidos
const pieCtx = document.getElementById('pieChart').getContext('2d');
new Chart(pieCtx, {
    type: 'doughnut',
    data: {
        labels: ['Pendente', 'Em progresso', 'Concluído'],
        datasets: [{
            data: [
                {{ $pedidos->where('estado', 'confirmado')->count() }},
                {{ $pedidos->where('estado', 'Aguardando Confirmação')->count() }},
                {{ $pedidos->where('estado', 'Lavado')->count() }}
            ],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 15, font: { size: 12 } }
            }
        }
    }
});

// Função para abrir modal (mantida do código original)
function openModal(id, imagem, servicos, tipo, somenteLeitura=false, factura=false, peso=0, precoKg=0, subtotal=0, iva=0, total=0){
    document.getElementById('pedido_id').value = id;
    document.getElementById('pedido-image').src = imagem ? `{{ asset('storage') }}/` + imagem : '/default-image.png';
    document.getElementById('tipo_lavagem').value = tipo;

    const servicosContainer = document.getElementById('pedido-servicos');
    servicosContainer.innerHTML = '';
    servicos.forEach(s => {
        const span = document.createElement('span');
        span.className = 'servico-tag';
        span.textContent = s;
        servicosContainer.appendChild(span);
    });

    const form = document.getElementById('avaliarForm');

    if(factura){
        document.getElementById('modal-title').textContent = 'Factura do Pedido';
        form.querySelectorAll('input').forEach(el => el.disabled = true);
        document.getElementById('btn-calcular').style.display = 'none';
        document.getElementById('btn-enviar').style.display = 'none';

        document.getElementById('peso').value = peso;
        document.getElementById('preco_kg').value = precoKg;
        document.getElementById('subtotal').value = subtotal;
        document.getElementById('iva').value = iva;
        document.getElementById('total').value = total;
    } else {
        document.getElementById('modal-title').textContent = 'Avaliar Pedido';
        form.querySelectorAll('input').forEach(el => el.disabled = somenteLeitura);
        document.getElementById('btn-calcular').style.display = 'inline-block';
        document.getElementById('btn-enviar').style.display = 'inline-block';

        document.getElementById('peso').value = peso ? peso : '';
        document.getElementById('preco_kg').value = precoKg ? precoKg : '';
        document.getElementById('subtotal').value = '';
        document.getElementById('iva').value = '';
        document.getElementById('total').value = '';
    }

    document.getElementById('modal-bg').style.display = 'flex';
}

// Função para fechar modal
function closeModal(){ 
    document.getElementById('modal-bg').style.display = 'none'; 
}

// Função para calcular total (mantida do código original)
function calcularTotal(){
    const peso = parseFloat(document.getElementById('peso').value) || 0;
    const precoKg = parseFloat(document.getElementById('preco_kg').value) || 0;
    const servicos = Array.from(document.querySelectorAll('#pedido-servicos .servico-tag')).map(s => s.textContent);
    let extra = 0;
    servicos.forEach(s => { 
        if(['Secagem','Passagem','Perfumaria'].includes(s)) extra+=2; 
    });

    const subtotal = (peso*precoKg)+extra;
    const iva = peso>20 ? subtotal*0.13 : 0;
    const total = subtotal+iva;

    document.getElementById('subtotal').value = subtotal.toFixed(2);
    document.getElementById('iva').value = iva.toFixed(2);
    document.getElementById('total').value = total.toFixed(2);
}

// Submit do formulário de avaliação (mantido do código original)
document.getElementById('avaliarForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const pedidoId = document.getElementById('pedido_id').value;
    const peso = parseFloat(document.getElementById('peso').value) || 0;
    const precoKg = parseFloat(document.getElementById('preco_kg').value) || 0;
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const iva = parseFloat(document.getElementById('iva').value) || 0;
    const total = parseFloat(document.getElementById('total').value) || 0;

    try{
        await fetch(`/admin/pedidos/${pedidoId}/avaliar`,{
            method:'POST',
            headers:{ 'Content-Type':'application/json','X-CSRF-TOKEN':'{{ csrf_token() }}' },
            body: JSON.stringify({ peso, preco_kg:precoKg, subtotal, iva, total })
        });
        alert("Pedido avaliado com sucesso!");
        closeModal();
        location.reload();
    }catch(err){
        console.error(err);
        alert("Erro ao avaliar pedido.");
    }
});

// Fechar modal ao clicar fora
document.getElementById('modal-bg').addEventListener('click', e=>{ 
    if(e.target===e.currentTarget) closeModal(); 
});

// Função para atualizar estado (mantida do código original)
async function atualizarEstado(pedidoId, novoEstado, btnElement) {
    try {
        const response = await fetch(`/admin/pedidos/${pedidoId}/atualizar-estado`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ estado: novoEstado })
        });

        if (!response.ok) throw new Error('Erro na atualização do estado');

        // Atualiza o texto do botão
        if (novoEstado === 'Lavado') {
            const span = document.createElement('span');
            span.className = 'concluido-text';
            span.innerHTML = '<i class="fas fa-check-circle"></i> Lavado';
            btnElement.replaceWith(span);
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao atualizar o estado do pedido.');
    }
}

// Funcionalidade de pesquisa
const searchInput = document.querySelector('.search-box input');
if(searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}
</script>
</body>
</html>