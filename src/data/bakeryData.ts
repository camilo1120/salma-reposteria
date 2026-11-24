export type DessertMode = 'cookie' | 'cupcake' | 'cake';

export interface CookieFlavor {
  id: string;
  name: string;
  shortTag: string;
  description: string;
  price: number;
  image: string;
  doughColor: string;
  doughEdgeColor: string;
  accentColor: string;
  defaultToppings: string[];
  defaultFilling: string;
  popular?: boolean;
}

export interface BoxPackage {
  id: string;
  name: string;
  count: number;
  price: number;
  unitLabel: string;
  description: string;
  badge?: string;
  savingsNote?: string;
  highlight?: boolean;
}

export interface StudioBase {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  color: string;
  edgeColor: string;
  textureDotColor: string;
  image: string;
}

export interface StudioFilling {
  id: string;
  name: string;
  price: number;
  color: string;
  highlight: string;
  image?: string;
}

export interface StudioFrosting {
  id: string;
  name: string;
  price: number;
  color: string;
  shadowColor: string;
  accentColor?: string;
  style?: 'smooth' | 'rosettes-arequipe' | 'drip-choc' | 'lambeth';
  cakeImage: string;
  cupcakeImage: string;
}

export interface StudioTopping {
  id: string;
  name: string;
  price: number;
  color: string;
  secondaryColor?: string;
  pieceImage: string;
  trayImage: string;
  isWide?: boolean;
  kind:
    | 'choc-chunk'
    | 'white-chunk'
    | 'oreo-piece'
    | 'biscolata'
    | 'lime-zest'
    | 'gold-pearls'
    | 'cherry'
    | 'red-crumbs'
    | 'drizzle-choc'
    | 'drizzle-arequipe'
    | 'klim-dust';
  modes: DessertMode[];
}

export interface CakeSizeOption {
  id: string;
  name: string;
  portions: string;
  price: number;
  diameterScale: number;
}

export interface PlacedTopping {
  uid: string;
  toppingId: string;
  x: number; // percentage 12..88 inside dessert disk
  y: number; // percentage 12..88 inside dessert disk
  rotation: number;
  scale: number;
}

export interface OrderItem {
  id: string;
  category: 'cookie' | 'cupcake' | 'cake' | 'box' | 'cuchareable';
  title: string;
  subtitle: string;
  details: string[];
  unitPrice: number;
  quantity: number;
  bakeGrade?: string;
  cakeMessage?: string;
  referencePhotoDataUrl?: string;
  referencePhotoName?: string;
  previewImage?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  location: string;
  platform: 'Instagram' | 'WhatsApp';
  rating: number;
  text: string;
  productOrdered: string;
  image: string;
  dateLabel: string;
}

export const SALMA_CONTACT = {
  brandName: 'Salma Repostería',
  whatsappNumber: '573001234567', // Número demo fácilmente editable para el cliente
  whatsappDisplay: '+57 300 123 4567',
  instagramHandle: '@salma.reposteria_',
  instagramUrl: 'https://www.instagram.com/salma.reposteria_/',
  tiktokHandle: '@salma.reposteria_',
  tiktokUrl: 'https://www.tiktok.com/@salma.reposteria_',
  location: 'Floridablanca / Bucaramanga, Santander',
  hoursWeekday: 'Lunes a Sábado: 9:00 a.m. – 7:00 p.m.',
  hoursSunday: 'Domingos y Festivos: 10:00 a.m. – 4:00 p.m.',
  cakeNotice: 'Tortas personalizadas sobre pedido con 48h de anticipación.',
  deliveryFee: 6000,
};

