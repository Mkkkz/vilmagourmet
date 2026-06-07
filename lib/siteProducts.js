export const products = [
  {
    id: 'grego-morango-250g',
    name: 'Iogurte Grego com Geleia de Morango',
    size: 'Pote de 250g',
    price: 15.00,
    description: 'Iogurte grego artesanal com geleia de morango, cremoso e feito com carinho.',
    image: '/site/grego-morango-novo.jpg'
  },
  {
    id: 'grego-morango-150g',
    name: 'Iogurte Grego com Geleia de Morango',
    size: 'Pote de 150g',
    price: 10.00,
    description: 'Versão menor do iogurte grego artesanal com geleia de morango.',
    image: '/site/grego-morango-novo.jpg'
  },
  {
    id: 'tradicional-morango-200ml',
    name: 'Iogurte Artesanal Tradicional Cremoso Morango',
    size: '200ml',
    price: 7.00,
    description: 'Iogurte artesanal tradicional cremoso sabor morango.',
    image: '/site/tradicional-morango-novo.jpg'
  },
  {
    id: 'grego-dois-amores-150g',
    name: 'Iogurte Grego Dois Amores com Geleia de Morango e Granola',
    size: '150g',
    price: 13.00,
    description: 'Iogurte grego dois amores com geleia de morango e granola.',
    image: '/site/dois-amores-novo.jpg'
  },
  {
    id: 'grego-dois-amores-250g',
    name: 'Iogurte Grego Dois Amores com Geleia de Morango e Granola',
    size: '250g',
    price: 18.00,
    description: 'Versão maior do iogurte grego dois amores com geleia de morango e granola.',
    image: '/site/dois-amores-novo.jpg'
  },
  {
    id: 'geleia-morango-150g',
    name: 'Geleia de Morango Artesanal',
    size: '150g',
    price: 12.00,
    description: 'Geleia de morango artesanal, preparada com carinho para acompanhar seus momentos especiais.',
    image: '/site/geleia-morango.jpg'
  },
  {
    id: 'geleia-morango-250g',
    name: 'Geleia de Morango Artesanal',
    size: '250g',
    price: 19.00,
    description: 'Pote maior de geleia de morango artesanal, ideal para compartilhar em família.',
    image: '/site/geleia-morango-2.jpg'
  }
];

export const deliveryFee = 4.00;
export const whatsappNumber = '5537998057323';

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function getProduct(id) {
  return products.find((product) => product.id === id);
}

export function whatsappLink(product) {
  const message = product
    ? `Olá, Vilma! Vim pelo site e quero pedir: ${product.name} - ${product.size} - ${formatMoney(product.price)}.`
    : 'Olá, Vilma! Vim pelo site e gostaria de fazer um pedido.';
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
