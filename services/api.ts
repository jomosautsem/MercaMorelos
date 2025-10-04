import { Product, User, Order, Message, CartItem } from '../types';

// Use Vite's env variable, with a fallback for other environments
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000/api';

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
    const resJson = await response.json();
    if (!response.ok) {
        throw new Error(resJson.message || 'Something went wrong');
    }
    return resJson;
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
    async register(userData: Omit<User, 'id' | 'role'>): Promise<User & { token: string }> {
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
        return handleResponse(response);
    },
    async getProduct(id: string): Promise<Product> {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        return handleResponse(response);
    },
    async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
         const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        return handleResponse(response);
    },
    async updateProduct(updatedProduct: Product): Promise<Product> {
         const response = await fetch(`${API_BASE_URL}/products/${updatedProduct.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedProduct),
        });
        return handleResponse(response);
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
        return handleResponse(response);
    },
    async getAllOrders(): Promise<Order[]> {
        const response = await fetch(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    async getOrderDetail(orderId: string): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    async placeOrder(cart: CartItem[], shippingInfo: User, total: number): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ cartItems: cart, shippingInfo, total }),
        });
        return handleResponse(response);
    },
    async cancelOrder(orderId: string): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
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
    // MESSAGES
    async getMessages(): Promise<Message[]> {
        const response = await fetch(`${API_BASE_URL}/messages`, { headers: getAuthHeaders() });
        return handleResponse(response);
    },
    async sendMessage(text: string, toId: string): Promise<Message> {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: getAuthHeaders(),
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
};
