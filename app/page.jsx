export default function Home() {
  return (
    <main className="publicHome">
      <div className="homeCard">
        <img src="/logo.png" alt="VilmaGourmet" />
        <span>VilmaGourmet</span>
        <h1>Painel Vilma Gourmet</h1>
        <p>
          Sistema interno para controle de ingredientes, receitas, pedidos,
          vendas e precificação automática.
        </p>
        <a href="/admin">Acessar painel</a>
      </div>
    </main>
  );
}
