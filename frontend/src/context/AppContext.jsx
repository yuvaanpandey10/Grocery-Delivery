import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  withCredentials: true,
});

const AppContext = createContext();

const normalizeProduct = (product) => ({
  ...product,
  image: Array.isArray(product.image) ? product.image : [],
  description: Array.isArray(product.description) ? product.description : [],
});

const normalizeAddress = (address) => ({
  ...address,
  phone: address.phone ?? address.phoneNumber ?? "",
  zipcode: address.zipcode ?? address.postalCode ?? "",
});

const normalizeOrder = (order) => ({
  ...order,
  paymentType: order.paymentType ?? order.paymentMethod,
  items: (order.items ?? []).map((item) => ({
    ...item,
    product:
      typeof item.product === "object" && item.product
        ? normalizeProduct(item.product)
        : item.product,
  })),
  address:
    typeof order.address === "object" && order.address
      ? normalizeAddress(order.address)
      : order.address,
});

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const cartSaveQueue = useRef(Promise.resolve());

  const fetchProducts = useCallback(async () => {
    const { data } = await api.get("/api/product/list");
    if (!data.success || !Array.isArray(data.products)) {
      throw new Error(data.message || "Unable to load products");
    }
    setProducts(data.products.map(normalizeProduct));
    setProductsLoaded(true);
  }, []);

  const fetchOrders = useCallback(async () => {
    const { data } = await api.get("/api/order/user");
    if (!data.success || !Array.isArray(data.orders)) {
      throw new Error(data.message || "Unable to load orders");
    }
    setOrders(data.orders.map(normalizeOrder));
  }, []);

  const fetchAddresses = useCallback(async () => {
    const { data } = await api.get("/api/address/get");
    if (!data.success || !Array.isArray(data.addresses)) {
      throw new Error(data.message || "Unable to load addresses");
    }
    const fetchedAddresses = data.addresses.map(normalizeAddress);
    setAddresses(fetchedAddresses);
    setSelectedAddress((current) => current || fetchedAddresses[0] || null);
  }, []);

  const fetchSellerOrders = useCallback(async () => {
    const { data } = await api.get("/api/order/seller");
    if (!data.success || !Array.isArray(data.orders)) {
      throw new Error(data.message || "Unable to load seller orders");
    }
    setSellerOrders(data.orders.map(normalizeOrder));
  }, []);

  useEffect(() => {
    Promise.resolve()
      .then(fetchProducts)
      .catch((error) => {
        console.error("Unable to load products:", error);
        setProductsLoaded(true);
        toast.error(error.response?.data?.message || "Unable to load products");
      });

    api
      .get("/api/user/is-auth")
      .then(({ data }) => {
        if (!data.success || !data.user) {
          throw new Error(data.message || "Unable to verify your session");
        }
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        return Promise.all([fetchAddresses(), fetchOrders()]);
      })
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error("Unable to restore user session:", error);
          toast.error(
            error.response?.data?.message || "Unable to restore your session",
          );
        }
      });

    api
      .get("/api/seller/is-auth")
      .then(({ data }) => setIsSeller(Boolean(data.success)))
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error("Unable to restore seller session:", error);
          toast.error(
            error.response?.data?.message || "Unable to verify seller session",
          );
        }
      });
  }, [fetchAddresses, fetchOrders, fetchProducts]);

  useEffect(() => {
    if (!isSeller) return;
    Promise.resolve()
      .then(fetchSellerOrders)
      .catch((error) => {
        console.error("Unable to load seller orders:", error);
        toast.error(
          error.response?.data?.message || "Unable to load seller orders",
        );
      });
  }, [fetchSellerOrders, isSeller]);

  const userId = user?._id;
  useEffect(() => {
    if (!userId) return;
    const cartSnapshot = { ...cartItems };
    cartSaveQueue.current = cartSaveQueue.current.then(async () => {
        try {
          const { data } = await api.post("/api/cart/update", {
            cartItems: cartSnapshot,
          });
          if (!data.success) {
            throw new Error(data.message || "Unable to save your cart");
          }
        } catch (error) {
          console.error("Unable to save cart:", error);
          toast.error(
            error.response?.data?.message || error.message || "Unable to save your cart",
          );
        }
      });
  }, [cartItems, userId]);

  const addToCart = (itemId) => {
    setCartItems((current) => ({
      ...current,
      [itemId]: (current[itemId] || 0) + 1,
    }));
    toast.success("Item added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    setCartItems((current) => ({ ...current, [itemId]: quantity }));
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    setCartItems((current) => {
      const next = { ...current };
      if (next[itemId]) next[itemId] -= 1;
      if (!next[itemId]) delete next[itemId];
      return next;
    });
    toast.success("Removed from Cart");
  };

  const addAddress = async (address) => {
    const { data } = await api.post("/api/address/add", { address });
    if (!data.success || !data.address) {
      throw new Error(data.message || "Unable to save address");
    }
    const savedAddress = normalizeAddress(data.address);
    setAddresses((current) => [...current, savedAddress]);
    setSelectedAddress(savedAddress);
    toast.success("Address added");
  };

  const placeOrder = async ({ items, address }) => {
    const { data } = await api.post("/api/order/cod", {
      items: items.map(({ product, quantity }) => ({
        product: product._id,
        quantity,
      })),
      address: address._id,
    });
    if (!data.success || !data.order) {
      throw new Error(data.message || "Unable to place order");
    }

    const savedOrder = normalizeOrder({
      ...data.order,
      items: items.map(({ product, quantity }) => ({
        product,
        quantity,
      })),
      address,
    });
    setOrders((current) => [savedOrder, ...current]);
    setCartItems({});
    toast.success("Order placed successfully");
    return savedOrder;
  };

  const addProduct = async (formData) => {
    const { data } = await api.post("/api/product/add", formData);
    if (!data.success || !data.product) {
      throw new Error(data.message || "Unable to add product");
    }
    setProducts((current) => [normalizeProduct(data.product), ...current]);
    toast.success("Product added");
  };

  const updateProduct = async (id, changes, message = "Product updated") => {
    const { data } = await api.put(`/api/product/${id}`, changes);
    if (!data.success || !data.product) {
      throw new Error(data.message || "Unable to update product");
    }
    const updatedProduct = normalizeProduct(data.product);
    setProducts((current) =>
      current.map((product) =>
        product._id === id ? updatedProduct : product,
      ),
    );
    toast.success(message);
  };

  const updateProductStock = async (id, inStock) => {
    const { data } = await api.post("/api/product/stock", { id, inStock });
    if (!data.success) {
      throw new Error(data.message || "Unable to update product stock");
    }
    setProducts((current) =>
      current.map((product) =>
        product._id === id ? { ...product, inStock } : product,
      ),
    );
    toast.success("Stock updated");
  };

  const deleteProduct = async (id) => {
    const { data } = await api.delete(`/api/product/${id}`);
    if (!data.success) {
      throw new Error(data.message || "Unable to delete product");
    }
    setProducts((current) => current.filter((product) => product._id !== id));
    toast.success("Product deleted");
  };

  const updateOrderStatus = async (orderId, status) => {
    const { data } = await api.patch(`/api/order/${orderId}/status`, { status });
    if (!data.success) {
      throw new Error(data.message || "Unable to update order status");
    }
    setOrders((current) =>
      current.map((order) =>
        order._id === orderId ? { ...order, status } : order,
      ),
    );
    setSellerOrders((current) =>
      current.map((order) =>
        order._id === orderId ? { ...order, status } : order,
      ),
    );
    toast.success("Order status updated");
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    productsLoaded,
    setProducts,
    fetchProducts,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    addresses,
    setAddresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    orders,
    sellerOrders,
    setSellerOrders,
    fetchOrders,
    fetchAddresses,
    fetchSellerOrders,
    placeOrder,
    addProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
    updateOrderStatus,
    axios: api,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
