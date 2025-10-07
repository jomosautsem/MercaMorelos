import { Product, User, Order, Message, CartItem } from '../types';

// Let's create some mock data.

const mockProducts: Product[] = [
  // Ropa de Dama
  {
    id: '1',
    name: 'Vestido Floral de Verano',
    price: 49.99,
    imageUrl: 'https://picsum.photos/seed/dama1/400/400',
    category: 'dama',
    description: 'Un vestido ligero y fresco, perfecto para los días soleados. Con un estampado floral vibrante y un corte favorecedor.',
    stock: 15,
    isArchived: false,
  },
  {
    id: '2',
    name: 'Blusa de Seda Elegante',
    price: 39.50,
    imageUrl: 'https://picsum.photos/seed/dama2/400/400',
    category: 'dama',
    description: 'Blusa de seda con un tacto suave y un brillo sutil. Ideal para la oficina o una salida nocturna.',
    stock: 20,
    isArchived: false,
  },
  {
    id: '3',
    name: 'Jeans Skinny de Tiro Alto',
    price: 55.00,
    imageUrl: 'https://picsum.photos/seed/dama3/400/400',
    category: 'dama',
    description: 'Jeans ajustados que realzan la figura. El tejido elástico proporciona comodidad durante todo el día.',
    stock: 10,
    isArchived: false,
  },
  {
    id: '4',
    name: 'Falda Plisada Midi',
    price: 45.00,
    imageUrl: 'https://picsum.photos/seed/dama4/400/400',
    category: 'dama',
    description: 'Una falda midi versátil con un plisado delicado. Combínala con zapatillas o tacones para diferentes looks.',
    stock: 8,
    isArchived: false,
  },
  // Ropa de Niño
  {
    id: '5',
    name: 'Camiseta de Dinosaurios',
    price: 15.99,
    imageUrl: 'https://picsum.photos/seed/nino1/400/400',
    category: 'nino',
    description: 'Camiseta de algodón suave con un divertido estampado de dinosaurios que brilla en la oscuridad.',
    stock: 25,
    isArchived: false,
  },
  {
    id: '6',
    name: 'Sudadera con Capucha y Orejas',
    price: 25.00,
    imageUrl: 'https://picsum.photos/seed/nino2/400/400',
    category: 'nino',
    description: 'Sudadera cálida y acogedora con orejitas de oso en la capucha. Perfecta para los días fríos.',
    stock: 12,
    isArchived: false,
  },
  {
    id: '7',
    name: 'Pantalones Cargo Resistentes',
    price: 22.50,
    imageUrl: 'https://picsum.photos/seed/nino3/400/400',
    category: 'nino',
    description: 'Pantalones con múltiples bolsillos, ideales para las aventuras diarias de los más pequeños. Tejido duradero.',
    stock: 30,
    isArchived: false,
  },
  {
    id: '8',
    name: 'Vestido de Princesa con Tul',
    price: 35.00,
    imageUrl: 'https://picsum.photos/seed/nino4/400/400',
    category: 'nino',
    description: 'Un vestido de ensueño con una falda de tul brillante y detalles de lentejuelas. Ideal para fiestas y ocasiones especiales.',
    stock: 0,
    isArchived: true,
  },
  {
    id: '9',
    name: 'Chaqueta Vaquera Infantil',
    price: 30.00,
    imageUrl: 'https://picsum.photos/seed/nino5/400/400',
    category: 'nino',
    description: 'Una chaqueta vaquera clásica en tamaño infantil. Resistente y siempre a la moda.',
    stock: 18,
    isArchived: false,
  },
  {
    id: '10',
    name: 'Conjunto Deportivo de Algodón',
    price: 28.00,
    imageUrl: 'https://picsum.photos/seed/nino6/400/400',
    category: 'nino',
    description: 'Conjunto cómodo de sudadera y pantalón de chándal. Perfecto para jugar y estar cómodo en casa.',
    stock: 22,
    isArchived: false,
  }
];

// More mock data for users, orders, etc. can be added here.
const mockAdmin: User = {
    id: 'admin-user',
    firstName: 'Admin',
    paternalLastName: 'Merca',
    maternalLastName: 'Morelos',
    email: 'jomosanano@gmail.com',
    address: 'Admin Address 123',
    role: 'admin',
};

const mockCustomer: User = {
    id: 'customer-1',
    firstName: 'Juan',
    paternalLastName: 'Perez',
    maternalLastName: 'Gomez',
    email: 'juan@example.com',
    address: 'Calle Falsa 123, Colonia Centro',
    role: 'customer',
}

let mockUsers: User[] = [mockAdmin, mockCustomer];

let mockOrders: Order[] = [
    {
        id: 'order-1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        total: 89.49,
        status: 'Enviado',
        items: [
            { ...mockProducts[4], quantity: 1 },
            { ...mockProducts[1], quantity: 1 }
        ],
        shippingInfo: mockCustomer,
    },
    {
        id: 'order-2',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        total: 55.00,
        status: 'Entregado',
        items: [
            { ...mockProducts[2], quantity: 1 }
        ],
        shippingInfo: mockCustomer,
    }
];

