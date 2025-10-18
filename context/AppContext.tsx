import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Product, User, CartItem, Order, Message, ToastMessage, Review, Collection } from '../types';
import { api } from '../services/api';
import { db, PendingRegistration } from '../services/db';

interface AppContextType {
  // Auth & User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  register: (userData: PendingRegistration) => Promise<User | null>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<User | null>;
  changePassword: (passwordData: { current: string; new: string }) => Promise<boolean>;

  // Products
  allProducts: Product[];
  archivedProducts: Product[];
  getProduct: (id: string) => Promise<Product | undefined>;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (updatedProduct: Product) => Promise<Product | null>;
  archiveProduct: (productId: string) => Promise<void>;
  deleteProductPermanently: (productId: string) => Promise<void>;
  
  // Collections
  collections: Collection[];
  addCollection: (collectionData: Omit<Collection, 'id'>) => Promise<void>;
  updateCollection: (updatedCollection: Collection) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  getOrderDetail: (orderId: string) => Promise<Order | null>;
  placeOrder: () => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  checkIfUserPurchasedProduct: (productId: string) => boolean;

  // Reviews
  getReviewsForProduct: (productId: string) => Promise<Review[]>;
  addProductReview: (productId: string, rating: number, comment: string) => Promise<{ success: boolean; message?: string }>;
  
  // Admin
  customers: User[];
  deleteCustomer: (customerId: string) => Promise<void>;

