import Link from 'next/link';

const photos = [
  { src: '/site/guerreira.jpeg', title: 'A guerreira do iogurte artesanal' },
  { src: '/site/historia.jpeg', title: 'História Vilma Natural Gourmet' },
  { src: '/site/cardapio.png', title: 'Cardápio de iogurtes artesanais' },
  { src: '/site/iogurte-tradicional.png', title: 'Iogurte tradicional morango' },
  { src: '/site/iogurte-grego.png', title: 'Iogurte grego dois amores' }
];

export const metadata = {
  title: 'Fotos | Vilma Natural Gourmet'
};

export default function FotosPage() {
  return (
    <main className="sitePage">
      <header className="siteNav">
        <Link href="/" className="siteBrand">
          <img src="/logo.png" alt="Vilma Natural Gourmet" />
          <div>
            <strong>Vilma Natural Gourmet</strong>
            <span>Fotos</span>
          </div>
        </Link>

        <nav>
          <Link href="/">Início</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="pageTitle">
        <span>Galeria</span>
        <h1>Fotos dos produtos</h1>
        <p>Algumas imagens para apresentar a história e os iogurtes artesanais.</p>
      </section>

      <section className="photoGrid">
        {photos.map((photo) => (
          <article key={photo.src}>
            <img src={photo.src} alt={photo.title} />
            <h3>{photo.title}</h3>
          </article>
        ))}
      </section>
    </main>
  );
}
