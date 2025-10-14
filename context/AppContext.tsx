

import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product, CartItem, User, Order, Message, Review, ToastMessage } from '../types';
import { api } from '../services/api';

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<User | null>;
  logout: () => void;
  updateProfile: (profileData: Partial<Omit<User, 'id' | 'role' | 'email'>>) => Promise<User | null>;
  changePassword: (passwordData: { current: string, new: string }) => Promise<boolean>;
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
  archivedProducts: Product[];
  customers: User[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  archiveProduct: (productId: string) => Promise<void>;
  deleteProductPermanently: (productId: string) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  messages: Message[];
  sendMessage: (text: string, toId: string) => Promise<void>;
  markMessagesAsRead: (fromId: string) => Promise<void>;
  unreadMessagesCount: number;
  loading: boolean;
  error: string | null;
  getReviewsForProduct: (productId: string) => Promise<Review[]>;
  addProductReview: (productId: string, rating: number, comment: string) => Promise<{ success: boolean; message?: string }>;
  checkIfUserPurchasedProduct: (productId: string) => boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toastIdRef = useRef(0);

  const removeToast = (id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = toastIdRef.current++;
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    setTimeout(() => {
        removeToast(id);
    }, 5000); // Auto-dismiss after 5 seconds
  }, []);

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
         const message = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
         console.error("Fallo al cargar los datos iniciales desde la API:", message);
         setError(`Error al cargar productos: ${message}`);
         showToast(`Error al cargar productos: ${message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [showToast]);

  // Fetch data when user logs in
  useEffect(() => {
    if (user && token) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          if (user.role === 'admin') {
            const [fetchedCustomers, fetchedOrders, fetchedMessages, fetchedArchivedProducts] = await Promise.all([
              api.getCustomers(),
              api.getAllOrders(),
              api.getMessages(),
              api.getArchivedProducts(),
            ]);
            setCustomers(fetchedCustomers);
            setOrders(fetchedOrders);
            setMessages(fetchedMessages);
            setArchivedProducts(fetchedArchivedProducts);
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
      // FIX: The API client wraps the response in a `user` object. Destructure it correctly.
      if (data && data.user && data.token) {
        const { user: loggedInUser, token } = data;
        setUser(loggedInUser);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('token', token);
        return loggedInUser;
      }
      setError('Credenciales incorrectas.');
      return null;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<User | null> => {
    setError(null);
    try {
      const data = await api.register(userData);
      // FIX: The API client wraps the response in a `user` object. Destructure it correctly.
       if (data && data.user && data.token) {
        const { user: newUser, token } = data;
        setUser(newUser);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', token);
        return newUser;
       }
       setError('El correo electrónico ya está en uso.');
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
    setArchivedProducts([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const updateProfile = async (profileData: Partial<Omit<User, 'id' | 'role' | 'email'>>): Promise<User | null> => {
    if (!user) return null;
    setError(null);
    try {
      const updatedUser = await api.updateProfile(profileData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch(e: any) {
      setError(e.message);
      return null;
    }
  };
    
  const changePassword = async (passwordData: { current: string, new: string }): Promise<boolean> => {
      if (!user) return false;
      setError(null);
      try {
          await api.changePassword(passwordData.current, passwordData.new);
          return true;
      } catch (e: any) {
          setError(e.message);
          return false;
      }
  };

  const addToCart = useCallback((product: Product) => {
    const productInStock = allProducts.find(p => p.id === product.id);
    if (!productInStock || productInStock.stock <= 0) {
      showToast('Este producto está agotado.', 'error');
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      if (productInStock.stock <= currentQuantityInCart) {
        showToast('No hay suficiente stock para agregar más de este artículo.', 'error');
        return prevCart;
      }
      showToast(`${product.name} añadido al carrito`, 'success');
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, [allProducts, showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === productId);
      if (itemToRemove) {
        showToast(`${itemToRemove.name} eliminado del carrito`, 'info');
      }
      return prevCart.filter(item => item.id !== productId);
    });
  }, [showToast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const productInStock = allProducts.find(p => p.id === productId);
    if (productInStock && quantity > productInStock.stock) {
      showToast(`Solo quedan ${productInStock.stock} artículos en stock.`, 'error');
      setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: productInStock.stock } : item));
    } else {
      setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity } : item));
    }
  }, [removeFromCart, allProducts, showToast]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

    const refetchProducts = useCallback(async () => {
        try {
            const [products, archived] = await Promise.all([
                api.getProducts(),
                user?.role === 'admin' ? api.getArchivedProducts() : Promise.resolve([]),
            ]);
            setAllProducts(products);
            if (user?.role === 'admin') {
                setArchivedProducts(archived);
            }
        } catch (e: any) {
             const message = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
             setError(`Error al recargar productos: ${message}`);
        }
    }, [user]);

  const placeOrder = async (): Promise<boolean> => {
    if (!user || cart.length === 0) return false;
    setError(null);
    try {
        const newOrder = await api.placeOrder(cart, user, cartTotal);
        if (newOrder) {
            setOrders(prev => [newOrder, ...prev]);
            clearCart();
            await refetchProducts();
            return true;
        }
        return false;
    } catch (e: any) {
        setError(e.message)
        showToast(`Error al realizar el pedido: ${e.message}`, 'error');
        await refetchProducts();
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
        await refetchProducts();
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
        await api.addProduct(productData);
        await refetchProducts();
    } catch (e: any) {
        setError(e.message);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setError(null);
    try {
        await api.updateProduct(updatedProduct);
        await refetchProducts();
    } catch (e: any) {
        setError(e.message);
    }
  };

  const archiveProduct = useCallback(async (productId: string) => {
    setError(null);
    try {
      await api.deleteProduct(productId);
      await refetchProducts();
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      showToast(`No se pudo archivar el producto: ${errorMessage}`, 'error');
    }
  }, [refetchProducts, showToast]);
  
  const deleteProductPermanently = useCallback(async (productId: string) => {
    setError(null);
    try {
      await api.deleteProduct(productId);
      await refetchProducts();
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      showToast(`Error al eliminar el producto: ${errorMessage}`, 'error');
    }
  }, [refetchProducts, showToast]);
  
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

  const getReviewsForProduct = useCallback(async (productId: string): Promise<Review[]> => {
      setError(null);
      try {
          return await api.getReviewsForProduct(productId);
      } catch (e: any) {
          setError(e.message);
          return [];
      }
  }, []);

  const addProductReview = useCallback(async (productId: string, rating: number, comment: string): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
        return { success: false, message: 'Debes iniciar sesión para dejar una opinión.' };
    }
    setError(null);
    try {
        await api.addProductReview(productId, rating, comment);
        await refetchProducts(); // Refetch all products to get updated ratings
        return { success: true };
    } catch (e: any) {
        const message = e.message || 'Ocurrió un error desconocido.';
        setError(message);
        return { success: false, message };
    }
  }, [user, refetchProducts]);
  
  const checkIfUserPurchasedProduct = useCallback((productId: string): boolean => {
      if (!user) return false;
      return orders.some(order => 
          order.status === 'Entregado' && order.items.some(item => String(item.id) === String(productId))
      );
  }, [user, orders]);


  const value = {
    isAuthenticated: !!user,
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
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
    archivedProducts,
    customers,
    addProduct,
    updateProduct,
    archiveProduct,
    deleteProductPermanently,
    deleteCustomer,
    messages,
    sendMessage,
    markMessagesAsRead,
    unreadMessagesCount,
    loading,
    error,
    getReviewsForProduct,
    addProductReview,
    checkIfUserPurchasedProduct,
    toasts,
    showToast,
    removeToast,
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