let mockMessages: Message[] = [
    {
        id: 'msg-1',
        from: 'admin',
        fromId: 'admin-user',
        toId: 'customer-1',
        text: '¡Hola! ¿En qué podemos ayudarte?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        read: true,
    },
    {
        id: 'msg-2',
        from: 'customer',
        fromId: 'customer-1',
        toId: 'admin-user',
        text: 'Hola, tengo una pregunta sobre mi pedido.',
        timestamp: new Date(Date.now() - 59 * 60 * 1000).toISOString(),
        read: false,
    }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
    async getProducts(): Promise<Product[]> {
        await delay(500);
        return [...mockProducts].filter(p => !p.isArchived);
    },
    async getProduct(id: string): Promise<Product | undefined> {
        await delay(300);
        const product = mockProducts.find(p => p.id === id);
        return product && !product.isArchived ? product : undefined;
    },
    async login(email: string, pass: string): Promise<{user: User, token: string} | null> {
        await delay(500);
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        // For mock purposes, any password is valid for existing users
        if (user) { 
             return { user: {...user}, token: `mock-token-for-${user.id}`};
        }
        return null;
    },
    async register(userData: Omit<User, 'id' | 'role'>): Promise<{user: User, token: string} | null> {
        await delay(500);
        if(mockUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return null; // User exists
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            ...userData,
            role: 'customer'
        };
        mockUsers.push(newUser);
        return { user: newUser, token: `mock-token-for-${newUser.id}` };
    },
    async getMyOrders(userId: string): Promise<Order[]> {
        await delay(400);
        return mockOrders.filter(o => o.shippingInfo.id === userId);
    },
    async getAllOrders(): Promise<Order[]> {
         await delay(400);
         return [...mockOrders];
    },
    async getOrderDetail(orderId: string, userId: string, userRole: 'admin' | 'customer'): Promise<Order | null> {
        await delay(300);
        const order = mockOrders.find(o => o.id === orderId);
        if(!order) return null;
        if(userRole === 'admin' || order.shippingInfo.id === userId) {
            return {...order};
        }
        return null;
    },
    async placeOrder(userId: string, cart: CartItem[], shippingInfo: User, total: number): Promise<Order | null> {
        await delay(800);
        for (const item of cart) {
            const product = mockProducts.find(p => p.id === item.id);
            if (!product || product.stock < item.quantity) {
                console.error(`Not enough stock for ${item.name}`);
                return null;
            }
            product.stock -= item.quantity;
            if (product.stock <= 0) {
                product.isArchived = true;
            }
        }
        const newOrder: Order = {
            id: `order-${Date.now()}`,
            date: new Date().toISOString(),
            estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            total,
            status: 'Procesando',
            items: cart,
            shippingInfo,
        };
        mockOrders.unshift(newOrder);
        return newOrder;
    },
    async cancelOrder(orderId: string, userId: string): Promise<boolean> {
        await delay(400);
        const order = mockOrders.find(o => o.id === orderId && o.shippingInfo.id === userId);
        if (order && order.status === 'Procesando') {
            order.status = 'Cancelado';
            // Restock items
            for(const item of order.items) {
                const product = mockProducts.find(p => p.id === item.id);
                if (product) {
                    product.stock += item.quantity;
                    // Un-archive if it was archived and now has stock
                    if (product.stock > 0) {
                        product.isArchived = false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
        await delay(300);
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            return true;
        }
        return false;
    },
    async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
        await delay(500);
        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            ...productData,
            isArchived: productData.stock <= 0,
        };
        mockProducts.unshift(newProduct);
        return newProduct;
    },
    async updateProduct(updatedProduct: Product): Promise<Product | null> {
        await delay(500);
        const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
        if (index > -1) {
            const productToUpdate = { ...updatedProduct };
            if (productToUpdate.stock <= 0) {
                productToUpdate.isArchived = true;
            } else {
                productToUpdate.isArchived = false;
            }
            mockProducts[index] = productToUpdate;
            return { ...mockProducts[index] };
        }
        return null;
    },
    async deleteProduct(productId: string): Promise<boolean> {
        await delay(500);
        const productInOrders = mockOrders.some(order => order.items.some(item => item.id === productId));
        const index = mockProducts.findIndex(p => p.id === productId);

        if (index === -1) {
            return false;
        }

        if (productInOrders) {
            // Archive it (soft delete)
            mockProducts[index].isArchived = true;
        } else {
            // Delete it permanently
            mockProducts.splice(index, 1);
        }
        return true;
    },
    async getCustomers(): Promise<User[]> {
        await delay(400);
        return mockUsers.filter(u => u.role === 'customer');
    },
    async deleteCustomer(customerId: string): Promise<boolean> {
         await delay(500);
        const index = mockUsers.findIndex(u => u.id === customerId);
        if (index > -1) {
            mockUsers.splice(index, 1);
            return true;
        }
        return false;
    },
    async getMessages(userId: string): Promise<Message[]> {
        await delay(200);
        return mockMessages.filter(m => m.fromId === userId || m.toId === userId).map(m => {
            const fromUser = mockUsers.find(u => u.id === m.fromId);
            return {...m, from: fromUser?.role || 'customer' };
        });
    },
    async sendMessage(text: string, fromId: string, toId: string): Promise<Message> {
        await delay(250);
        const fromUser = mockUsers.find(u => u.id === fromId);
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            from: fromUser?.role || 'customer',
            fromId,
            toId,
            text,
            timestamp: new Date().toISOString(),
            read: false,
        };
        mockMessages.push(newMessage);
        return newMessage;
    },
    async markMessagesAsRead(userId: string, fromId: string): Promise<boolean> {
        await delay(100);
        mockMessages.forEach(m => {
            if (m.toId === userId && m.fromId === fromId) {
                m.read = true;
            }
        });
        return true;
    },
    async updateProfile(userId: string, profileData: Partial<User>): Promise<User> {
        await delay(400);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error("User not found");
        }
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
        return { ...mockUsers[userIndex] };
    },
    async changePassword(userId: string, current: string, newPass: string): Promise<{ msg: string }> {
        await delay(500);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) {
            throw new Error("User not found");
        }
        // In mock, we assume current password is always correct
        console.log(`Mock: Changed password for ${user.email}`);
        return { msg: 'Password updated successfully' };
    }
}