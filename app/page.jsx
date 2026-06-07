import Link from 'next/link';
import { products, formatMoney, whatsappLink } from '../lib/siteProducts';

export default function Home() {
  const destaque = products.slice(0, 3);

  return (
    <main className="sitePage">
      <header className="siteNav">
        <Link href="/" className="siteBrand">
          <img src="/site/logo-vilma-square.jpg" alt="Vilma Natural Gourmet" />
          <div>
            <strong>Vilma Natural Gourmet</strong>
            <span>Iogurte artesanal</span>
          </div>
        </Link>

        <nav>
          <Link href="/produtos">Produtos</Link>
          <Link href="/fotos">Fotos</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="siteHero">
        <div>
          <span className="siteBadge">Campos Altos - MG</span>
          <h1>Iogurtes artesanais feitos com carinho.</h1>
          <p>
            Muito mais que sabor, um ótimo probiótico para saúde. Cada potinho carrega dedicação,
            recomeços e muito amor pelo que faço.
          </p>
          <div className="heroActions">
            <Link href="/produtos" className="siteBtn">Ver produtos</Link>
            <a className="siteBtn secondary" href={whatsappLink()} target="_blank" rel="noreferrer">
              Pedir pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="heroImageCard portraitCard">
          <img src="/site/vilma-inicio.jpg" alt="Vilma Natural Gourmet" />
        </div>
      </section>

      <section className="brandLabelSection">
        <img src="/site/logo-vilma-legivel.jpg" alt="Vilma Iogurte Artesanal" />
        <div>
          <span>Natural Gourmet</span>
          <h2>Feito com carinho, cuidado e história.</h2>
          <p>
            Uma marca artesanal de Campos Altos - MG, criada para entregar sabor,
            cremosidade e bem-estar em cada potinho.
          </p>
        </div>
      </section>

      <section className="siteInfoGrid">
        <div>
          <span>🚚 Entrega</span>
          <h2>Entrega na cidade</h2>
          <p>Atendimento em Campos Altos - MG. Taxa de entrega: <b>R$ 4,00</b>.</p>
        </div>
        <div>
          <span>💳 Pagamento</span>
          <h2>Pagamento facilitado</h2>
          <p>Aceitamos Pix, dinheiro, cartão de crédito e cartão de débito.</p>
        </div>
        <div>
          <span>💬 Contato</span>
          <h2>Pedidos pelo WhatsApp</h2>
          <p>WhatsApp: <b>(37) 99805-7323</b>.</p>
        </div>
      </section>

      <section className="siteSection">
        <div className="sectionHeader">
          <span>Cardápio</span>
          <h2>Produtos em destaque</h2>
          <p>Escolha um produto e faça o pedido direto pelo WhatsApp.</p>
        </div>

        <div className="siteProductGrid">
          {destaque.map((product) => (
            <article className="siteProductCard" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <span>{product.size}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{formatMoney(product.price)}</strong>
                <a href={whatsappLink(product)} target="_blank" rel="noreferrer">Pedir pelo WhatsApp</a>
              </div>
            </article>
          ))}
        </div>

        <div className="center">
          <Link href="/produtos" className="siteBtn">Ver cardápio completo</Link>
        </div>
      </section>

      <section className="storySection storyImageOnly">
        <div className="sectionHeader storyHeader">
          <span>Quem sou</span>
          <h2>Minha história</h2>
          <p>Uma trajetória de carinho, persistência e paixão pelo iogurte artesanal.</p>
        </div>
        <img src="/site/historia-completa.jpg" alt="Minha história Vilma Natural Gourmet" />
      </section>

      <footer className="siteFooter">
        <p>© 2026 Vilma Natural Gourmet — Campos Altos - MG</p>
        <p>Site desenvolvido por LegacyJS.</p>
      </footer>
    </main>
  );
}