  // Messaging
  messages: Message[];
  sendMessage: (text: string, toId: string) => Promise<void>;
  markMessagesAsRead: (fromId: string) => Promise<void>;
  unreadMessagesCount: number;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];

  // UI
  loading: boolean;
  error: string | null;
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch {
            return [];
        }
    });
    const [searchQuery, setSearchQuery] = useState('');

    // --- Memos for derived state ---
    const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        return allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, allProducts]);
    const unreadMessagesCount = useMemo(() => {
        if (!user) return 0;
        return messages.filter(msg => msg.toId === user.id && !msg.read).length;
    }, [messages, user]);

    // --- UI Methods ---
    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastMessage['type']) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [productsData, collectionsData] = await Promise.all([api.getProducts(), api.getCollections()]);
            setAllProducts(productsData);
            setCollections(collectionsData);
        } catch (e) {
            addToast(`Error al cargar datos: ${(e as Error).message}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);
    
    const fetchAdminData = useCallback(async () => {
        if (user?.role !== 'admin') {
            setCustomers([]);
            setArchivedProducts([]);
            return;
        }
        try {
            const [archived, allOrders, allCustomers] = await Promise.all([
                api.getArchivedProducts(),
                api.getAllOrders(),
                api.getCustomers()
            ]);
            setArchivedProducts(archived);
            setOrders(allOrders);
            setCustomers(allCustomers);
        } catch (e) {
            addToast(`Error al cargar datos de admin: ${(e as Error).message}`, 'error');
        }
    }, [user, addToast]);

    const fetchUserData = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setOrders([]);
            setMessages([]);
            return;
        }
        try {
            if (user.role === 'customer') {
                const [userOrders, userMessages] = await Promise.all([api.getMyOrders(user.id), api.getMessages(user.id)]);
                setOrders(userOrders);
                setMessages(userMessages);
            } else if (user.role === 'admin') {
                const allMessages = await api.getMessages(user.id);
                setMessages(allMessages);
            }
        } catch (e) {
            addToast(`Error al cargar tus datos: ${(e as Error).message}`, 'error');
        }
    }, [isAuthenticated, user, addToast]);
    
    // Initial data load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // User-dependent data load
    useEffect(() => {
        fetchAdminData();
        fetchUserData();
    }, [user, isAuthenticated, fetchAdminData, fetchUserData]);
    
    // Persist cart
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    // --- Auth Methods ---
    const login = useCallback(async (email: string, pass: string): Promise<User | null> => {
        try {
            const result = await api.login(email, pass);
            if (result) {
                localStorage.setItem('token', result.token);
                setUser(result.user);
                setIsAuthenticated(true);
                addToast(`¡Bienvenido, ${result.user.firstName}!`, 'success');
                return result.user;
            }
            return null;
        } catch (e) {
            addToast((e as Error).message, 'error');
            return null;
        }
    }, [addToast]);

    const register = useCallback(async (userData: PendingRegistration): Promise<User | null> => {
        if (!navigator.onLine) {
            try {
                await db.pendingRegistrations.add(userData);
                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    // Fix: Cast service worker registration to `any` to access the `sync` property for background sync.
                    navigator.serviceWorker.ready.then(sw => (sw as any).sync.register('sync-new-registrations'));
                }
                addToast('Sin conexión. Tu registro se completará automáticamente.', 'info');
                return null;
            } catch (e) {
                addToast(`Error guardando registro: ${(e as Error).message}`, 'error');
                return null;
            }
        }
        try {
            const result = await api.register(userData);
            if (result) {
                localStorage.setItem('token', result.token);
                setUser(result.user);
                setIsAuthenticated(true);
                addToast(`¡Bienvenido, ${result.user.firstName}!`, 'success');
                return result.user;
            }
            return null;
        } catch (e) {
            addToast((e as Error).message, 'error');
            return null;
        }
    }, [addToast]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setCart([]);
        addToast('Has cerrado sesión.', 'info');
    }, [addToast]);

    const updateProfile = async (profileData: Partial<User>): Promise<User | null> => {
        if (!user) return null;
        try {
            const updatedUser = await api.updateProfile(user.id, profileData);
            setUser(updatedUser);
            addToast('Perfil actualizado.', 'success');
            return updatedUser;
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
            return null;
        }
    };

    const changePassword = async (passwordData: { current: string; new: string }): Promise<boolean> => {
        if (!user) return false;
        try {
            // Fix: The API client expects three separate arguments, but was being called with one object.
            // This destructures the passwordData object and passes the arguments correctly.
            await api.changePassword(user.id, passwordData.current, passwordData.new);
            addToast('Contraseña actualizada con éxito.', 'success');
            return true;
        } catch(e) {
            setError((e as Error).message);
            addToast((e as Error).message, 'error');
            return false;
        }
    };

    // --- Product Methods ---
    const getProduct = useCallback(async (id: string) => {
        return api.getProduct(id);
    }, []);
    
    const addProduct = async (productData: Omit<Product, 'id'>): Promise<boolean> => {
        try {
            const newProduct = await api.addProduct(productData);
            if (newProduct) {
                // Refetch to ensure data consistency (e.g., calculated ratings)
                await fetchData();
                addToast('Producto añadido.', 'success');
                return true;
            }
            return false;
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
            return false;
        }
    };
    
    const updateProduct = async (updatedProduct: Product) => {
        try {
            const result = await api.updateProduct(updatedProduct);
            const updateList = (list: Product[]) => list.map(p => p.id === result!.id ? result! : p);
            setAllProducts(updateList);
            setArchivedProducts(updateList);
            addToast('Producto actualizado.', 'success');
            await fetchData(); // Refresh all lists
            await fetchAdminData();
            return result;
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
            return null;
        }
    };

    const archiveProduct = async (productId: string) => {
        try {
            await api.archiveProduct(productId);
            setAllProducts(prev => prev.filter(p => p.id !== productId));
            const archived = allProducts.find(p => p.id === productId);
            if (archived) setArchivedProducts(prev => [archived, ...prev]);
            addToast('Producto archivado.', 'success');
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    const deleteProductPermanently = async (productId: string) => {
        try {
            await api.deleteProductPermanently(productId);
            setArchivedProducts(prev => prev.filter(p => p.id !== productId));
            setAllProducts(prev => prev.filter(p => p.id !== productId));
            addToast('Producto eliminado.', 'success');
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    // --- Collection Methods ---
    const addCollection = async (collectionData: Omit<Collection, 'id'>) => {
        try {
            const newCollection = await api.addCollection(collectionData);
            setCollections(prev => [...prev, newCollection].sort((a,b) => a.name.localeCompare(b.name)));
            addToast('Colección añadida.', 'success');
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };
    const updateCollection = async (updatedCollection: Collection) => {
        try {
            const result = await api.updateCollection(updatedCollection);
            setCollections(prev => prev.map(c => c.id === result!.id ? result! : c));
            addToast('Colección actualizada.', 'success');
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };
    const deleteCollection = async (collectionId: string) => {
        try {
            await api.deleteCollection(collectionId);
            setCollections(prev => prev.filter(c => c.id !== collectionId));
            addToast('Colección eliminada.', 'success');
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    // --- Cart Methods ---
    const addToCart = useCallback((product: Product) => {
        if (product.stock <= 0) {
            addToast('Este producto está agotado.', 'error');
            return;
        }
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                 if (existingItem.quantity >= product.stock) {
                    addToast('No hay más stock disponible para este producto.', 'info');
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        addToast(`${product.name} añadido al carrito.`, 'success');
    }, [addToast]);

    const removeFromCart = useCallback((productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
        addToast('Producto eliminado del carrito.', 'info');
    }, [addToast]);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                if (quantity > item.stock) {
                    addToast(`Solo quedan ${item.stock} unidades de ${item.name}.`, 'info');
                    return { ...item, quantity: item.stock };
                }
                return { ...item, quantity };
            }
            return item;
        }));
    }, [removeFromCart, addToast]);

    const clearCart = useCallback(() => setCart([]), []);

    // --- Order Methods ---
    const placeOrder = useCallback(async (): Promise<boolean> => {
        if (!user || cart.length === 0) {
            addToast('El carrito está vacío o no has iniciado sesión.', 'error');
            return false;
        }
        try {
            const newOrder = await api.placeOrder(user.id, cart, user, cartTotal);
            if (newOrder) {
                addToast('¡Pedido realizado con éxito!', 'success');
                setOrders(prev => [newOrder, ...prev]);
                clearCart();
                fetchData(); // Refresh product stock
                return true;
            }
            return false;
        } catch (e) {
            addToast(`Error al realizar el pedido: ${(e as Error).message}`, 'error');
            return false;
        }
    }, [user, cart, cartTotal, addToast, clearCart, fetchData]);
    
    const getOrderDetail = useCallback(async (orderId: string) => {
        if (!user) return null;
        return api.getOrderDetail(orderId, user.id, user.role);
    }, [user]);
    
    const cancelOrder = async (orderId: string) => {
        if (!user) return;
        try {
            await api.cancelOrder(orderId, user.id);
            setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: 'Cancelado'} : o));
            addToast('Pedido cancelado.', 'success');
            fetchData();
        } catch(e) {
             addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };
    const updateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await api.updateOrderStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));
            addToast('Estado del pedido actualizado.', 'success');
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    const checkIfUserPurchasedProduct = (productId: string) => {
        return orders.some(order => order.status === 'Entregado' && order.items.some(item => item.id === productId));
    };

    // --- Review Methods ---
    const getReviewsForProduct = async (productId: string) => api.getReviewsForProduct(productId);
    
    const addProductReview = async (productId: string, rating: number, comment: string): Promise<{ success: boolean; message?: string }> => {
        if (!user) return { success: false, message: 'User not logged in' };
        try {
            // Fix: The apiClient expects 3 arguments, but 5 were being passed. The backend
            // gets user info from the auth token, so userId and userName are not needed here.
            await api.addProductReview(productId, rating, comment);
            addToast('Opinión enviada. ¡Gracias!', 'success');
            fetchData(); // Refresh average rating
            return { success: true };
        } catch(e) {
            const err = e as Error;
            addToast(`Error: ${err.message}`, 'error');
            return { success: false, message: err.message };
        }
    };
    
    // --- Admin Methods ---
    const deleteCustomer = async (customerId: string) => {
         try {
            await api.deleteCustomer(customerId);
            setCustomers(prev => prev.filter(c => c.id !== customerId));
            addToast('Cliente eliminado.', 'success');
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    // --- Message Methods ---
    const sendMessage = async (text: string, toId: string) => {
        if (!user) return;
        try {
            const newMessage = await api.sendMessage(text, user.id, toId);
            setMessages(prev => [...prev, newMessage]);
        } catch(e) {
             addToast(`Error enviando mensaje: ${(e as Error).message}`, 'error');
        }
    };
    const markMessagesAsRead = useCallback(async (fromId: string) => {
        if (!user) return;
        try {
            await api.markMessagesAsRead(user.id, fromId);
            setMessages(prev => prev.map(m => (m.toId === user!.id && m.fromId === fromId) ? {...m, read: true} : m));
        } catch (e) {
            // silent fail is ok here
        }
    }, [user]);

    const value = {
        user, isAuthenticated, login, register, logout, updateProfile, changePassword,
        allProducts, archivedProducts, getProduct, addProduct, updateProduct, archiveProduct, deleteProductPermanently,
        collections, addCollection, updateCollection, deleteCollection,
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal,
        orders, getOrderDetail, placeOrder, cancelOrder, updateOrderStatus, checkIfUserPurchasedProduct,
        getReviewsForProduct, addProductReview,
        customers, deleteCustomer,
        messages, sendMessage, markMessagesAsRead, unreadMessagesCount,
        searchQuery, setSearchQuery, searchResults,
        loading, error, toasts, addToast, removeToast,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
