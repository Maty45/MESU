export type ProductCategory = 'wheelchair' | 'walker' | 'bath' | 'other';
export type OperationType = 'donation' | 'rental' | 'sale';

export interface Product {
  id: string;
  title: string;
  description?: string;
  ownerName: string;
  ownerId?: string;
  operationType?: OperationType;
  condition?: 'new' | 'like-new' | 'good' | 'fair';
  location?: string;
  category: ProductCategory;
  status: 'available' | 'unavailable' | string;
  images: string[];
  createdAt: string;
  pricePerDay?: number;
  price?: number;
}

export interface Operation {
  id: string;
  productId: string;
  ownerId?: string;
  clientId?: string;
  clientName?: string;
  productTitle?: string;
  ownerName?: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  status?: 'pending' | 'active' | 'completed' | 'cancelled' | string;
  date?: string;
  type: OperationType;
}

export interface Report {
  id: string;
  status: 'pending' | 'reviewed' | 'resolved' | string;
  createdAt: string;
  reason: string;
  reporterName: string;
  description?: string;
}

export const categoryLabels: Record<ProductCategory, string> = {
  wheelchair: 'Sillas de ruedas',
  walker: 'Andadores',
  bath: 'Ayudas de baño',
  other: 'Otros',
};

export const conditionLabels: Record<NonNullable<Product['condition']>, string> = {
  'new': 'Nuevo',
  'like-new': 'Como nuevo',
  'good': 'Buen estado',
  'fair': 'Estado aceptable',
};

export const operationTypeLabels: Record<OperationType, string> = {
  donation: 'Donación',
  rental: 'Alquiler',
  sale: 'Venta',
};

export const mockProducts: Product[] = [
  {
    id: 'p1',
    title: 'Silla de ruedas plegable',
    description: 'Silla ligera, ideal para transporte.',
    ownerName: 'María González',
    ownerId: 'owner1',
    operationType: 'rental',
    condition: 'good',
    location: 'Buenos Aires',
    category: 'wheelchair',
    status: 'available',
    images: ['/images/wheelchair.jpg'],
    createdAt: '2025-01-10',
    pricePerDay: 300,
  },
  {
    id: 'p2',
    title: 'Andador con ruedas',
    description: 'Andador ajustable con frenos.',
    ownerName: 'Carlos Rodríguez',
    ownerId: 'owner1',
    operationType: 'sale',
    condition: 'like-new',
    location: 'Córdoba',
    category: 'walker',
    status: 'available',
    images: ['/images/walker.jpg'],
    createdAt: '2025-02-20',
    price: 12000,
  },
];

export const mockOperations: Operation[] = [
  {
    id: 'o1',
    productId: 'p1',
    ownerId: 'owner1',
    clientId: 'client1',
    clientName: 'Juan Pérez',
    productTitle: 'Silla de ruedas plegable',
    ownerName: 'María González',
    startDate: '2025-05-01',
    endDate: '2025-05-10',
    amount: 3000,
    status: 'active',
    date: '2025-05-01',
    type: 'rental',
  },
  {
    id: 'o2',
    productId: 'p2',
    ownerId: 'owner1',
    clientId: 'client1',
    clientName: 'Laura Fernández',
    productTitle: 'Andador con ruedas',
    ownerName: 'Carlos Rodríguez',
    startDate: '2025-04-10',
    endDate: '2025-04-12',
    amount: 0,
    status: 'completed',
    date: '2025-04-10',
    type: 'sale',
  },
  {
    id: 'o3',
    productId: 'p1',
    ownerId: 'owner1',
    clientId: 'client2',
    clientName: 'Mariana López',
    productTitle: 'Silla de ruedas plegable',
    ownerName: 'María González',
    startDate: '2025-06-01',
    endDate: '2025-06-05',
    amount: 1500,
    status: 'pending',
    date: '2025-06-01',
    type: 'rental',
  },
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    status: 'pending',
    createdAt: '2025-04-01',
    reason: 'Producto en mal estado',
    reporterName: 'Ana Martínez',
    description: 'El producto no coincide con la descripción.',
  },
];
