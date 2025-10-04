
import { Product } from '../types';

const products: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral de Verano',
    price: 49.99,
    imageUrl: 'https://picsum.photos/seed/dama1/400/500',
    category: 'dama',
    description: 'Un vestido ligero y fresco perfecto para los días soleados. Hecho con 100% algodón orgánico.'
  },
  {
    id: '2',
    name: 'Blusa de Seda Elegante',
    price: 65.00,
    imageUrl: 'https://picsum.photos/seed/dama2/400/500',
    category: 'dama',
    description: 'Blusa de seda con un corte moderno y sofisticado, ideal para la oficina o eventos especiales.'
  },
  {
    id: '3',
    name: 'Jeans Skinny de Tiro Alto',
    price: 75.50,
    imageUrl: 'https://picsum.photos/seed/dama3/400/500',
    category: 'dama',
    description: 'Jeans cómodos y elásticos que se ajustan perfectamente a tu figura. Un básico indispensable.'
  },
  {
    id: '4',
    name: 'Suéter de Cachemira',
    price: 120.00,
    imageUrl: 'https://picsum.photos/seed/dama4/400/500',
    category: 'dama',
    description: 'Suéter suave y cálido de pura cachemira, un lujo para los días fríos.'
  },
  {
    id: '5',
    name: 'Conjunto de Pijama de Algodón',
    price: 35.99,
    imageUrl: 'https://picsum.photos/seed/nino1/400/500',
    category: 'nino',
    description: 'Pijama de dos piezas con divertido estampado de dinosaurios, hecho de algodón suave para un sueño confortable.'
  },
  {
    id: '6',
    name: 'Camiseta Gráfica de Superhéroe',
    price: 19.99,
    imageUrl: 'https://picsum.photos/seed/nino2/400/500',
    category: 'nino',
    description: 'Camiseta de algodón con el logo de su superhéroe favorito. ¡Perfecta para la aventura diaria!'
  },
  {
    id: '7',
    name: 'Pantalones Cargo Resistentes',
    price: 29.50,
    imageUrl: 'https://picsum.photos/seed/nino3/400/500',
    category: 'nino',
    description: 'Pantalones cargo con múltiples bolsillos, ideales para jugar y explorar. Hechos para durar.'
  },
  {
    id: '8',
    name: 'Chamarra Impermeable',
    price: 55.00,
    imageUrl: 'https://picsum.photos/seed/nino4/400/500',
    category: 'nino',
    description: 'Chamarra ligera e impermeable con capucha, perfecta para los días de lluvia y viento.'
  },
];

const LATENCY = 500;

export const getProducts = (category?: 'dama' | 'nino'): Promise<Product[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (category) {
        resolve(products.filter(p => p.category === category));
      } else {
        resolve(products);
      }
    }, LATENCY);
  });
};

export const getProductById = (id: string): Promise<Product | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(products.find(p => p.id === id));
        }, LATENCY);
    });
};
