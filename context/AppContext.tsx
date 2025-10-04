

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, User, Order, Message } from '../types';
import { api } from '../services/api';

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id' | 'role' | 'password'> & { password: string }) => Promise<User | null>;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  orders: Order[];
  getOrderDetail: (orderId: string) => Promise<Order | null>;
  placeOrder: () => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  allProducts: Product[];
  customers: User[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  messages: Message[];
  sendMessage: (text: string, toId: string) => Promise<void>;
  markMessagesAsRead: (fromId: string) => Promise<void>;
  unreadMessagesCount: number;
  loading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }

        const products = await api.getProducts();
        setAllProducts(products);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch data when user logs in
  useEffect(() => {
    if (user && token) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          if (user.role === 'admin') {
            const [fetchedCustomers, fetchedOrders, fetchedMessages] = await Promise.all([
              api.getCustomers(),
              api.getAllOrders(),
              api.getMessages(),
            ]);
            setCustomers(fetchedCustomers);
            setOrders(fetchedOrders);
            setMessages(fetchedMessages);
          } else {
            const [fetchedOrders, fetchedMessages] = await Promise.all([
               api.getMyOrders(),
               api.getMessages()
            ]);
            setOrders(fetchedOrders);
            setMessages(fetchedMessages);
          }
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, token]);
  
  // Persist cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);


  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, allProducts]);

  const login = async (email: string, password: string): Promise<User | null> => {
    setError(null);
    try {
      const data = await api.login(email, password);
      if (data && data.token) {
        const { token, ...loggedInUser } = data;
        setUser(loggedInUser);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('token', token);
        return loggedInUser;
      }
      return null;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'role' | 'password'> & { password: string }): Promise<User | null> => {
    setError(null);
    try {
      const data = await api.register(userData);
       if (data && data.token) {
        const { token, ...newUser } = data;
        setUser(newUser);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', token);
        return newUser;
       }
       return null;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setOrders([]);
    setMessages([]);
    setCustomers([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const addToCart = useCallback((product: Product) => {
    const productInStock = allProducts.find(p => p.id === product.id);
    if (!productInStock || productInStock.stock <= 0) {
      alert('Este producto está agotado.');
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      if (productInStock.stock <= currentQuantityInCart) {
        alert('No hay suficiente stock para agregar más de este artículo.');
        return prevCart;
      }
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, [allProducts]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const productInStock = allProducts.find(p => p.id === productId);
    if (productInStock && quantity > productInStock.stock) {
      alert(`Solo quedan ${productInStock.stock} artículos en stock.`);
      setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: productInStock.stock } : item));
    } else {
      setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity } : item));
    }
  }, [removeFromCart, allProducts]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const placeOrder = async (): Promise<boolean> => {
    if (!user || cart.length === 0) return false;
    setError(null);
    try {
        const newOrder = await api.placeOrder(cart, user, cartTotal);
        if (newOrder) {
            setOrders(prev => [newOrder, ...prev]);
            clearCart();
            // Refetch products to get updated stock
            api.getProducts().then(setAllProducts);
            return true;
        }
        return false;
    } catch (e: any) {
        setError(e.message)
        alert(`Error al realizar el pedido: ${e.message}`);
        // Refetch products to get latest stock info
        api.getProducts().then(setAllProducts);
        return false;
    }
  };

  const getOrderDetail = async (orderId: string): Promise<Order | null> => {
    if (!user) return null;
    setError(null);
    try {
        return await api.getOrderDetail(orderId);
    } catch (e: any) {
        setError(e.message);
        return null;
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) return;
    setError(null);
    try {
        await api.cancelOrder(orderId);
        setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: 'Cancelado' } : order));
        // Refetch products to get updated stock
        api.getProducts().then(setAllProducts);
    } catch (e: any) {
        setError(e.message);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setError(null);
    try {
        await api.updateOrderStatus(orderId, status);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status } : o));
    } catch (e: any) {
        setError(e.message);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    setError(null);
    try {
        const newProduct = await api.addProduct(productData);
        setAllProducts(prev => [newProduct, ...prev]);
    } catch (e: any) {
        setError(e.message);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setError(null);
    try {
        const result = await api.updateProduct(updatedProduct);
        if(result){
            setAllProducts(prev => prev.map(p => p.id === updatedProduct.id ? result : p));
        }
    } catch (e: any) {
        setError(e.message);
    }
  };

  const deleteProduct = async (productId: string) => {
    setError(null);
    try {
        await api.deleteProduct(productId);
        setAllProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e: any) {
        setError(e.message);
    }
  };
  
  const deleteCustomer = async (customerId: string) => {
    setError(null);
    try {
        await api.deleteCustomer(customerId);
        setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (e: any) {
        setError(e.message);
    }
  };
  
  const sendMessage = async (text: string, toId: string) => {
    if (!user) return;
    setError(null);
    try {
        const newMessage = await api.sendMessage(text, toId);
        setMessages(prev => [...prev, newMessage]);
    } catch (e: any) {
        setError(e.message);
    }
  };

  const markMessagesAsRead = async (fromId: string) => {
    if (!user) return;
    setError(null);
    try {
        await api.markMessagesAsRead(fromId);
        setMessages(prev => prev.map(msg => (msg.toId === user?.id && msg.fromId === fromId && !msg.read) ? { ...msg, read: true } : msg));
    } catch (e: any) {
        setError(e.message);
    }
  };

  const unreadMessagesCount = useMemo(() => {
    if (!user) return 0;
    return messages.filter(msg => msg.toId === user.id && !msg.read).length;
  }, [messages, user]);

  const value = {
    isAuthenticated: !!user,
    user,
    token,
    login,
    register,
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    searchQuery,
    setSearchQuery,
    searchResults,
    orders,
    getOrderDetail,
    placeOrder,
    cancelOrder,
    updateOrderStatus,
    allProducts,
    customers,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteCustomer,
    messages,
    sendMessage,
    markMessagesAsRead,
    unreadMessagesCount,
    loading,
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};