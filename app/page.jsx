import Link from 'next/link';
import { products, formatMoney, whatsappLink } from '../lib/siteProducts';

export default function Home() {
  const destaque = products.slice(0, 3);

  return (
    <main className="sitePage">
      <header className="siteNav">
        <Link href="/" className="siteBrand">
          <img src="/logo.png" alt="Vilma Natural Gourmet" />
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

        <div className="heroImageCard">
          <img src="/site/guerreira.jpeg" alt="Vilma vendendo iogurte artesanal" />
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

      <section className="storySection storyWithPhoto">
        <div>
          <span>Quem sou</span>
          <h2>A minha história</h2>
          <p>
            Em 2007, comecei vendendo iogurte artesanal pelas ruas, empurrando meu carrinho
            debaixo do sol, cheia de sonhos e vontade de vencer. Era simples, mas feito com
            muito amor.
          </p>
          <p>
            Com o passar dos anos, a vida mudou e parei por um tempo, mas a paixão nunca saiu
            de dentro de mim. Hoje, depois de tantos anos, o iogurte voltou: mais cremoso,
            mais especial, na garrafinha e também na versão grega artesanal.
          </p>
          <p>
            Quem experimenta não leva só um produto, leva uma história construída com carinho,
            persistência e uma paixão que nunca acabou.
          </p>
        </div>

        <img src="/site/guerreira.jpeg" alt="Foto da guerreira vendendo iogurte" />
      </section>

      <footer className="siteFooter">
        <p>© 2026 Vilma Natural Gourmet — Campos Altos - MG</p>
        <p>Site desenvolvido por LegacyJS.</p>
      </footer>
    </main>
  );
}
