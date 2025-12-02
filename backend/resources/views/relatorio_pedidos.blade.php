<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Relatório de Pedidos</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <h2>Relatório de Pedidos</h2>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Data</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pedidos as $p)
                <tr>
                    <td>{{ $p->id }}</td>
                    <td>{{ $p->name ?? '—' }}</td>
                    <td>{{ $p->estado }}</td>
                    <td>{{ $p->created_at }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
