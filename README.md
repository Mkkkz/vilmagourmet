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


## Ajustes de quantidade

Esta versão ajusta apenas detalhes de usabilidade:
- remove visual de números com `.000`;
- mostra quantidades como `1000 g`, `500 ml`, `20 un`;
- melhora o campo de quantidade usada;
- mostra a unidade do ingrediente no campo de uso;
- melhora a tabela de precificação.


## Páginas adicionadas
- `/` página principal
- `/produtos` cardápio
- `/checkout` compra com dados obrigatórios e Pix automático
- `/pedido` confirmação simples
- `/fotos` galeria
- `/admin` painel administrativo


## Banco
Se o banco já existe, rode `neon_update_site.sql` no Neon.
Se for banco novo, rode `neon.sql`.


## Versão WhatsApp simples

Esta versão remove o Pix automático/Mercado Pago e deixa a compra mais simples:

- `/` página principal
- `/produtos` produtos com botão para WhatsApp
- `/fotos` galeria
- `/admin` painel administrativo

O cliente escolhe um produto e clica em **Pedir pelo WhatsApp**.
