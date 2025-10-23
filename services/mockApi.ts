import { Product, User, Order, Message, CartItem, Review, Collection } from '../types';

const mockCollections: Collection[] = [
  { id: 'col1', name: 'Vestidos', icon: '👗', parentCategory: 'dama' },
  { id: 'col2', name: 'Blusas', icon: '👚', parentCategory: 'dama' },
  { id: 'col3', name: 'Jeans Dama', icon: '👖', parentCategory: 'dama' },
  { id: 'col7', name: 'Accesorios Dama', icon: '👜', parentCategory: 'dama' },
  { id: 'col4', name: 'Playeras Kids', icon: '👕', parentCategory: 'kids' },
  { id: 'col5', name: 'Pantalones Kids', icon: '👖', parentCategory: 'kids' },
  { id: 'col6', name: 'Sudaderas Kids', icon: '🧥', parentCategory: 'kids' },
  { id: 'col8', name: 'Camisas Caballero', icon: '👔', parentCategory: 'caballero' },
  { id: 'col9', name: 'Pantalones Caballero', icon: '👖', parentCategory: 'caballero' },
  { id: 'col10', name: 'Zapatos Caballero', icon: '👞', parentCategory: 'caballero' },
];

const mockProducts: Product[] = [
  // Ropa de Dama
  {
    id: '1',
    name: 'Vestido Floral de Verano',
    price: 49.99,
    imageUrl: 'https://picsum.photos/seed/dama1/400/400',
    category: 'dama',
    collectionId: 'col1',
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
    collectionId: 'col2',
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
    collectionId: 'col3',
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
    collectionId: 'col1',
    description: 'Una falda midi versátil con un plisado delicado. Combínala con zapatillas o tacones para diferentes looks.',
    stock: 8,
    isArchived: false,
  },
  // Ropa de Kids
  {
    id: '5',
    name: 'Camiseta de Dinosaurios',
    price: 15.99,
    imageUrl: 'https://picsum.photos/seed/nino1/400/400',
    category: 'kids',
    collectionId: 'col4',
    description: 'Camiseta de algodón suave con un divertido estampado de dinosaurios que brilla en la oscuridad.',
    stock: 25,
    isArchived: false,
  },
  {
    id: '6',
    name: 'Sudadera con Capucha y Orejas',
    price: 25.00,
    imageUrl: 'https://picsum.photos/seed/nino2/400/400',
    category: 'kids',
    collectionId: 'col6',
    description: 'Sudadera cálida y acogedora con orejitas de oso en la capucha. Perfecta para los días fríos.',
    stock: 12,
    isArchived: false,
  },
  {
    id: '7',
    name: 'Pantalones Cargo Resistentes',
    price: 22.50,
    imageUrl: 'https://picsum.photos/seed/nino3/400/400',
    category: 'kids',
    collectionId: 'col5',
    description: 'Pantalones con múltiples bolsillos, ideales para las aventuras diarias de los más pequeños. Tejido duradero.',
    stock: 30,
    isArchived: false,
  },
  {
    id: '8',
    name: 'Vestido de Princesa con Tul',
    price: 35.00,
    imageUrl: 'https://picsum.photos/seed/nino4/400/400',
    category: 'kids',
    collectionId: 'col1', // Re-using for example
    description: 'Un vestido de ensueño con una falda de tul brillante y detalles de lentejuelas. Ideal para fiestas y ocasiones especiales.',
    stock: 0,
    isArchived: false,
  },
  {
    id: '9',
    name: 'Chaqueta Vaquera Infantil',
    price: 30.00,
    imageUrl: 'https://picsum.photos/seed/nino5/400/400',
    category: 'kids',
    collectionId: 'col6',
    description: 'Una chaqueta vaquera clásica en tamaño infantil. Resistente y siempre a la moda.',
    stock: 18,
    isArchived: false,
  },
  {
    id: '10',
    name: 'Conjunto Deportivo de Algodón',
    price: 28.00,
    imageUrl: 'https://picsum.photos/seed/nino6/400/400',
    category: 'kids',
    collectionId: 'col5',
    description: 'Conjunto cómodo de sudadera y pantalón de chándal. Perfecto para jugar y estar cómodo en casa.',
    stock: 22,
    isArchived: false,
  },
   // Ropa de Caballero
  {
    id: '11',
    name: 'Camisa de Lino Casual',
    price: 42.99,
    imageUrl: 'https://picsum.photos/seed/caballero1/400/400',
    category: 'caballero',
    collectionId: 'col8',
    description: 'Camisa de lino fresca y ligera, ideal para un look relajado pero elegante en climas cálidos.',
    stock: 18,
    isArchived: false,
  },
  {
    id: '12',
    name: 'Pantalones Chinos Slim Fit',
    price: 58.00,
    imageUrl: 'https://picsum.photos/seed/caballero2/400/400',
    category: 'caballero',
    collectionId: 'col9',
    description: 'Pantalones chinos de corte moderno que ofrecen comodidad y estilo para cualquier ocasión.',
    stock: 22,
    isArchived: false,
  },
  {
    id: '13',
    name: 'Zapatos de Vestir de Cuero',
    price: 89.90,
    imageUrl: 'https://picsum.photos/seed/caballero3/400/400',
    category: 'caballero',
    collectionId: 'col10',
    description: 'Zapatos Oxford de cuero genuino, el toque final perfecto para un atuendo formal o de negocios.',
    stock: 10,
    isArchived: false,
  },
  {
    id: '14',
    name: 'Playera Básica de Algodón',
    price: 19.99,
    imageUrl: 'https://picsum.photos/seed/caballero4/400/400',
    category: 'caballero',
    collectionId: 'col8',
    description: 'Una playera de algodón suave y duradera, esencial en cualquier guardarropa masculino.',
    stock: 30,
    isArchived: false,
  }
];

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
    },
     {
        id: 'order-3',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        total: 49.99,
        status: 'Entregado',
        items: [
            { ...mockProducts[0], quantity: 1 }
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

let mockReviews: Review[] = [
    {
        id: 'review-1',
        productId: '1',
        userId: 'customer-1',
        userName: 'Juan Perez',
        rating: 5,
        comment: '¡Me encantó el vestido! La tela es muy fresca y el estampado es precioso. Me queda perfecto.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'review-2',
        productId: '1',
        userId: 'admin-user', // Just for example, can be any user id
        userName: 'Ana Lopez',
        rating: 4,
        comment: 'Es un vestido muy bonito, aunque un poco más largo de lo que esperaba. Aún así, lo recomiendo.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'review-3',
        productId: '3',
        userId: 'customer-1',
        userName: 'Juan Perez',
        rating: 5,
        comment: 'Estos jeans son increíblemente cómodos y se ajustan muy bien al cuerpo. ¡Los mejores que he tenido!',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

let mockUserWishlist: { [userId: string]: Set<string> } = {
    'customer-1': new Set(['3', '5']), // Customer Juan Perez likes Jeans and the Dinosaur T-shirt
};


const getProductRatings = (productId: string) => {
    const reviewsForProduct = mockReviews.filter(r => r.productId === productId);
    const reviewCount = reviewsForProduct.length;
    if (reviewCount === 0) {
        return { averageRating: 0, reviewCount: 0 };
    }
    const totalRating = reviewsForProduct.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviewCount;
    return { averageRating, reviewCount };
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
    // WISHLIST
    async getWishlist(userId: string): Promise<Product[]> {
        await delay(300);
        const wishlistPids = mockUserWishlist[userId] || new Set();
        const wishlistProducts = mockProducts.filter(p => wishlistPids.has(p.id));
        return wishlistProducts.map(p => ({
            ...p,
            ...getProductRatings(p.id)
        }));
    },
    async addToWishlist(userId: string, productId: string): Promise<boolean> {
        await delay(200);
        if (!mockUserWishlist[userId]) {
            mockUserWishlist[userId] = new Set();
        }
        mockUserWishlist[userId].add(productId);
        return true;
    },
    async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
        await delay(200);
        if (mockUserWishlist[userId]) {
            mockUserWishlist[userId].delete(productId);
        }
        return true;
    },
    
    // COLLECTIONS
    async getCollections(): Promise<Collection[]> {
      await delay(200);
      return [...mockCollections];
    },
    async addCollection(collectionData: Omit<Collection, 'id'>): Promise<Collection> {
      await delay(400);
      const newCollection: Collection = {
          id: `col-${Date.now()}`,
          ...collectionData,
      };
      mockCollections.push(newCollection);
      return newCollection;
    },
    async updateCollection(updatedCollection: Collection): Promise<Collection | null> {
        await delay(400);
        const index = mockCollections.findIndex(c => c.id === updatedCollection.id);
        if (index > -1) {
            mockCollections[index] = updatedCollection;
            return { ...mockCollections[index] };
        }
        return null;
    },
    async deleteCollection(collectionId: string): Promise<boolean> {
        await delay(400);
        const index = mockCollections.findIndex(c => c.id === collectionId);
        if (index > -1) {
            // Un-assign products from this collection before deleting
            mockProducts.forEach(p => {
                if (p.collectionId === collectionId) {
                    p.collectionId = ''; // Or a default 'un-categorized' id
                }
            });
            mockCollections.splice(index, 1);
            return true;
        }
        return false;
    },

    async getProducts(): Promise<Product[]> {
        await delay(500);
        return [...mockProducts]
            .filter(p => !p.isArchived)
            .map(p => ({
                ...p,
                ...getProductRatings(p.id)
            }));
    },
    async getArchivedProducts(): Promise<Product[]> {
        await delay(500);
        return [...mockProducts]
            .filter(p => p.isArchived)
            .map(p => ({
                ...p,
                ...getProductRatings(p.id)
            }));
    },
    async getProduct(id: string): Promise<Product | undefined> {
        await delay(300);
        const product = mockProducts.find(p => p.id === id);
        if (product && !product.isArchived) {
             return {
                ...product,
                ...getProductRatings(id)
            };
        }
        return undefined;
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
                    // No auto un-archiving. Admin must restore manually.
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
            isArchived: false, // Products are always created as active
        };
        mockProducts.unshift(newProduct);
        return newProduct;
    },
    async updateProduct(updatedProduct: Product): Promise<Product | null> {
        await delay(500);
        const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
        if (index > -1) {
            const productToUpdate = { ...updatedProduct };
            // If stock is added to a product, it becomes un-archived.
            // This is mainly for the "restore" functionality.
            if (productToUpdate.stock > 0) {
                productToUpdate.isArchived = false;
            }
            mockProducts[index] = productToUpdate;
            return { ...mockProducts[index] };
        }
        return null;
    },
    async archiveProduct(productId: string): Promise<boolean> {
        await delay(500);
        const index = mockProducts.findIndex(p => p.id === productId);
        if (index > -1) {
            mockProducts[index].isArchived = true;
            return true;
        }
        return false;
    },
    async deleteProductPermanently(productId: string): Promise<boolean> {
        await delay(500);
        // Force deletion: The product is removed from the main catalog.
        // It will remain in past orders for historical record-keeping, as order items are copies.
        const index = mockProducts.findIndex(p => p.id === productId);
        if (index > -1) {
            mockProducts.splice(index, 1);
            // Also delete related reviews
            mockReviews = mockReviews.filter(r => r.productId !== productId);
            return true;
        }
        return false;
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
    },
    async getReviewsForProduct(productId: string): Promise<Review[]> {
        await delay(300);
        return mockReviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    async addProductReview({ productId, rating, comment }: { productId: string; rating: number; comment: string; }): Promise<Review> {
        await delay(500);
        // Since mock has no logged-in user context, we'll use mockCustomer for the review.
        const user = mockCustomer;
        const newReview: Review = {
            id: `review-${Date.now()}`,
            productId,
            userId: user.id,
            userName: `${user.firstName} ${user.paternalLastName}`,
            rating,
            comment,
            date: new Date().toISOString(),
        };
        mockReviews.unshift(newReview);
        return newReview;
    },
}