export function formatCOP(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('es-CO');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${SALMA_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const COOKIE_FLAVORS: CookieFlavor[] = [
  {
    id: 'chips',
    name: 'Chips',
    shortTag: 'Clásica NY',
    description:
      'La clásica infalible, masa suave cargada de trozos de chocolate que se derriten en cada mordisco.',
    price: 5000,
    image: './images/cookie-chips.jpg',
    doughColor: '#D5A164',
    doughEdgeColor: '#9E6631',
    accentColor: '#4A2512',
    defaultToppings: ['choc-chunk', 'choc-chunk', 'choc-chunk', 'drizzle-choc'],
    defaultFilling: 'nutella',
    popular: true,
  },
  {
    id: 'oreo',
    name: 'Oreo',
    shortTag: 'Cremosa & Crunch',
    description: 'Masa con trozos de galleta Oreo y un toque cremoso irresistible.',
    price: 5000,
    image: './images/cookie-oreo.jpg',
    doughColor: '#D9BC98',
    doughEdgeColor: '#A2815E',
    accentColor: '#2B2523',
    defaultToppings: ['oreo-piece', 'oreo-piece', 'white-chunk'],
    defaultFilling: 'oreo-cream',
  },
  {
    id: 'triple-chocolate',
    name: 'Triple Chocolate',
    shortTag: 'Puro Cacao',
    description:
      'Para los verdaderos amantes del cacao: masa intensa de chocolate con combinación de chocolates por dentro y por fuera.',
    price: 5000,
    image: './images/cookie-triple-choc.jpg',
    doughColor: '#562B1A',
    doughEdgeColor: '#31150B',
    accentColor: '#F2E5D5',
    defaultToppings: ['choc-chunk', 'white-chunk', 'drizzle-choc'],
    defaultFilling: 'nutella',
    popular: true,
  },
  {
    id: 'klimon',
    name: 'Klimon',
    shortTag: 'Favorita de la Casa',
    description:
      'La combinación perfecta entre el toque cítrico del limón y la cremosidad dulce de la leche Klim.',
    price: 5000,
    image: './images/cookie-klimon.jpg',
    doughColor: '#E5C689',
    doughEdgeColor: '#BA934F',
    accentColor: '#76A63E',
    defaultToppings: ['klim-dust', 'lime-zest', 'white-chunk'],
    defaultFilling: 'klim-cream',
    popular: true,
  },
  {
    id: 'biscolata',
    name: 'Biscolata',
    shortTag: 'Crujiente & Dulce',
    description: 'Suave, dulce y con ese sabor único y crujiente de Biscolata.',
    price: 5000,
    image: './images/cookie-biscolata.jpg',
    doughColor: '#D7A36B',
    doughEdgeColor: '#A16935',
    accentColor: '#9C4D22',
    defaultToppings: ['biscolata', 'biscolata', 'drizzle-arequipe'],
    defaultFilling: 'arequipe',
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    shortTag: 'Icónica Salma',
    description:
      'Nuestra icónica masa roja aterciopelada con un toque suave de cacao y chips blancos.',
    price: 5000,
    image: './images/cookie-red-velvet.jpg',
    doughColor: '#9C252C',
    doughEdgeColor: '#661319',
    accentColor: '#FFF5E8',
    defaultToppings: ['white-chunk', 'white-chunk', 'red-crumbs'],
    defaultFilling: 'cream-cheese',
    popular: true,
  },
];

export const BOX_PACKAGES: BoxPackage[] = [
  {
    id: 'unit',
    name: 'Galleta Individual',
    count: 1,
    price: 5000,
    unitLabel: '$5.000 c/u',
    description: 'Perfecta para darte ese gustico del día recién horneado.',
  },
  {
    id: 'box-3',
    name: 'Caja x 3 Galletas',
    count: 3,
    price: 18000,
    unitLabel: 'Empaque de regalo incluido',
    description: 'Elige tus sabores favoritos en nuestra caja rosa con papel vichy.',
    badge: 'Regalo Clásico',
  },
  {
    id: 'box-4',
    name: 'Caja x 4 Galletas',
    count: 4,
    price: 24000,
    unitLabel: 'Caja de presentación Salma',
    description: 'Ideal para compartir o regalar con dedicatoria especial.',
    badge: 'Más Pedida',
    highlight: true,
  },
  {
    id: 'box-6',
    name: 'Caja x 6 Galletas',
    count: 6,
    price: 35000,
    unitLabel: 'Ahorra + Caja Premium',
    description: 'La favorita para antojos grandes o regalos especiales. ¡Prueba los 6 sabores!',
    badge: 'Mejor Valor',
    savingsNote: 'Los 6 sabores completos',
  },
];

export const STUDIO_DOUGHS: Record<DessertMode, StudioBase[]> = {
  cookie: [
    { id: 'chips', name: 'Chips Vainilla', subtitle: 'Mantequilla dorada', price: 5000, color: '#D7A367', edgeColor: '#9E6630', textureDotColor: '#8B5424', image: './images/studio/cookie-chips.png' },
    { id: 'oreo', name: 'Masa Oreo', subtitle: 'Con migas oscuras', price: 5000, color: '#DBC2A2', edgeColor: '#A18261', textureDotColor: '#2E2623', image: './images/studio/cookie-oreo.png' },
    { id: 'triple-chocolate', name: 'Triple Cacao', subtitle: 'Chocolate intenso', price: 5000, color: '#582C1B', edgeColor: '#31150B', textureDotColor: '#250D06', image: './images/studio/cookie-triple-choc.png' },
    { id: 'klimon', name: 'Masa Klimon', subtitle: 'Limón y leche Klim', price: 5000, color: '#E8CC90', edgeColor: '#B8944D', textureDotColor: '#7DA641', image: './images/studio/cookie-klimon.png' },
    { id: 'biscolata', name: 'Biscolata', subtitle: 'Toque caramelo', price: 5000, color: '#D39C62', edgeColor: '#98612C', textureDotColor: '#7A421D', image: './images/studio/cookie-biscolata.png' },
    { id: 'red-velvet', name: 'Red Velvet', subtitle: 'Roja aterciopelada', price: 5000, color: '#9D262D', edgeColor: '#661218', textureDotColor: '#540B10', image: './images/studio/cookie-red-velvet.png' },
  ],
  cupcake: [
    { id: 'vanilla-cup', name: 'Ponqué Vainilla', subtitle: 'Esponjoso artesanal', price: 6500, color: '#F3D69C', edgeColor: '#D4AB65', textureDotColor: '#C49449', image: './images/studio/cupcake-vanilla.png' },
    { id: 'red-velvet-cup', name: 'Red Velvet', subtitle: 'Cacao suave carmesí', price: 7000, color: '#A3272F', edgeColor: '#6B131A', textureDotColor: '#560D12', image: './images/studio/cupcake-pink.png' },
    { id: 'choc-cup', name: 'Chocolate Húmedo', subtitle: 'Cacao colombiano', price: 7000, color: '#582C1B', edgeColor: '#34170D', textureDotColor: '#281007', image: './images/studio/cupcake-choc.png' },
    { id: 'klimon-cup', name: 'Limón Klim', subtitle: 'Fresco y cremoso', price: 7000, color: '#EFE0A1', edgeColor: '#C5B062', textureDotColor: '#84AF46', image: './images/studio/cupcake-velvet.png' },
  ],
  cake: [
    { id: 'vanilla-cake', name: 'Bizcocho Vainilla', subtitle: 'Esponjoso tradicional', price: 0, color: '#F4DCA9', edgeColor: '#D9B16C', textureDotColor: '#C79B52', image: './images/studio/cake-white.png' },
    { id: 'red-velvet-cake', name: 'Bizcocho Red Velvet', subtitle: 'El más pedido', price: 5000, color: '#A3272F', edgeColor: '#6F141B', textureDotColor: '#590C12', image: './images/studio/cake-velvet.png' },
    { id: 'choc-cake', name: 'Chocolate Húmedo', subtitle: 'Intenso y suave', price: 5000, color: '#572A19', edgeColor: '#36180D', textureDotColor: '#250D06', image: './images/studio/cake-choc.png' },
    { id: 'naranja-amapola', name: 'Naranja & Amapola', subtitle: 'Aromático artesanal', price: 4000, color: '#F2C572', edgeColor: '#CA933E', textureDotColor: '#332C2A', image: './images/studio/cake-cream.png' },
  ],
};

export const CAKE_SIZES: CakeSizeOption[] = [
  { id: 'bento', name: 'Mini Bento Cake', portions: '4 – 6 porciones', price: 65000, diameterScale: 0.84 },
  { id: 'medium', name: 'Torta Clásica', portions: '10 – 12 porciones', price: 98000, diameterScale: 0.94 },
  { id: 'party', name: 'Torta Celebración', portions: '18 – 22 porciones', price: 145000, diameterScale: 1.04 },
];

export const STUDIO_FILLINGS: StudioFilling[] = [
  { id: 'none', name: 'Masa pura (Clásica)', price: 0, color: 'transparent', highlight: 'transparent' },
  { id: 'nutella', name: 'Centro Nutella', price: 1500, color: '#4B2414', highlight: '#79432B', image: './images/studio/filling-nutella.png' },
  { id: 'arequipe', name: 'Arequipe Artesanal', price: 1000, color: '#B56327', highlight: '#DF9550', image: './images/studio/filling-arequipe.png' },
  { id: 'cream-cheese', name: 'Crema de Queso', price: 1500, color: '#FFF7EA', highlight: '#FFFFFF', image: './images/studio/filling-cream.png' },
  { id: 'klim-cream', name: 'Crema Leche Klim', price: 1000, color: '#FBF0CC', highlight: '#FFFDF4', image: './images/studio/top-klim-dust.png' },
  { id: 'oreo-cream', name: 'Crema Oreo', price: 1500, color: '#F2ECE7', highlight: '#FFFFFF', image: './images/studio/filling-oreo.png' },
];

export const CUPCAKE_WRAPPERS = [
  { id: 'gingham', name: 'Rosa Salma', color: '#F6B2C3', stripe: '#FFF1F5' },
  { id: 'gold', name: 'Dorado Fiesta', color: '#E3B45A', stripe: '#F7DC9F' },
  { id: 'cocoa', name: 'Cacao Kraft', color: '#6E3C26', stripe: '#8C5237' },
  { id: 'velvet', name: 'Rojo Velvet', color: '#B74347', stripe: '#D66B6F' },
];

export const STUDIO_FROSTINGS: StudioFrosting[] = [
  { id: 'rosettes-arequipe', name: 'Rosetones Crema & Arequipe', price: 4000, color: '#FFFDFB', shadowColor: '#E9DDD4', accentColor: '#B86122', style: 'rosettes-arequipe', cakeImage: './images/studio/cake-arequipe.png', cupcakeImage: './images/studio/cupcake-velvet.png' },
  { id: 'buttercream-vanilla', name: 'Buttercream Vainilla', price: 0, color: '#FFF9F0', shadowColor: '#EADBC9', style: 'smooth', cakeImage: './images/studio/cake-white.png', cupcakeImage: './images/studio/cupcake-vanilla.png' },
  { id: 'cream-cheese-frost', name: 'Queso Crema Salma', price: 3000, color: '#FFF6E8', shadowColor: '#E5D3BD', style: 'smooth', cakeImage: './images/studio/cake-cream.png', cupcakeImage: './images/studio/cupcake-vanilla.png' },
  { id: 'rose-pink', name: 'Rosa Pastel Vintage', price: 3500, color: '#FAD1D8', shadowColor: '#E4A8B4', accentColor: '#FFF5F7', style: 'lambeth', cakeImage: './images/studio/cake-pink.png', cupcakeImage: './images/studio/cupcake-pink.png' },
  { id: 'ganache-drip', name: 'Ganache & Drip Cacao', price: 5000, color: '#FFF8F2', shadowColor: '#E5D4C6', accentColor: '#482012', style: 'drip-choc', cakeImage: './images/studio/cake-choc.png', cupcakeImage: './images/studio/cupcake-choc.png' },
];

export const STUDIO_TOPPINGS: StudioTopping[] = [
  {
    id: 'choc-chunk',
    name: 'Chunks Semiamargo',
    price: 800,
    color: '#3F1D10',
    secondaryColor: '#69341F',
    pieceImage: './images/studio/top-choc-chunk.png',
    trayImage: './images/studio/tray-choc-chunk.jpg',
    kind: 'choc-chunk',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'white-chunk',
    name: 'Chips Blancos',
    price: 800,
    color: '#FFF5DF',
    secondaryColor: '#EBD6AE',
    pieceImage: './images/studio/top-white-chunk.png',
    trayImage: './images/studio/tray-white-chunk.jpg',
    kind: 'white-chunk',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'oreo-piece',
    name: 'Trozos de Oreo',
    price: 1000,
    color: '#252120',
    secondaryColor: '#F7F3EE',
    pieceImage: './images/studio/top-oreo-piece.png',
    trayImage: './images/studio/tray-oreo-piece.jpg',
    kind: 'oreo-piece',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'biscolata',
    name: 'Galleta Biscolata',
    price: 1200,
    color: '#C77A3B',
    secondaryColor: '#5C2C16',
    pieceImage: './images/studio/top-biscolata.png',
    trayImage: './images/studio/tray-biscolata.jpg',
    kind: 'biscolata',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'lime-zest',
    name: 'Ralladura Limón',
    price: 500,
    color: '#6CA232',
    secondaryColor: '#A6D35C',
    pieceImage: './images/studio/top-lime-zest.png',
    trayImage: './images/studio/tray-lime-zest.jpg',
    kind: 'lime-zest',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'klim-dust',
    name: 'Leche Klim',
    price: 700,
    color: '#FFF6D6',
    secondaryColor: '#F0DFAA',
    pieceImage: './images/studio/top-klim-dust.png',
    trayImage: './images/studio/tray-klim-dust.jpg',
    kind: 'klim-dust',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'drizzle-choc',
    name: 'Hilos Chocolate',
    price: 900,
    color: '#461F11',
    secondaryColor: '#753B24',
    pieceImage: './images/studio/top-drizzle-choc.png',
    trayImage: './images/studio/tray-drizzle-choc.jpg',
    isWide: true,
    kind: 'drizzle-choc',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'drizzle-arequipe',
    name: 'Hilos Arequipe',
    price: 900,
    color: '#BD6726',
    secondaryColor: '#E19A56',
    pieceImage: './images/studio/top-drizzle-arequipe.png',
    trayImage: './images/studio/tray-drizzle-arequipe.jpg',
    isWide: true,
    kind: 'drizzle-arequipe',
    modes: ['cookie', 'cupcake', 'cake'],
  },
  {
    id: 'gold-pearls',
    name: 'Perlas Doradas',
    price: 1200,
    color: '#E5B454',
    secondaryColor: '#FFF0B8',
    pieceImage: './images/studio/top-gold-pearls.png',
    trayImage: './images/studio/tray-gold-pearls.jpg',
    kind: 'gold-pearls',
    modes: ['cupcake', 'cake'],
  },
  {
    id: 'cherry',
    name: 'Cereza Maraschino',
    price: 1200,
    color: '#B81C2C',
    secondaryColor: '#FF6B79',
    pieceImage: './images/studio/top-cherry.png',
    trayImage: './images/studio/tray-cherry.jpg',
    kind: 'cherry',
    modes: ['cupcake', 'cake'],
  },
  {
    id: 'red-crumbs',
    name: 'Migas Red Velvet',
    price: 700,
    color: '#9F222A',
    secondaryColor: '#C8424A',
    pieceImage: './images/studio/top-red-crumbs.png',
    trayImage: './images/studio/tray-red-crumbs.jpg',
    kind: 'red-crumbs',
    modes: ['cookie', 'cupcake', 'cake'],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    author: 'Valentina Gómez',
    location: 'Cañaveral, Floridablanca',
    platform: 'Instagram',
    rating: 5,
    text: '¡No puedo con la Klimon y la Red Velvet! Llegaron tibiecitas, crujientes por fuera y súper suaves por dentro. El empaque de cuadritos rosa es lo más lindo para regalar.',
    productOrdered: 'Caja x 6 Galletas Surtidas',
    image: './images/real-cookies-box.jpg',
    dateLabel: 'Hace 3 días',
  },
  {
    id: 't2',
    author: 'Andrés Felipe R.',
    location: 'Cabecera, Bucaramanga',
    platform: 'WhatsApp',
    rating: 5,
    text: 'Pedí la torta personalizada con rosetones de arequipe para el cumpleaños de mi mamá y quedó IDÉNTICA a la foto que envié. Todos preguntaron dónde la encargamos 😍',
    productOrdered: 'Torta Personalizada Arequipe & Crema',
    image: './images/real-cake.jpg',
    dateLabel: 'Hace 1 semana',
  },
  {
    id: 't3',
    author: 'Laura Sofía Mejía',
    location: 'Lagos del Cacique, Bucaramanga',
    platform: 'Instagram',
    rating: 5,
    text: 'El cuchareable de Red Velvet es literalmente el cielo en un tarrito. El queso crema no empalaga nada y el bizcocho es súper húmedo. Ya voy por el tercero este mes.',
    productOrdered: 'Cuchareable de Red Velvet',
    image: './images/cuchareable-red-velvet.jpg',
    dateLabel: 'Hace 5 días',
  },
  {
    id: 't4',
    author: 'Daniela Ortiz',
    location: 'Floridablanca, Santander',
    platform: 'WhatsApp',
    rating: 5,
    text: 'La de Triple Chocolate y Biscolata son una locura total. Me encantó poder armar mi caja rápido y recibir el pedido puntualísimo para la oficina.',
    productOrdered: 'Caja x 4 Galletas',
    image: './images/hero-cookies.jpg',
    dateLabel: 'Hace 2 semanas',
  },
];
