
Utilizador{
     id;
     nome;
     username;
     email;
     senha;
     role;

     //Métodos
     public registar();
     public login();
     public alterar_senha();

}

Cliente extends Utilizador{
    id;

    //Métodos
    public criar_pedido();
    public visualizar_pedido();
    public submeter_pedido(); 
}

Gestor extends Utilizador{
     id;

     //Métodos
     public aceitar_pedido();
     public visualizar_pedido();
     public actualizar_estado();

}
Pedido{
     id;
     roupa;   
     estado;

     //Métodos
     public alterar_preco();
     public corrigir_preco();
     public corrigir_valor();
}


Roupa{
     id;
     foto;
     peso;
     tipo_lavagem;
     tipo_secagem;
     proprietario;
}