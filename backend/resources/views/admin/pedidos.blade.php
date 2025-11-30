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
}
* {margin:0; padding:0; box-sizing:border-box;}
body {font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f8fbfd 0%, #ecf0f1 100%); min-height:100vh; color:var(--text-dark);}
.container {max-width:1200px; margin:0 auto; padding:30px 20px;}
.header {text-align:center; margin-bottom:40px;}
h1 {font-size:2.2rem; font-weight:300; color:var(--primary-blue); margin-bottom:8px;}
.subtitle {color:var(--text-light); font-size:1rem; font-weight:400;}
.stats-cards {display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; margin-bottom:40px;}
.stat-card {background:white; padding:25px; border-radius:12px; text-align:center; border:1px solid var(--border-blue); box-shadow:0 2px 8px rgba(52,152,219,0.08); transition: transform 0.2s ease;}
.stat-card:hover {transform:translateY(-2px); box-shadow:0 4px 12px rgba(52,152,219,0.12);}
.stat-number {font-size:2.2rem; font-weight:300; color:var(--primary-blue); margin-bottom:5px;}
.stat-label {color:var(--text-light); font-size:0.85rem; font-weight:500; text-transform:uppercase; letter-spacing:0.5px;}
.table-container {background:white; border-radius:12px; overflow:hidden; border:1px solid var(--border-blue); box-shadow:0 2px 8px rgba(52,152,219,0.08);}
table {width:100%; border-collapse:collapse;}
thead {background:var(--light-blue); border-bottom:1px solid var(--border-blue);}
th, td {padding:18px 20px; text-align:left; color:var(--text-dark);}
th i {margin-right:8px; color:var(--primary-blue);}
tbody tr {border-bottom:1px solid var(--light-blue); transition:background-color 0.2s ease;}
tbody tr:hover {background-color: var(--very-light-blue);}
.status-badge {display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:16px; font-size:0.75rem; font-weight:500; text-transform:uppercase;}
.status-pendente {background: rgba(231,76,60,0.1); color: var(--danger-red); border:1px solid rgba(231,76,60,0.2);}
.status-concluído {background: rgba(39,174,96,0.1); color: var(--success-green); border:1px solid rgba(39,174,96,0.2);}
.servicos-list {display:flex; flex-wrap:wrap; gap:4px;}
.servico-tag {background: var(--light-blue); color: var(--primary-blue); padding:3px 8px; border-radius:10px; font-size:0.75rem; border:1px solid var(--border-blue);}
.actions {display:flex; gap:8px; align-items:center;}
.btn {display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:none; border-radius:6px; font-size:0.8rem; font-weight:500; cursor:pointer; text-transform:uppercase;}
.btn-concluir {background:var(--success-green); color:white;}
.btn-concluir:hover {background:#219a52; transform:translateY(-1px);}
.btn-delete {background:var(--danger-red); color:white;}
.btn-delete:hover {background:#c0392b; transform:translateY(-1px);}
.btn-avaliar {background: var(--primary-blue); color:white;}
.btn-avaliar:hover {background:#2980b9; transform:translateY(-1px);}
.concluido-text {color:var(--success-green); font-weight:500; display:flex; align-items:center; gap:6px; font-size:0.85rem;}
.success-message {background: rgba(39,174,96,0.1); color: var(--success-green); padding:14px 18px; border-radius:8px; margin-bottom:30px; border:1px solid rgba(39,174,96,0.2); display:flex; align-items:center; gap:10px; font-size:0.9rem;}
.empty-state {text-align:center; padding:50px 20px; color: var(--text-light);}
.empty-state i {font-size:3rem; color: var(--light-blue); margin-bottom:16px;}
.empty-state h3 {font-size:1.3rem; margin-bottom:8px; color: var(--text-dark); font-weight:400;}
.modal-bg {position:fixed; inset:0; background:rgba(0,0,0,0.4); display:none; justify-content:center; align-items:center; z-index:1000;}
.modal {background:white; padding:20px; border-radius:12px; width:450px; max-width:95%; position:relative;}
.modal h2 {margin-bottom:15px; color:var(--primary-blue);}
.modal label {display:block; margin-top:10px; font-weight:500;}
.modal input {width:100%; padding:8px 10px; margin-top:5px; border-radius:6px; border:1px solid var(--border-blue);}
.modal button {margin-top:10px; padding:10px 14px; border:none; border-radius:6px; cursor:pointer; background:var(--success-green); color:white; font-weight:500; transition:0.2s;}
.modal button:hover {background:#219a52;}
.modal .close {position:absolute; top:10px; right:12px; font-size:1.2rem; cursor:pointer; color:var(--danger-red);}
@media (max-width:768px){.stats-cards{grid-template-columns:1fr;}table{display:block; overflow-x:auto;}th,td{padding:14px 12px;}.actions{flex-direction:column; align-items:flex-start; gap:6px;}}
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
                            <!--<img src="{{ $pedido->imagem }}" alt="Imagem do Pedido" style="max-height:60px; border-radius:4px; object-fit:cover;">-->
                            <img src="{{ asset('storage/' . $pedido->imagem) }}" alt="Imagem do Pedido" style="max-height:60px; object-fit:cover;">
                        @else
                            <span style="color: var(--text-light);">-</span>
                        @endif
                    </td>
                    <td>
                        <span class="status-badge status-{{ strtolower($pedido->estado) }}">
                            <i class="fas fa-{{ $pedido->estado === 'Pendente' ? 'clock' : 'check-circle' }}"></i>
                            {{ $pedido->estado }}
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            @if($pedido->estado === 'Aguardando Avaliação')
                                <button class="btn btn-avaliar"
                                    onclick='openModal({{ $pedido->id }}, {!! json_encode($pedido->imagem) !!}, {!! json_encode($pedido->servicos_adicionais ?? []) !!}, false)'>
                                    <i class="fas fa-file-invoice-dollar"></i> Avaliar
                                </button>
                            @elseif($pedido->estado === 'Aguardando Confirmação')
                                <button class="btn btn-avaliar"
                                    onclick='openModal({{ $pedido->id }}, {!! json_encode($pedido->imagem) !!}, {!! json_encode($pedido->servicos_adicionais ?? []) !!}, true)'>
                                    <i class="fas fa-eye"></i> Visualizar Factura
                                </button>
                            @elseif($pedido->estado === 'Confirmado')
                                <a href="{{ url('/admin/pedidos/' . $pedido->id . '/concluir') }}" class="btn btn-concluir">
                                    <i class="fas fa-check"></i> Concluir
                                </a>
                            @elseif($pedido->estado === 'Concluído')
                                <span class="concluido-text"><i class="fas fa-check-circle"></i> Concluído</span>
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
        <h2>Avaliar Pedido</h2>
        <div id="pedido-image-container" style="text-align:center;">
            <img id="pedido-image" src="" alt="Imagem do Pedido"
                 style="max-width:100%; max-height:300px; border-radius:4px; object-fit:contain;">
        </div>
        <div id="pedido-servicos" class="servicos-list" style="margin-top:8px;"></div>

        <form id="avaliarForm" method="POST">
            @csrf
            <input type="hidden" name="pedido_id" id="pedido_id">
            
            <label>Tipo de Lavagem:</label>
            <input type="text" id="tipo_lavagem" readonly style="background:#ecf0f1;">

            <label>Peso (kg):</label>
            <input type="number" step="0.01" name="peso" id="peso" required>

            <label>Preço por Kg:</label>
            <input type="number" step="0.01" name="preco_kg" id="preco_kg" required>

            <label>Subtotal:</label>
            <input type="text" id="subtotal" readonly style="background:#ecf0f1;">

            <label>IVA (13% se peso > 20kg):</label>
            <input type="text" id="iva" readonly style="background:#ecf0f1;">

            <label>Total:</label>
            <input type="text" id="total" readonly style="background:#ecf0f1;">

            <button type="button" onclick="calcularTotal()">Calcular Total</button>
            <button type="submit">Enviar Factura</button>
        </form>
    </div>
</div>

<script>
function openModal(id, imagem, servicos, tipo, somenteLeitura = false) {
    document.getElementById('pedido_id').value = id;
    document.getElementById('pedido-image').src = imagem ? `{{ asset('storage') }}/` + imagem : '/default-image.png';

    // Tipo de lavagem
    document.getElementById('tipo_lavagem').value = tipo;

    // Serviços adicionais
    const servicosContainer = document.getElementById('pedido-servicos');
    servicosContainer.innerHTML = '';
    servicos.forEach(s => {
        const span = document.createElement('span');
        span.className = 'servico-tag';
        span.textContent = s;
        servicosContainer.appendChild(span);
    });

    const form = document.getElementById('avaliarForm');
    Array.from(form.querySelectorAll('input, button')).forEach(el => el.disabled = somenteLeitura);

    document.getElementById('modal-bg').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-bg').style.display = 'none';
}

// Calcular total, IVA e subtotal
function calcularTotal() {
    const peso = parseFloat(document.getElementById('peso').value) || 0;
    const precoKg = parseFloat(document.getElementById('preco_kg').value) || 0;

    // Serviços adicionais somam +2 por serviço, por exemplo
    const servicos = Array.from(document.querySelectorAll('#pedido-servicos .servico-tag')).map(s => s.textContent);
    let extra = 0;
    servicos.forEach(s => {
        if (s === 'Secagem') extra += 2;
        if (s === 'Passagem') extra += 2;
        if (s === 'Perfumaria') extra += 2;
    });

    const subtotal = (peso * precoKg) + extra;
    const iva = peso > 20 ? subtotal * 0.13 : 0;
    const total = subtotal + iva;

    document.getElementById('subtotal').value = subtotal.toFixed(2);
    document.getElementById('iva').value = iva.toFixed(2);
    document.getElementById('total').value = total.toFixed(2);
}

// Enviar formulario via AJAX
document.getElementById('avaliarForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const pedidoId = document.getElementById('pedido_id').value;
    const peso = parseFloat(document.getElementById('peso').value) || 0;
    const precoKg = parseFloat(document.getElementById('preco_kg').value) || 0;
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const iva = parseFloat(document.getElementById('iva').value) || 0;
    const total = parseFloat(document.getElementById('total').value) || 0;

    try {
        await fetch(`/admin/pedidos/${pedidoId}/avaliar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
            body: JSON.stringify({ peso, preco_kg: precoKg, subtotal, iva, total })
        });

        alert("Pedido avaliado com sucesso!");
        closeModal();
        location.reload();
    } catch(err) {
        console.error(err);
        alert("Erro ao avaliar pedido.");
    }
});

document.getElementById('modal-bg').addEventListener('click', e => {
    if(e.target === e.currentTarget) closeModal();
});
</script>
</body>
</html>