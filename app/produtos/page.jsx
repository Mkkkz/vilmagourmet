import Link from 'next/link';
import { products, deliveryFee, formatMoney, whatsappLink } from '../../lib/siteProducts';

export const metadata = {
  title: 'Produtos | Vilma Natural Gourmet'
};

export default function ProdutosPage() {
  return (
    <main className="sitePage">
      <header className="siteNav">
        <Link href="/" className="siteBrand">
          <img src="/site/logo-vilma-square.jpg" alt="Vilma Natural Gourmet" />
          <div>
            <strong>Vilma Natural Gourmet</strong>
            <span>Produtos</span>
          </div>
        </Link>

        <nav>
          <Link href="/">Início</Link>
          <Link href="/fotos">Fotos</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="pageTitle">
        <span>Cardápio</span>
        <h1>Produtos disponíveis</h1>
        <p>Taxa de entrega: <b>{formatMoney(deliveryFee)}</b>. Entrega somente em Campos Altos - MG.</p>
      </section>

      <section className="siteProductGrid all">
        {products.map((product) => (
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
      </section>
    </main>
  );
}
