import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Product, User, CartItem, Order, Message, ToastMessage, Review, Collection } from '../types';
import { db, PendingRegistration } from '../services/db';
import { supabase } from '../services/supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Helper to extract our custom user metadata from Supabase user
const formatSupabaseUser = (supabaseUser: any): User | null => {
    if (!supabaseUser) return null;
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        firstName: supabaseUser.user_metadata?.firstName || '',
        paternalLastName: supabaseUser.user_metadata?.paternalLastName || '',
        maternalLastName: supabaseUser.user_metadata?.maternalLastName || '',
        address: supabaseUser.user_metadata?.address || '',
        role: supabaseUser.user_metadata?.role || 'customer',
    };
};

interface AppContextType {
  // Auth & User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string; }>;
  register: (userData: PendingRegistration) => Promise<{ success: boolean; message: string; }>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<User | null>;
  updateUserPassword: (newPassword: string) => Promise<{ error?: string }>;
  forgotPassword: (email: string) => Promise<boolean>;

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

  // Wishlist
  wishlist: Product[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isProductInWishlist: (productId: string) => boolean;

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
    const [session, setSession] = useState<Session | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
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
        setToasts(prevToasts => {
            if (prevToasts.some(t => t.message === message)) {
                return prevToasts;
            }
            const id = Date.now();
            return [...prevToasts, { id, message, type }];
        });
    }, []);
    
    // --- Supabase Auth Listener ---
    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(formatSupabaseUser(session?.user));
            setIsAuthenticated(!!session);
            setLoading(false); // Initial auth check is done
        };

        getInitialSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, session: Session | null) => {
                setSession(session);
                const currentUser = formatSupabaseUser(session?.user);
                setUser(currentUser);
                setIsAuthenticated(!!session);

                if (event === 'SIGNED_IN') {
                    addToast(`¡Bienvenido, ${currentUser?.firstName}!`, 'success');
                }
                 if (event === 'PASSWORD_RECOVERY') {
                    addToast('Puedes establecer una nueva contraseña.', 'info');
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [addToast]);

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [productsData, collectionsData] = await Promise.all([
                 supabase.from('products').select('*, reviews(rating)').eq('isArchived', false).order('createdAt', { ascending: false }),
                 supabase.from('collections').select('*').order('name', { ascending: true })
            ]);

            if (productsData.error) throw productsData.error;
            if (collectionsData.error) throw collectionsData.error;
            
            const productsWithRatings = productsData.data.map(p => {
                 const reviews = (p.reviews as unknown as { rating: number }[]) || [];
                 const reviewCount = reviews.length;
                 const averageRating = reviewCount > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount : 0;
                 return { ...p, averageRating, reviewCount, reviews: undefined };
            });

            setAllProducts(productsWithRatings as Product[]);
            setCollections(collectionsData.data as Collection[]);

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
                 supabase.from('products').select('*').eq('isArchived', true).order('createdAt', { ascending: false }),
                 supabase.from('orders').select('*, user:users(*)').order('date', { ascending: false }),
                 supabase.from('users').select('*').eq('role', 'customer')
            ]);
            if (archived.error) throw archived.error;
            if (allOrders.error) throw allOrders.error;
            if (allCustomers.error) throw allCustomers.error;

            setArchivedProducts(archived.data as Product[]);
            setOrders(allOrders.data.map(o => ({...o, shippingInfo: o.user})) as Order[]);
            setCustomers(allCustomers.data as User[]);
        } catch (e) {
            addToast(`Error al cargar datos de admin: ${(e as Error).message}`, 'error');
        }
    }, [user, addToast]);

    const fetchUserData = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setOrders([]);
            setMessages([]);
            setWishlist([]);
            return;
        }
        try {
            if (user.role === 'customer') {
                const [userOrders, userMessages, userWishlist] = await Promise.all([
                    supabase.from('orders').select('*, items:order_items(*, product:products(*))').eq('userId', user.id).order('date', { ascending: false }),
                    supabase.from('messages').select('*').or(`fromId.eq.${user.id},toId.eq.${user.id}`),
                    supabase.from('wishlist').select('product:products(*, reviews(rating))').eq('userId', user.id)
                ]);
                if (userOrders.error) throw userOrders.error;
                if (userMessages.error) throw userMessages.error;
                if (userWishlist.error) throw userWishlist.error;

                setOrders(userOrders.data as Order[]);
                setMessages(userMessages.data as Message[]);
                const wishlistProducts = userWishlist.data.map(item => {
                    const product = item.product as any;
                    const reviews = (product.reviews as { rating: number }[]) || [];
                    const reviewCount = reviews.length;
                    const averageRating = reviewCount > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount : 0;
                    return { ...product, averageRating, reviewCount, reviews: undefined };
                });
                setWishlist(wishlistProducts);
            } else if (user.role === 'admin') {
                const { data, error } = await supabase.from('messages').select('*');
                if (error) throw error;
                setMessages(data as Message[]);
            }
        } catch (e) {
            addToast(`Error al cargar tus datos: ${(e as Error).message}`, 'error');
        }
    }, [isAuthenticated, user, addToast]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchAdminData();
        fetchUserData();
    }, [session, fetchAdminData, fetchUserData]);
    
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    // --- Auth Methods ---
    const login = useCallback(async (email: string, pass: string): Promise<{ error?: string; }> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
            let userMessage = 'Credenciales inválidas.';
            if (error.message.includes('Email not confirmed')) {
                userMessage = 'Por favor, verifica tu correo electrónico para iniciar sesión.';
            }
            return { error: userMessage };
        }
        return {};
    }, []);

    const register = useCallback(async (userData: PendingRegistration): Promise<{ success: boolean; message: string; }> => {
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                firstName: userData.firstName,
                paternalLastName: userData.paternalLastName,
                maternalLastName: userData.maternalLastName,
                address: userData.address,
                role: 'customer',
              }
            }
          });
        
        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true, message: '¡Registro exitoso! Revisa tu correo para activar tu cuenta.' };
    }, []);
    
    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
        setSession(null);
        setCart([]);
        setWishlist([]);
        setOrders([]);
        setMessages([]);
        addToast('Has cerrado sesión.', 'info');
    }, [addToast]);

    const updateProfile = async (profileData: Partial<User>): Promise<User | null> => {
       try {
            const { data, error } = await supabase.auth.updateUser({
                data: {
                    firstName: profileData.firstName,
                    paternalLastName: profileData.paternalLastName,
                    maternalLastName: profileData.maternalLastName,
                    address: profileData.address,
                }
            });
            if (error) throw error;
            const updatedUser = formatSupabaseUser(data.user);
            setUser(updatedUser);
            addToast('Perfil actualizado.', 'success');
            return updatedUser;
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
            return null;
        }
    };

    const updateUserPassword = async (newPassword: string): Promise<{ error?: string }> => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            addToast(error.message, 'error');
            return { error: error.message };
        }
        addToast('Contraseña actualizada con éxito.', 'success');
        return {};
    };

    const forgotPassword = async (email: string): Promise<boolean> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/#/update-password',
        });
        if (error) {
            addToast(error.message, 'error');
            return false;
        }
        return true;
    };

    // --- Product Methods ---
    const getProduct = useCallback(async (id: string) => {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) return undefined;
        return data as Product;
    }, []);
    
    const addProduct = async (productData: Omit<Product, 'id'>): Promise<boolean> => {
        try {
            const { error } = await supabase.from('products').insert([productData]);
            if (error) throw error;
            addToast('Producto añadido.', 'success');
            await fetchData();
            return true;
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
            return false;
        }
    };
    
    const updateProduct = async (updatedProduct: Product) => {
        try {
            const { id, averageRating, reviewCount, ...updateData } = updatedProduct;
            const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select().single();
            if (error) throw error;
            addToast('Producto actualizado.', 'success');
            await fetchData();
            await fetchAdminData();
            return data as Product;
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
            return null;
        }
    };

    const archiveProduct = async (productId: string) => {
        try {
            const { error } = await supabase.from('products').update({ isArchived: true }).eq('id', productId);
            if (error) throw error;
            addToast('Producto archivado.', 'success');
            await fetchData();
            await fetchAdminData();
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    const deleteProductPermanently = async (productId: string) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) throw error;
            addToast('Producto eliminado.', 'success');
            await fetchData();
            await fetchAdminData();
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    // --- Collection Methods ---
    const addCollection = async (collectionData: Omit<Collection, 'id'>) => {
        try {
            const { error } = await supabase.from('collections').insert([collectionData]);
            if (error) throw error;
            addToast('Colección añadida.', 'success');
            await fetchData();
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };
    const updateCollection = async (updatedCollection: Collection) => {
        try {
            const { id, ...updateData } = updatedCollection;
            const { error } = await supabase.from('collections').update(updateData).eq('id', id);
            if (error) throw error;
            addToast('Colección actualizada.', 'success');
            await fetchData();
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };
    const deleteCollection = async (collectionId: string) => {
        try {
            const { error } = await supabase.from('collections').delete().eq('id', collectionId);
            if (error) throw error;
            addToast('Colección eliminada.', 'success');
            await fetchData();
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

    // --- Wishlist Methods ---
    const isProductInWishlist = useCallback((productId: string) => {
        return wishlist.some(item => item.id === productId);
    }, [wishlist]);

    const addToWishlist = async (productId: string) => {
        if (!user) {
            addToast('Debes iniciar sesión para añadir a tu lista de deseos.', 'info');
            return;
        }
        try {
            const { error } = await supabase.from('wishlist').insert([{ userId: user.id, productId: productId }]);
            if (error) throw error;
            addToast('Añadido a la lista de deseos.', 'success');
            await fetchUserData();
        } catch (e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('wishlist').delete().match({ userId: user.id, productId: productId });
            if (error) throw error;
            addToast('Eliminado de la lista de deseos.', 'info');
            await fetchUserData();
        } catch (e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    // --- Order Methods ---
    const placeOrder = useCallback(async (): Promise<boolean> => {
        if (!user || cart.length === 0) {
            addToast('El carrito está vacío o no has iniciado sesión.', 'error');
            return false;
        }
        try {
            const { error } = await supabase.rpc('create_order', {
                p_user_id: user.id,
                p_cart_items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
                p_shipping_info: {
                    firstName: user.firstName,
                    paternalLastName: user.paternalLastName,
                    maternalLastName: user.maternalLastName,
                    email: user.email,
                    address: user.address,
                }
            });

            if (error) throw error;
            
            addToast('¡Pedido realizado con éxito!', 'success');
            clearCart();
            await fetchData();
            await fetchUserData();
            return true;
        } catch (e) {
            addToast(`Error al realizar el pedido: ${(e as Error).message}`, 'error');
            return false;
        }
    }, [user, cart, addToast, clearCart, fetchData, fetchUserData]);
    
    const getOrderDetail = useCallback(async (orderId: string) => {
        if (!user) return null;
        const { data, error } = await supabase.from('orders').select('*, items:order_items(*, product:products(*)), user:users(*)').eq('id', orderId).single();
        if (error || !data) return null;
        return { ...data, shippingInfo: data.user } as Order;
    }, [user]);
    
    const cancelOrder = async (orderId: string) => {
        if (!user) return;
        try {
            const { error } = await supabase.rpc('cancel_order_user', { p_order_id: orderId, p_user_id: user.id });
            if (error) throw error;
            addToast('Pedido cancelado.', 'success');
            await fetchData();
            await fetchUserData();
        } catch(e) {
             addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };
    const updateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            const { error } = await supabase.from('orders').update({ status, deliveryDate: status === 'Entregado' ? new Date().toISOString() : null }).eq('id', orderId);
            if (error) throw error;
            addToast('Estado del pedido actualizado.', 'success');
            await fetchAdminData();
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    const checkIfUserPurchasedProduct = (productId: string) => {
        return orders.some(order => order.status === 'Entregado' && order.items.some(item => item.id === productId));
    };

    // --- Review Methods ---
    const getReviewsForProduct = async (productId: string) => {
        const { data, error } = await supabase.from('reviews').select('*, user:users(firstName, paternalLastName)').eq('productId', productId);
        if (error || !data) return [];
        return data.map(r => ({ ...r, userName: `${r.user.firstName} ${r.user.paternalLastName}`.trim() })) as Review[];
    };
    
    const addProductReview = async (productId: string, rating: number, comment: string): Promise<{ success: boolean; message?: string }> => {
        if (!user) return { success: false, message: 'User not logged in' };
        try {
            const { error } = await supabase.from('reviews').upsert({ productId, userId: user.id, rating, comment });
            if (error) throw error;
            addToast('Opinión enviada. ¡Gracias!', 'success');
            await fetchData();
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
            const { error } = await supabase.from('users').delete().eq('id', customerId);
            if (error) throw error;
            addToast('Cliente eliminado.', 'success');
            await fetchAdminData();
        } catch(e) {
            addToast(`Error: ${(e as Error).message}`, 'error');
        }
    };

    // --- Message Methods ---
    const sendMessage = async (text: string, toId: string) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('messages').insert([{ fromId: user.id, toId, text }]);
            if (error) throw error;
            await fetchUserData();
        } catch(e) {
             addToast(`Error enviando mensaje: ${(e as Error).message}`, 'error');
        }
    };
    const markMessagesAsRead = useCallback(async (fromId: string) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('messages').update({ read: true }).match({ toId: user.id, fromId });
            if (error) throw error;
            await fetchUserData();
        } catch (e) {
            // silent fail is ok here
        }
    }, [user, fetchUserData]);

    const value = {
        user, isAuthenticated, login, register, logout, updateProfile, updateUserPassword, forgotPassword,
        allProducts, archivedProducts, getProduct, addProduct, updateProduct, archiveProduct, deleteProductPermanently,
        collections, addCollection, updateCollection, deleteCollection,
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal,
        wishlist, addToWishlist, removeFromWishlist, isProductInWishlist,
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
