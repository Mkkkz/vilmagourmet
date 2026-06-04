import './globals.css';
export const metadata = { title:'Vilma Natural Gourmet', description:'Iogurtes artesanais feitos com carinho, muito mais que sabor, um ótimo probiótico para saúde.', icons:{ icon:'/logo.png', shortcut:'/logo.png', apple:'/logo.png' } };
export default function RootLayout({ children }) { return <html lang="pt-BR"><body>{children}</body></html>; }
