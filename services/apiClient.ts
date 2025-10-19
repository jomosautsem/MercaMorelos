import { Product, User, Order, Message, CartItem, Review, Collection } from '../types';

const API_BASE_URL = 'http://localhost:4000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || 'API request failed');
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error(`API Fetch Error (${options.method || 'GET'} ${endpoint}):`, error);
        throw error;
    }
};

export const apiClient = {
    // COLLECTIONS
    async getCollections(): Promise<Collection[]> {
        return apiFetch('/collections');
    },
    async addCollection(collectionData: Omit<Collection, 'id'>): Promise<Collection> {
        return apiFetch('/collections', { method: 'POST', body: JSON.stringify(collectionData) });
    },
    async updateCollection(updatedCollection: Collection): Promise<Collection | null> {
        return apiFetch(`/collections/${updatedCollection.id}`, { method: 'PUT', body: JSON.stringify(updatedCollection) });
    },
    async deleteCollection(collectionId: string): Promise<boolean> {
        await apiFetch(`/collections/${collectionId}`, { method: 'DELETE' });
        return true;
    },

    // PRODUCTS
    async getProducts(): Promise<Product[]> {
        return apiFetch('/products');
    },
    async getArchivedProducts(): Promise<Product[]> {
        return apiFetch('/products/archived');
    },
    async getProduct(id: string): Promise<Product | undefined> {
        return apiFetch(`/products/${id}`);
    },
    async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
        return apiFetch('/products', { method: 'POST', body: JSON.stringify(productData) });
    },
    async updateProduct(updatedProduct: Product): Promise<Product | null> {
        return apiFetch(`/products/${updatedProduct.id}`, { method: 'PUT', body: JSON.stringify(updatedProduct) });
    },
    async archiveProduct(productId: string): Promise<boolean> {
        await apiFetch(`/products/${productId}/archive`, { method: 'PUT' });
        return true;
    },
    async deleteProductPermanently(productId: string): Promise<boolean> {
        await apiFetch(`/products/${productId}/permanent`, { method: 'DELETE' });
        return true;
    },

    // WISHLIST
    async getWishlist(userId: string): Promise<Product[]> { // userId for compatibility
        return apiFetch('/users/wishlist');
    },
    async addToWishlist(userId: string, productId: string): Promise<boolean> { // userId for compatibility
        await apiFetch('/users/wishlist', { method: 'POST', body: JSON.stringify({ productId }) });
        return true;
    },
    async removeFromWishlist(userId: string, productId: string): Promise<boolean> { // userId for compatibility
        await apiFetch(`/users/wishlist/${productId}`, { method: 'DELETE' });
        return true;
    },

    // AUTH
    async login(email: string, pass: string): Promise<{user: User, token: string} | null> {
        const response = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
        if (!response || !response.token) return null;
        const { token, ...user } = response;
        return { user, token };
    },
    async register(userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<{user: User, token: string} | null> {
        const response = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
        if (!response || !response.token) return null;
        const { token, ...user } = response;
        return { user, token };
    },

    // ORDERS
    async getMyOrders(userId: string): Promise<Order[]> { // userId is for signature compatibility, but not used.
        return apiFetch('/orders/myorders');
    },
    async getAllOrders(): Promise<Order[]> {
        return apiFetch('/orders');
    },
    async getOrderDetail(orderId: string): Promise<Order | null> {
        return apiFetch(`/orders/${orderId}`);
    },
    async placeOrder(userId: string, cart: CartItem[], shippingInfo: User, total: number): Promise<Order | null> {
        return apiFetch('/orders', { method: 'POST', body: JSON.stringify({ cartItems: cart, shippingInfo, total }) });
    },
    async cancelOrder(orderId: string, userId: string): Promise<boolean> { // userId for compatibility
        await apiFetch(`/orders/${orderId}/cancel`, { method: 'PUT' });
        return true;
    },
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
        await apiFetch(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
        return true;
    },

    // USERS / CUSTOMERS
    async getCustomers(): Promise<User[]> {
        return apiFetch('/users');
    },
    async deleteCustomer(customerId: string): Promise<boolean> {
        await apiFetch(`/users/${customerId}`, { method: 'DELETE' });
        return true;
    },
    async updateProfile(userId: string, profileData: Partial<User>): Promise<User> { // userId for compatibility
        return apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) });
    },
    async changePassword(userId: string, current: string, newPass: string): Promise<{ msg: string }> { // userId for compatibility
        return apiFetch('/users/password', { method: 'PUT', body: JSON.stringify({ currentPassword: current, newPassword: newPass }) });
    },

    // MESSAGES
    async getMessages(userId: string): Promise<Message[]> { // userId for compatibility
        return apiFetch('/messages');
    },
    async sendMessage(text: string, fromId: string, toId: string): Promise<Message> { // fromId for compatibility
        return apiFetch('/messages', { method: 'POST', body: JSON.stringify({ toId, text }) });
    },
    async markMessagesAsRead(userId: string, fromId: string): Promise<boolean> { // userId for compatibility
        await apiFetch('/messages/read', { method: 'PUT', body: JSON.stringify({ fromId }) });
        return true;
    },

    // REVIEWS
    async getReviewsForProduct(productId: string): Promise<Review[]> {
        return apiFetch(`/products/${productId}/reviews`);
    },
    // FIX: The previous fix to use three separate arguments was incorrect. 
    // The function should accept a single object for consistency and clarity.
    async addProductReview({ productId, rating, comment }: { productId: string, rating: number, comment: string }): Promise<Review> { // userId, userName for compatibility
        return apiFetch(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
    },
};