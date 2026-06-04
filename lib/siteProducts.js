export const products = [
  {
    id: 'grego-morango-250g',
    name: 'Iogurte Grego com Geleia de Morango',
    size: 'Pote de 250g',
    price: 15.00,
    description: 'Iogurte grego artesanal com geleia de morango, cremoso e feito com carinho.',
    image: '/site/cardapio.png'
  },
  {
    id: 'grego-morango-150g',
    name: 'Iogurte Grego com Geleia de Morango',
    size: 'Pote de 150g',
    price: 10.00,
    description: 'Versão menor do iogurte grego artesanal com geleia de morango.',
    image: '/site/cardapio.png'
  },
  {
    id: 'tradicional-morango-200ml',
    name: 'Iogurte Artesanal Tradicional Cremoso Morango',
    size: '200ml',
    price: 7.00,
    description: 'Iogurte artesanal tradicional cremoso sabor morango.',
    image: '/site/iogurte-tradicional.png'
  },
  {
    id: 'grego-dois-amores-150g',
    name: 'Iogurte Grego Dois Amores com Geleia de Morango e Granola',
    size: '150g',
    price: 13.00,
    description: 'Iogurte grego dois amores com geleia de morango e granola.',
    image: '/site/iogurte-grego.png'
  },
  {
    id: 'grego-dois-amores-250g',
    name: 'Iogurte Grego Dois Amores com Geleia de Morango e Granola',
    size: '250g',
    price: 18.00,
    description: 'Versão maior do iogurte grego dois amores com geleia de morango e granola.',
    image: '/site/iogurte-grego.png'
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
