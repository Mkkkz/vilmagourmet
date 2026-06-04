# VilmaGourmet - Painel Admin com Neon

Painel administrativo para controle de ingredientes, receitas/produtos, pedidos, vendas, anotações e cálculos automáticos.

## Funções

- Login admin em `/admin`
- Cadastro de ingredientes
- Cálculo automático de custo por grama/unidade
- Cadastro de receitas/produtos
- Cálculo automático de custo total, custos extras, multiplicador, rendimento e preço final
- Controle de pedidos
- Total vendido no dia, mês e ano
- Bloco de notas
- Calculadora simples
- Dados salvos no Neon PostgreSQL

## Configuração

1. Crie um projeto no Neon.
2. Copie sua `DATABASE_URL`.
3. Abra o SQL Editor do Neon.
4. Cole e execute o arquivo `neon.sql`.
5. Na Vercel, configure as variáveis do `.env.example`.
6. Faça deploy.

## Variáveis na Vercel

```env
DATABASE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
SESSION_SECRET=
```

## Atenção

Não mande sua `DATABASE_URL` para ninguém, porque ela contém a senha do banco.


## Atualização de precificação

Esta versão melhora apenas a tela de Receitas/Produtos:
- labels explicando cada campo;
- tabela de ingredientes parecida com planilha;
- bloco "Contas Finais";
- preço final por unidade mais claro.
