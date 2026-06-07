import Link from 'next/link';

const photos = [
  { src: '/site/vilma-inicio.jpg', title: 'Vilma Natural Gourmet' },
  { src: '/site/guerreira.jpeg', title: 'A guerreira do iogurte artesanal' },
  { src: '/site/logo-vilma-legivel.jpg', title: 'Logo Vilma Iogurte Artesanal' },
  { src: '/site/historia-completa.jpg', title: 'Minha história' },
  { src: '/site/grego-morango-novo.jpg', title: 'Iogurte grego com geleia de morango' },
  { src: '/site/tradicional-morango-novo.jpg', title: 'Iogurte tradicional morango' },
  { src: '/site/dois-amores-novo.jpg', title: 'Iogurte grego dois amores' },
  { src: '/site/geleia-morango.jpg', title: 'Geleia de morango artesanal' },
  { src: '/site/geleia-valores.jpg', title: 'Valores da geleia de morango' }
];

export const metadata = {
  title: 'Fotos | Vilma Natural Gourmet'
};

export default function FotosPage() {
  return (
    <main className="sitePage">
      <header className="siteNav">
        <Link href="/" className="siteBrand">
          <img src="/site/logo-vilma-square.jpg" alt="Vilma Natural Gourmet" />
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
