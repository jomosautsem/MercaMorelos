import { Product, User, Order, Message, CartItem, Review } from '../types';

// Use a relative path for the API endpoint.
// This relies on the dev server (e.g., Vite) proxying requests from /api to the backend.
const API_BASE_URL = '/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    // The body can only be consumed once, so we read it as text first.
    const text = await response.text();

    if (!response.ok) {
        // If the response is not OK, it's an error.
        // We try to parse the text as JSON to get a structured error message.
        // If parsing fails, we throw the raw text as the error.
        try {
            const json = JSON.parse(text);
            throw new Error(json.message || text);
        } catch (e) {
            throw new Error(text || `Request failed with status ${response.status}`);
        }
    }

    // If the response is OK, parse the text as JSON.
    // This also handles successful but empty responses (e.g., 204 No Content),
    // which will result in an empty object.
    return text ? JSON.parse(text) : {};
};


// --- Data Normalization Helpers ---

const normalizeProduct = (product: any): Product => {
    if (!product) return product;
    return {
        ...product,
        price: product.price != null ? parseFloat(product.price) : 0,
        stock: product.stock != null ? parseInt(String(product.stock), 10) : 0,
    };
};

const normalizeOrder = (order: any): Order => {
    if (!order) return order;
    return {
        ...order,
        total: order.total != null ? parseFloat(order.total) : 0,
        items: Array.isArray(order.items) ? order.items.map(normalizeProduct) : [],
    };
};

const normalizeReview = (review: any): Review => {
    if (!review) return review;
    return {
        ...review,
        rating: review.rating != null ? parseInt(String(review.rating), 10) : 0,
    };
};

export const api = {
    // AUTH
    async login(email: string, password: string): Promise<User & { token: string }> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },
    async register(userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<User & { token: string }> {
         const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },
    // PRODUCTS
    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await handleResponse(response);
        return products.map(normalizeProduct);
    },
    async getProduct(id: string): Promise<Product> {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const product = await handleResponse(response);
        return normalizeProduct(product);
    },
    async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
         const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        const newProduct = await handleResponse(response);
        return normalizeProduct(newProduct);
    },
    async updateProduct(updatedProduct: Product): Promise<Product> {
         const response = await fetch(`${API_BASE_URL}/products/${updatedProduct.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedProduct),
        });
        const result = await handleResponse(response);
        return normalizeProduct(result);
    },
    async deleteProduct(productId: string): Promise<{msg: string}> {
         const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
    // ORDERS
    async getMyOrders(): Promise<Order[]> {
        const response = await fetch(`${API_BASE_URL}/orders/myorders`, { headers: getAuthHeaders() });
        const orders = await handleResponse(response);
        return orders.map(normalizeOrder);
    },
    async getAllOrders(): Promise<Order[]> {
        const response = await fetch(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
        const orders = await handleResponse(response);
        return orders.map((o: any) => ({ ...o, total: parseFloat(o.total) }));
    },
    async getOrderDetail(orderId: string): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, { headers: getAuthHeaders() });
        const order = await handleResponse(response);
        return normalizeOrder(order);
    },
    async placeOrder(cart: CartItem[], shippingInfo: User, total: number): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ cartItems: cart, shippingInfo, total }),
        });
        const newOrder = await handleResponse(response);
        return normalizeOrder(newOrder);
    },
    async cancelOrder(orderId: string): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        const order = await handleResponse(response);
        return { ...order, total: parseFloat(order.total) };
    },
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        const order = await handleResponse(response);
        return { ...order, total: parseFloat(order.total) };
    },
    // USERS / CUSTOMERS
    async getCustomers(): Promise<User[]> {
        const response = await fetch(`${API_BASE_URL}/users`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    async deleteCustomer(customerId: string): Promise<{msg: string}> {
        const response = await fetch(`${API_BASE_URL}/users/${customerId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
    async updateProfile(profileData: Partial<Omit<User, 'id' | 'role' | 'email'>>): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData),
        });
        return handleResponse(response);
    },
    async changePassword(current: string, newPass: string): Promise<{ msg: string }> {
        const response = await fetch(`${API_BASE_URL}/users/password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
        });
        return handleResponse(response);
    },
    // MESSAGES
    async getMessages(): Promise<Message[]> {
        const response = await fetch(`${API_BASE_URL}/messages`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    async sendMessage(text: string, toId: string, fromId: string): Promise<Message> {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: getAuthHeaders(),
            // NOTE: fromId is not sent in the body. The backend identifies the user from the token.
            // The fromId parameter is included here to maintain a consistent interface with mockApi.
            body: JSON.stringify({ text, toId }),
        });
        return handleResponse(response);
    },
    async markMessagesAsRead(fromId: string): Promise<{msg: string}> {
         const response = await fetch(`${API_BASE_URL}/messages/read`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ fromId }),
        });
        return handleResponse(response);
    },
    // REVIEWS
    async getReviewsForProduct(productId: string): Promise<Review[]> {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
        const reviews = await handleResponse(response);
        return reviews.map(normalizeReview);
    },
    async addProductReview(productId: string, rating: number, comment: string): Promise<Review> {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ rating, comment }),
        });
        const newReview = await handleResponse(response);
        return normalizeReview(newReview);
    },
};