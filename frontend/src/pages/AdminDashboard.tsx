import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
type Order = {
  _id: string;
  user: { name: string; email: string } | string;
  items: { product?: { name: string } | string; name?: string; quantity: number; price: number; size: string }[];
  shippingCost: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress: {
    label?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  addressId?: {
    recipientName?: string;
    phone?: string;
  } | string | null;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  badge?: string;
  shortDesc: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  size: string;
  longevity: string;
  sillage: string;
  season: string[];
  averageRating: number;
};

type Category = {
  _id: string;
  slug: string;
  label: string;
  desc: string;
  img: string;
  bannerImg: string;
};

type ActiveSection = "dashboard" | "orders" | "products" | "categories";

type NavItem = {
  id: ActiveSection;
  icon: string;
  label: string;
  badge?: number | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const API = "http://localhost:5000/api";

const statusColor: Record<string, string> = {
  pending: "#d97706",
  confirmed: "#2563eb",
  shipped: "#7c3aed",
  delivered: "#059669",
  cancelled: "#dc2626",
};

const statusBg: Record<string, string> = {
  pending: "rgba(217,119,6,0.12)",
  confirmed: "rgba(37,99,235,0.12)",
  shipped: "rgba(124,58,237,0.12)",
  delivered: "rgba(5,150,105,0.12)",
  cancelled: "rgba(220,38,38,0.12)",
};

// Display labels for UI (capitalized)
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Backend enum values (lowercase) — what we send to the API
const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function fmt(n: number) { return `Rs. ${(n || 0).toLocaleString()}`; }
function orderTotal(o: { items: { price: number; quantity: number }[]; shippingCost: number }): number {
  const itemsSum = (o.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
  return itemsSum + (o.shippingCost || 0);
}
function shortId(id: string) { return `#${id.slice(-8).toUpperCase()}`; }
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string | number; accent: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(75,86,148,0.18)", borderRadius: 16, padding: "1.4rem 1.6rem", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", gap: "1.1rem" }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: "1.5rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#111844" }}>{value}</div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", color: statusColor[status] || "#111844", background: statusBg[status] || "rgba(17,24,68,0.08)" }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ─── Empty Product form ───────────────────────────────────────────────────────
const emptyProduct: Omit<Product, "_id" | "averageRating"> = {
  name: "", price: 0, category: "", brand: "", images: [""],
  badge: "", shortDesc: "", description: "",
  notes: { top: [""], heart: [""], base: [""] },
  size: "", longevity: "", sillage: "", season: [],
};

const emptyCategory: Omit<Category, "_id"> = {
  slug: "", label: "", desc: "", img: "", bannerImg: "",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState<ActiveSection>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Orders state
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Products state
  const [productSearch, setProductSearch] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Omit<Product, "_id" | "averageRating">>(emptyProduct);
  const [productSaving, setProductSaving] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Category state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<Omit<Category, "_id">>(emptyCategory);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryImgFile, setCategoryImgFile] = useState<File | null>(null);
  const [categoryBannerFile, setCategoryBannerFile] = useState<File | null>(null);

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  // ── Fetch all data ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    const loadAll = async () => {
      try {
        setLoading(true);
        const adminCheck = await fetch(`${API}/user/admin-only`, { headers: authHeaders() });
        if (adminCheck.status === 401) { logout("expired"); return; }
        if (adminCheck.status === 403) { navigate("/", { replace: true }); return; }

        const [ordRes, prodRes, catRes] = await Promise.all([
          fetch(`${API}/orders/all`, { headers: authHeaders() }),
          fetch(`${API}/products`),
          fetch(`${API}/categories`),
        ]);

        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(Array.isArray(ordData) ? ordData : ordData.orders || []);
        }
        if (prodRes.ok) setProducts(await prodRes.json());
        if (catRes.ok) setCategories(await catRes.json());
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [token, logout, navigate, authHeaders]);

  // ── Update order status ─────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId); // stores which item is currently being updated
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as Order["status"] } : o));
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as Order["status"] } : null);
        }
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── Delete order ────────────────────────────────────────────────────────────
  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Delete this order permanently? This cannot be undone.")) return;
    setDeletingOrderId(orderId);
    try {
      const res = await fetch(`${API}/orders/${orderId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
        if (selectedOrder?._id === orderId) setSelectedOrder(null);
      } else {
        alert("Failed to delete order.");
      }
    } finally {
      setDeletingOrderId(null);
    }
  };

  // ── Product CRUD ────────────────────────────────────────────────────────────
  const openAddProduct = () => { // when admin click add product button
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setShowProductModal(true);
  };

  const openEditProduct = (p: Product) => {  // when admin click edit product 
    setEditingProduct(p);
    setProductForm({ // filling with existing data
      name: p.name, price: p.price, category: p.category, brand: p.brand,
      images: p.images?.length ? p.images : [""],
      badge: p.badge || "", shortDesc: p.shortDesc, description: p.description,
      notes: p.notes || { top: [""], heart: [""], base: [""] },
      size: p.size, longevity: p.longevity, sillage: p.sillage,
      season: p.season || [],
    });
    setShowProductModal(true);
  };
  const saveProduct = async () => {
    setProductSaving(true);
    let finalImageUrls = [...productForm.images];

    try {
      // 1. UPLOAD STEP: If files were selected, upload them first
      if (selectedFiles.length > 0) {
        const uploadedUrls: string[] = [];
        
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append("image", file); // Must match the name in your multer middleware
          formData.append("folder", "products"); // Keep product images in their own S3 folder

          const res = await fetch("http://localhost:5000/api/upload/image", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (res.ok) {
            uploadedUrls.push(data.imageUrl);
          } else {
            throw new Error("Upload failed: " + data.message);
          }
        }
        finalImageUrls = uploadedUrls;
      }

      // 2. DATABASE STEP: Send the product with the S3 URLs
      const method = editingProduct ? "PUT" : "POST"; //post -> update and put -> add
      const url = editingProduct ? `${API}/products/${editingProduct._id}` : `${API}/products`;

      const body = {
        ...productForm,
        images: finalImageUrls.filter(i => i.trim()),
        notes: {
          top: productForm.notes.top.filter(n => n.trim()),
          heart: productForm.notes.heart.filter(n => n.trim()),
          base: productForm.notes.base.filter(n => n.trim()),
        },
        season: productForm.season,
      };

      const res = await fetch(url, { // save to the db
        method,
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (editingProduct) {// replavce old
          setProducts(prev => prev.map(p => p._id === editingProduct._id ? data.product : p));
        } else {// if new
          setProducts(prev => [...prev, data.product]);
        }
        setSelectedFiles([]);
        setShowProductModal(false);
      } else {
        alert(data.message || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    } finally {
      setProductSaving(false);
    }
  };

  
  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Delete this product permanently?")) return;
    const res = await fetch(`${API}/products/${productId}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p._id !== productId));
    } else {
      alert("Failed to delete product.");
    }
  };

  // ── Category CRUD ───────────────────────────────────────────────────────────
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm(emptyCategory);
    setCategoryImgFile(null);
    setCategoryBannerFile(null);
    setShowCategoryModal(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryForm({ slug: c.slug, label: c.label, desc: c.desc, img: c.img, bannerImg: c.bannerImg });
    setCategoryImgFile(null);
    setCategoryBannerFile(null);
    setShowCategoryModal(true);
  };

  const saveCategory = async () => {
    if (!editingCategory && (!categoryImgFile || !categoryBannerFile)) {
      alert("Please select both a card image and a banner image for a new category.");
      return;
    }

    setCategorySaving(true);
    try {
      let finalImg = categoryForm.img;
      let finalBannerImg = categoryForm.bannerImg;

      // Helper to upload a single file into the "categories" S3 folder
      const uploadCategoryFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", "categories");

        const res = await fetch("http://localhost:5000/api/upload/image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        return data.imageUrl;
      };

      // Upload card image if a new file was selected
      if (categoryImgFile) {
        finalImg = await uploadCategoryFile(categoryImgFile);
      }

      // Upload banner image if a new file was selected
      if (categoryBannerFile) {
        finalBannerImg = await uploadCategoryFile(categoryBannerFile);
      }

      const body = { ...categoryForm, img: finalImg, bannerImg: finalBannerImg };

      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory ? `${API}/categories/${editingCategory._id}` : `${API}/categories`;
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        if (editingCategory) {
          setCategories(prev => prev.map(c => c._id === editingCategory._id ? data.category : c));
        } else {
          setCategories(prev => [...prev, data.category]);
        }
        setCategoryImgFile(null);
        setCategoryBannerFile(null);
        setShowCategoryModal(false);
      } else {
        alert(data.message || "Failed to save category.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error saving category.");
    } finally {
      setCategorySaving(false);
    }
  };

  const deleteCategory = async (catId: string) => {
    if (!window.confirm("Delete this category permanently?")) return;
    const res = await fetch(`${API}/categories/${catId}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      setCategories(prev => prev.filter(c => c._id !== catId));
    } else {
      alert("Failed to delete category.");
    }
  };

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + orderTotal(o), 0);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  const filteredOrders = orders.filter(o => {
    const userName = typeof o.user === "object" ? o.user.name : "";
    const userEmail = typeof o.user === "object" ? o.user.email : "";
    const matchSearch = !orderSearch || userName.toLowerCase().includes(orderSearch.toLowerCase()) || userEmail.toLowerCase().includes(orderSearch.toLowerCase()) || o._id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredProducts = products.filter(p =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#EAE0CF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#111844" }}>
        Loading Admin Panel...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#EAE0CF", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0392b", fontFamily: "'Jost', sans-serif" }}>
        ⚠ {error}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .adm-root { display: flex; min-height: 100vh; background: #EAE0CF; font-family: 'Jost', sans-serif; color: #111844; }

        .adm-sidebar { width: 240px; background: linear-gradient(180deg, #111844 0%, #1a245c 100%); display: flex; flex-direction: column; flex-shrink: 0; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
        .adm-brand { padding: 1.8rem 1.6rem 1.4rem; border-bottom: 1px solid rgba(234,224,207,0.1); }
        .adm-brand-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 500; color: #EAE0CF; letter-spacing: 0.08em; }
        .adm-brand-sub { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(234,224,207,0.45); margin-top: 2px; }
        .adm-nav { flex: 1; padding: 1.2rem 0.8rem; display: flex; flex-direction: column; gap: 4px; }
        .adm-nav-label { font-size: 0.58rem; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(234,224,207,0.3); padding: 0.8rem 0.8rem 0.4rem; }
        .adm-nav-btn { display: flex; align-items: center; gap: 10px; padding: 0.75rem 1rem; border-radius: 10px; border: none; background: transparent; color: rgba(234,224,207,0.65); font-family: 'Jost', sans-serif; font-size: 0.82rem; letter-spacing: 0.05em; cursor: pointer; text-align: left; transition: all 0.2s; width: 100%; position: relative; }
        .adm-nav-btn:hover { background: rgba(234,224,207,0.08); color: #EAE0CF; }
        .adm-nav-btn.active { background: rgba(114,136,174,0.25); color: #EAE0CF; }
        .adm-nav-btn.active::before { content: ''; position: absolute; left: 0; top: 20%; height: 60%; width: 3px; background: #7288AE; border-radius: 0 3px 3px 0; }
        .adm-nav-icon { font-size: 1rem; width: 20px; text-align: center; }
        .adm-badge { margin-left: auto; background: rgba(217,119,6,0.9); color: #fff; font-size: 0.62rem; font-weight: 700; padding: 2px 7px; border-radius: 999px; min-width: 20px; text-align: center; }
        .adm-sidebar-footer { padding: 1rem 0.8rem; border-top: 1px solid rgba(234,224,207,0.1); }
        .adm-user-pill { display: flex; align-items: center; gap: 10px; padding: 0.7rem 0.8rem; border-radius: 10px; background: rgba(234,224,207,0.06); border: 1px solid rgba(234,224,207,0.1); margin-bottom: 8px; }
        .adm-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #4B5694, #7288AE); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; color: #EAE0CF; flex-shrink: 0; }
        .adm-user-name { font-size: 0.78rem; color: #EAE0CF; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adm-user-role { font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #7288AE; }
        .adm-logout-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid rgba(220,38,38,0.25); background: transparent; color: rgba(252,165,165,0.8); font-family: 'Jost', sans-serif; font-size: 0.78rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; }
        .adm-logout-btn:hover { background: rgba(220,38,38,0.12); border-color: rgba(220,38,38,0.5); color: #fca5a5; }

        .adm-main { margin-left: 240px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
        .adm-topbar { background: rgba(234,224,207,0.7); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(75,86,148,0.15); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .adm-page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 500; color: #111844; letter-spacing: 0.04em; }
        .adm-content { padding: 2rem; flex: 1; }

        .adm-card { background: rgba(255,255,255,0.55); border: 1px solid rgba(75,86,148,0.15); border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px); }
        .adm-card-header { padding: 1.2rem 1.5rem; border-bottom: 1px solid rgba(75,86,148,0.1); display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .adm-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 500; color: #111844; }

        .adm-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .adm-table th { padding: 0.75rem 1.2rem; text-align: left; font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: #7288AE; font-weight: 500; background: rgba(17,24,68,0.03); border-bottom: 1px solid rgba(75,86,148,0.1); }
        .adm-table td { padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(75,86,148,0.07); color: rgba(17,24,68,0.85); vertical-align: middle; }
        .adm-table tr:last-child td { border-bottom: none; }
        .adm-table tr:hover td { background: rgba(75,86,148,0.04); }

        .adm-input { background: rgba(255,255,255,0.7); border: 1px solid rgba(75,86,148,0.25); border-radius: 8px; padding: 0.5rem 0.85rem; font-family: 'Jost', sans-serif; font-size: 0.82rem; color: #111844; outline: none; transition: 0.2s; }
        .adm-input:focus { border-color: #4B5694; box-shadow: 0 0 0 3px rgba(75,86,148,0.1); }
        .adm-textarea { background: rgba(255,255,255,0.7); border: 1px solid rgba(75,86,148,0.25); border-radius: 8px; padding: 0.5rem 0.85rem; font-family: 'Jost', sans-serif; font-size: 0.82rem; color: #111844; outline: none; transition: 0.2s; resize: vertical; width: 100%; min-height: 80px; }

        .filter-pill { padding: 5px 14px; border-radius: 999px; border: 1px solid rgba(75,86,148,0.25); background: transparent; font-size: 0.72rem; letter-spacing: 0.1em; color: rgba(17,24,68,0.65); cursor: pointer; transition: all 0.2s; font-family: 'Jost', sans-serif; }
        .filter-pill.active, .filter-pill:hover { background: #111844; color: #EAE0CF; border-color: #111844; }

        .adm-action-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(75,86,148,0.3); background: transparent; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em; color: #111844; cursor: pointer; transition: 0.2s; }
        .adm-action-btn:hover { background: #111844; color: #EAE0CF; border-color: #111844; }
        .adm-action-btn.danger { border-color: rgba(220,38,38,0.35); color: #dc2626; }
        .adm-action-btn.danger:hover { background: #dc2626; color: #fff; border-color: #dc2626; }
        .adm-action-btn.primary { background: #111844; color: #EAE0CF; border-color: #111844; }
        .adm-action-btn.primary:hover { background: #4B5694; border-color: #4B5694; }

        .adm-overlay { position: fixed; inset: 0; background: rgba(17,24,68,0.5); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .adm-modal { background: #EAE0CF; border-radius: 20px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative; border: 1px solid rgba(75,86,148,0.2); box-shadow: 0 30px 70px rgba(17,24,68,0.3); }
        .adm-modal-lg { max-width: 760px; }
        .adm-modal-close { position: absolute; top: 1.2rem; right: 1.2rem; width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(17,24,68,0.2); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: #111844; transition: 0.2s; }
        .adm-modal-close:hover { background: rgba(17,24,68,0.08); }

        .adm-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem; margin-bottom: 1.8rem; }
        .adm-two-col { display: grid; grid-template-columns: 2fr 1fr; gap: 1.4rem; margin-bottom: 1.8rem; }

        .prod-thumb { width: 38px; height: 46px; border-radius: 6px; object-fit: cover; background: rgba(17,24,68,0.08); border: 1px solid rgba(75,86,148,0.12); }
        .cat-thumb { width: 52px; height: 36px; border-radius: 6px; object-fit: cover; background: rgba(17,24,68,0.08); border: 1px solid rgba(75,86,148,0.12); }

        /* Form grid inside modals */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: #7288AE; font-weight: 500; }

        .actions-cell { display: flex; gap: 6px; align-items: center; }

        @media (max-width: 1100px) {
          .adm-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .adm-two-col { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .adm-sidebar { width: 200px; }
          .adm-main { margin-left: 200px; }
          .adm-content { padding: 1rem; }
          .adm-stats-grid { grid-template-columns: 1fr 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="adm-root">

        {/* ── SIDEBAR ──────────────────────────────────────────── */}
        <aside className="adm-sidebar">
          <div className="adm-brand">
            <div className="adm-brand-name">Eloura</div>
            <div className="adm-brand-sub">Admin Panel</div>
          </div>
          <nav className="adm-nav">
            <div className="adm-nav-label">Navigation</div>
            {([
              { id: "dashboard", icon: "◈", label: "Dashboard" },
              { id: "orders", icon: "◉", label: "Orders", badge: pendingCount > 0 ? pendingCount : null },
              { id: "products", icon: "✦", label: "Products" },
              { id: "categories", icon: "❋", label: "Categories" },
            ] as NavItem[]).map(item => (
              <button key={item.id} className={`adm-nav-btn ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge ? <span className="adm-badge">{item.badge}</span> : null}
              </button>
            ))}
          </nav>
          <div className="adm-sidebar-footer">
            <div className="adm-user-pill">
              <div className="adm-avatar">{user?.name?.charAt(0).toUpperCase() ?? "A"}</div>
              <div>
                <div className="adm-user-name">{user?.name}</div>
                <div className="adm-user-role">Administrator</div>
              </div>
            </div>
            <button className="adm-logout-btn" onClick={() => logout("manual")}>
              <span>↩</span> Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ─────────────────────────────────────────────── */}
        <main className="adm-main">
          <div className="adm-topbar">
            <div className="adm-page-title">
              {active === "dashboard" && "Dashboard"}
              {active === "orders" && "Orders"}
              {active === "products" && "Products"}
              {active === "categories" && "Categories"}
            </div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4B5694" }}>
              {new Date().toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          <div className="adm-content">

            {/* ═══════════════════════════════════════════════════
                DASHBOARD
            ═══════════════════════════════════════════════════ */}
            {active === "dashboard" && (
              <>
                <div className="adm-stats-grid">
                  <StatCard icon="₨" label="Total Revenue" value={fmt(totalRevenue)} accent="rgba(75,86,148,0.15)" />
                  <StatCard icon="◉" label="Total Orders" value={orders.length} accent="rgba(5,150,105,0.12)" />
                  <StatCard icon="✦" label="Total Products" value={products.length} accent="rgba(124,58,237,0.1)" />
                  <StatCard icon="❋" label="Categories" value={categories.length} accent="rgba(217,119,6,0.12)" />
                </div>
                <div className="adm-two-col">
                  <div className="adm-card">
                    <div className="adm-card-header">
                      <span className="adm-card-title">Recent Orders</span>
                      <button className="adm-action-btn" onClick={() => setActive("orders")}>View All →</button>
                    </div>
                    <table className="adm-table">
                      <thead>
                        <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                        {recentOrders.length === 0 ? (
                          <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#7288AE" }}>No orders yet</td></tr>
                        ) : recentOrders.map(o => (
                          <tr key={o._id} style={{ cursor: "pointer" }} onClick={() => setSelectedOrder(o)}>
                            <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4B5694" }}>{shortId(o._id)}</td>
                            <td>
                              <div style={{ fontWeight: 500, fontSize: "0.82rem" }}>{typeof o.user === "object" ? o.user.name : "—"}</div>
                              <div style={{ fontSize: "0.7rem", color: "#7288AE" }}>{typeof o.user === "object" ? o.user.email : ""}</div>
                            </td>
                            <td style={{ fontWeight: 600 }}>{fmt(orderTotal(o))}</td>
                            <td><StatusPill status={o.status} /></td>
                            <td style={{ color: "#7288AE", fontSize: "0.76rem" }}>{formatDate(o.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="adm-card">
                    <div className="adm-card-header"><span className="adm-card-title">Order Status</span></div>
                    <div style={{ padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                      {ORDER_STATUSES.map(s => {
                        const count = orders.filter(o => o.status === s).length;
                        const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                        return (
                          <div key={s}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ fontSize: "0.78rem", color: statusColor[s], fontWeight: 500 }}>{STATUS_LABELS[s]}</span>
                              <span style={{ fontSize: "0.78rem", color: "#7288AE" }}>{count} · {pct}%</span>
                            </div>
                            <div style={{ height: 5, borderRadius: 999, background: "rgba(17,24,68,0.08)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: statusColor[s], borderRadius: 999, transition: "width 0.6s ease" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ borderTop: "1px solid rgba(75,86,148,0.1)", padding: "1.2rem 1.5rem" }}>
                      <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: "0.8rem" }}>Categories</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {categories.map(c => (
                          <span key={c.slug} style={{ padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(75,86,148,0.25)", fontSize: "0.72rem", color: "#4B5694", background: "rgba(75,86,148,0.06)" }}>
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════
                ORDERS
            ═══════════════════════════════════════════════════ */}
            {active === "orders" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                  {(["pending", "confirmed", "shipped", "delivered"] as const).map(s => (
                    <StatCard key={s} icon={s === "pending" ? "⏳" : s === "confirmed" ? "⚙" : s === "shipped" ? "🚚" : "✅"} label={STATUS_LABELS[s]} value={orders.filter(o => o.status === s).length} accent={statusBg[s]} />
                  ))}
                </div>
                <div className="adm-card">
                  <div className="adm-card-header">
                    <span className="adm-card-title">All Orders ({filteredOrders.length})</span>
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                      <input className="adm-input" placeholder="Search customer, email, ID…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} style={{ width: 220 }} />
                      {["All", ...ORDER_STATUSES].map(s => (
                        <button key={s} className={`filter-pill ${orderStatusFilter === s ? "active" : ""}`} onClick={() => setOrderStatusFilter(s)}>{s === "All" ? "All" : STATUS_LABELS[s]}</button>
                      ))}
                    </div>
                  </div>
                  <table className="adm-table">
                    <thead>
                      <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr><td colSpan={8} style={{ textAlign: "center", padding: "2.5rem", color: "#7288AE" }}>No orders found</td></tr>
                      ) : filteredOrders.map(o => (
                        <tr key={o._id}>
                          <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4B5694" }}>{shortId(o._id)}</td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{typeof o.user === "object" ? o.user.name : "—"}</div>
                            <div style={{ fontSize: "0.7rem", color: "#7288AE" }}>{typeof o.user === "object" ? o.user.email : ""}</div>
                          </td>
                          <td>{o.items?.length ?? 0} item{(o.items?.length ?? 0) !== 1 ? "s" : ""}</td>
                          <td style={{ fontWeight: 600 }}>{fmt(orderTotal(o))}</td>
                          <td style={{ fontSize: "0.76rem", color: "#7288AE" }}>{o.paymentMethod}</td>
                          <td><StatusPill status={o.status} /></td>
                          <td style={{ color: "#7288AE", fontSize: "0.76rem" }}>{formatDate(o.createdAt)}</td>
                          <td>
                            <div className="actions-cell">
                              <button className="adm-action-btn" onClick={() => setSelectedOrder(o)}>View</button>
                              <button
                                className="adm-action-btn danger"
                                disabled={deletingOrderId === o._id}
                                onClick={() => deleteOrder(o._id)}
                              >
                                {deletingOrderId === o._id ? "…" : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════
                PRODUCTS
            ═══════════════════════════════════════════════════ */}
            {active === "products" && (
              <div className="adm-card">
                <div className="adm-card-header">
                  <span className="adm-card-title">All Products ({filteredProducts.length})</span>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                    <input className="adm-input" placeholder="Search by name, brand, category…" value={productSearch} onChange={e => setProductSearch(e.target.value)} style={{ width: 260 }} />
                    <button className="adm-action-btn primary" onClick={openAddProduct}>+ Add Product</button>
                  </div>
                </div>
                <table className="adm-table">
                  <thead>
                    <tr><th>Product</th><th>Category</th><th>Brand</th><th>Price</th><th>Rating</th><th>Badge</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "#7288AE" }}>No products found</td></tr>
                    ) : filteredProducts.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="prod-thumb" />}
                            <div>
                              <div style={{ fontWeight: 500, fontSize: "0.85rem" }}>{p.name}</div>
                              <div style={{ fontSize: "0.7rem", color: "#7288AE" }}>{p._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                        <td>{p.brand}</td>
                        <td style={{ fontWeight: 600, color: "#4B5694" }}>Rs. {p.price?.toLocaleString()}</td>
                        <td><span style={{ color: "#d97706", fontSize: "0.8rem" }}>★ {p.averageRating?.toFixed(1) ?? "0.0"}</span></td>
                        <td>
                          {p.badge ? (
                            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.65rem", background: "rgba(75,86,148,0.1)", color: "#4B5694", border: "1px solid rgba(75,86,148,0.2)" }}>{p.badge}</span>
                          ) : <span style={{ color: "#7288AE", fontSize: "0.75rem" }}>—</span>}
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="adm-action-btn" onClick={() => setViewingProduct(p)}>View</button>
                            <button className="adm-action-btn" onClick={() => openEditProduct(p)}>Edit</button>
                            <button className="adm-action-btn danger" onClick={() => deleteProduct(p._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                CATEGORIES
            ═══════════════════════════════════════════════════ */}
            {active === "categories" && (
              <div className="adm-card">
                <div className="adm-card-header">
                  <span className="adm-card-title">All Categories ({categories.length})</span>
                  <button className="adm-action-btn primary" onClick={openAddCategory}>+ Add Category</button>
                </div>
                <table className="adm-table">
                  <thead>
                    <tr><th>Image</th><th>Slug</th><th>Label</th><th>Description</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "2.5rem", color: "#7288AE" }}>No categories found</td></tr>
                    ) : categories.map(c => (
                      <tr key={c._id || c.slug}>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {c.img && <img src={c.img} alt={c.label} className="cat-thumb" title="Card image" />}
                            {c.bannerImg && <img src={c.bannerImg} alt={`${c.label} banner`} className="cat-thumb" title="Banner image" />}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: "0.78rem", background: "rgba(75,86,148,0.08)", padding: "3px 10px", borderRadius: 6, color: "#4B5694" }}>{c.slug}</span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{c.label}</td>
                        <td style={{ color: "#7288AE", fontSize: "0.8rem", maxWidth: 240 }}>{c.desc}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="adm-action-btn" onClick={() => openEditCategory(c)}>Edit</button>
                            <button className="adm-action-btn danger" onClick={() => deleteCategory(c._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ══ ORDER DETAIL MODAL ══════════════════════════════════════════════════ */}
      {selectedOrder && (
        <div className="adm-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <button className="adm-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            <div style={{ marginBottom: "1.4rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7288AE", marginBottom: 4 }}>Order Details</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#111844", fontWeight: 500 }}>{shortId(selectedOrder._id)}</div>
              <div style={{ fontSize: "0.76rem", color: "#7288AE", marginTop: 2 }}>{formatDate(selectedOrder.createdAt)}</div>
            </div>
            <div style={{ background: "rgba(75,86,148,0.06)", border: "1px solid rgba(75,86,148,0.15)", borderRadius: 12, padding: "1rem 1.2rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: 6 }}>Customer</div>
              <div style={{ fontWeight: 600, color: "#111844" }}>{typeof selectedOrder.user === "object" ? selectedOrder.user.name : "—"}</div>
              <div style={{ fontSize: "0.8rem", color: "#7288AE" }}>{typeof selectedOrder.user === "object" ? selectedOrder.user.email : ""}</div>
            </div>
            <div style={{ background: "rgba(75,86,148,0.06)", border: "1px solid rgba(75,86,148,0.15)", borderRadius: 12, padding: "1rem 1.2rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: 6 }}>Shipping Address</div>
              <div style={{ fontSize: "0.85rem", color: "#111844", lineHeight: 1.7 }}>
                {selectedOrder.shippingAddress.label && (
                  <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "#4B5694", marginBottom: 4 }}>{selectedOrder.shippingAddress.label}</div>
                )}
                {typeof selectedOrder.addressId === "object" && selectedOrder.addressId?.recipientName && (
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>
                    {selectedOrder.addressId.recipientName}
                    {selectedOrder.addressId.phone && (
                      <span style={{ fontWeight: 400, color: "#7288AE", marginLeft: 8 }}>· {selectedOrder.addressId.phone}</span>
                    )}
                  </div>
                )}
                {selectedOrder.shippingAddress.streetAddress}
                {selectedOrder.shippingAddress.apartment && `, ${selectedOrder.shippingAddress.apartment}`}<br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}<br />
                {selectedOrder.shippingAddress.country}
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: 8 }}>Items</div>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: "1px solid rgba(75,86,148,0.1)", fontSize: "0.82rem" }}>
                  <div><span style={{ fontWeight: 500 }}>{typeof item.product === "object" && item.product ? item.product.name : (item.name || "Product")}</span><span style={{ color: "#7288AE", marginLeft: 8 }}>{item.size} × {item.quantity}</span></div>
                  <span style={{ fontWeight: 600 }}>{fmt(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(17,24,68,0.04)", borderRadius: 10, padding: "0.9rem 1.1rem", marginBottom: "1.2rem", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#7288AE" }}><span>Subtotal</span><span>{fmt(orderTotal(selectedOrder) - (selectedOrder.shippingCost || 0))}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#7288AE" }}><span>Shipping ({selectedOrder.shippingMethod})</span><span>{fmt(selectedOrder.shippingCost)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#111844", paddingTop: 6, borderTop: "1px solid rgba(75,86,148,0.15)" }}><span>Total</span><span>{fmt(orderTotal(selectedOrder))}</span></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7288AE" }}>Update Status:</div>
              {ORDER_STATUSES.map(s => (
                <button key={s} disabled={updatingOrderId === selectedOrder._id} onClick={() => updateOrderStatus(selectedOrder._id, s)} style={{ padding: "5px 12px", borderRadius: 999, border: `1px solid ${statusColor[s]}`, background: selectedOrder.status === s ? statusColor[s] : "transparent", color: selectedOrder.status === s ? "#fff" : statusColor[s], fontSize: "0.7rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Jost', sans-serif", opacity: updatingOrderId === selectedOrder._id ? 0.5 : 1 }}>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <button className="adm-action-btn danger" style={{ width: "100%" }} onClick={() => deleteOrder(selectedOrder._id)}>
              🗑 Delete This Order
            </button>
          </div>
        </div>
      )}

      {/* ══ PRODUCT VIEW MODAL ══════════════════════════════════════════════════ */}
      {viewingProduct && (
        <div className="adm-overlay" onClick={() => setViewingProduct(null)}>
          <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
            <button className="adm-modal-close" onClick={() => setViewingProduct(null)}>✕</button>
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {viewingProduct.images?.[0] && (
                <img src={viewingProduct.images[0]} alt={viewingProduct.name} style={{ width: 120, height: 150, objectFit: "cover", borderRadius: 12, flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7288AE", marginBottom: 4 }}>Product Details</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "#111844", fontWeight: 400, marginBottom: 4 }}>{viewingProduct.name}</div>
                <div style={{ fontSize: "1.2rem", color: "#4B5694", fontFamily: "'Cormorant Garamond', serif" }}>Rs. {viewingProduct.price?.toLocaleString()}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(75,86,148,0.3)", fontSize: "0.72rem", color: "#4B5694" }}>{viewingProduct.category}</span>
                  <span style={{ padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(75,86,148,0.3)", fontSize: "0.72rem", color: "#4B5694" }}>{viewingProduct.brand}</span>
                  {viewingProduct.badge && <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(75,86,148,0.1)", fontSize: "0.72rem", color: "#4B5694" }}>{viewingProduct.badge}</span>}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {[["Size", viewingProduct.size], ["Longevity", viewingProduct.longevity], ["Sillage", viewingProduct.sillage], ["Rating", `★ ${viewingProduct.averageRating?.toFixed(1) ?? "0.0"}`]].map(([l, v]) => (
                <div key={l} style={{ background: "rgba(75,86,148,0.06)", borderRadius: 10, padding: "0.8rem 1rem" }}>
                  <div style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: "0.9rem", color: "#111844", fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: 6 }}>Description</div>
              <p style={{ fontSize: "0.88rem", color: "rgba(17,24,68,0.75)", lineHeight: 1.7, margin: 0 }}>{viewingProduct.description}</p>
            </div>
            {viewingProduct.notes && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }}>
                {(["top", "heart", "base"] as const).map(layer => (
                  <div key={layer} style={{ background: "linear-gradient(135deg, #111844, #4B5694)", borderRadius: 10, padding: "0.8rem 1rem", color: "#EAE0CF" }}>
                    <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(234,224,207,0.6)", marginBottom: 6 }}>{layer} notes</div>
                    {viewingProduct.notes[layer]?.map((n, i) => <div key={i} style={{ fontSize: "0.8rem", opacity: 0.9 }}>· {n}</div>)}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
              <button className="adm-action-btn primary" onClick={() => { setViewingProduct(null); openEditProduct(viewingProduct); }}>Edit Product</button>
              <button className="adm-action-btn danger" onClick={() => { deleteProduct(viewingProduct._id); setViewingProduct(null); }}>Delete Product</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PRODUCT ADD/EDIT MODAL ═══════════════════════════════════════════════ */}
      {showProductModal && (
        <div className="adm-overlay" onClick={() => setShowProductModal(false)}>
          <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
            <button className="adm-modal-close" onClick={() => setShowProductModal(false)}>✕</button>
            <div style={{ marginBottom: "1.4rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7288AE", marginBottom: 4 }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#111844" }}>
                {editingProduct ? editingProduct.name : "New Product"}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Allure Homme" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (Rs.) *</label>
                <input className="adm-input" style={{ width: "100%" }} type="number" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: Number(e.target.value) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. oriental" list="cat-list" />
                <datalist id="cat-list">{categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}</datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Brand *</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.brand} onChange={e => setProductForm(p => ({ ...p, brand: e.target.value }))} placeholder="e.g. Chanel" />
              </div>
              <div className="form-group">
                <label className="form-label">Size</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.size} onChange={e => setProductForm(p => ({ ...p, size: e.target.value }))} placeholder="e.g. 100ml" />
              </div>
              <div className="form-group">
                <label className="form-label">Badge (optional)</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.badge} onChange={e => setProductForm(p => ({ ...p, badge: e.target.value }))} placeholder="e.g. Best Seller" />
              </div>
              <div className="form-group">
                <label className="form-label">Longevity</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.longevity} onChange={e => setProductForm(p => ({ ...p, longevity: e.target.value }))} placeholder="e.g. 8-10 hours" />
              </div>
              <div className="form-group">
                <label className="form-label">Sillage</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.sillage} onChange={e => setProductForm(p => ({ ...p, sillage: e.target.value }))} placeholder="e.g. Moderate" />
              </div>
              <div className="form-group full">
                <label className="form-label">Short Description *</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.shortDesc} onChange={e => setProductForm(p => ({ ...p, shortDesc: e.target.value }))} placeholder="One-line description" />
              </div>
              <div className="form-group full">
                <label className="form-label">Full Description</label>
                <textarea className="adm-textarea" value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder="Detailed product description" />
              </div>
              {/* <div className="form-group full">
                <label className="form-label">Image URLs (one per line)</label>
                <textarea className="adm-textarea" style={{ minHeight: 60 }}
                  value={productForm.images.join("\n")}
                  onChange={e => setProductForm(p => ({ ...p, images: e.target.value.split("\n") }))}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div> */}
              <div className="form-group full">
                <label className="form-label">Product Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  className="adm-input"
                  onChange={(e) => {
                    // Store the files selected by the user
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                />
                <small>Selecting new files will replace existing images on save.</small>
              </div>
              <div className="form-group">
                <label className="form-label">Top Notes (comma separated)</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.notes.top.join(", ")} onChange={e => setProductForm(p => ({ ...p, notes: { ...p.notes, top: e.target.value.split(",").map(n => n.trim()) } }))} placeholder="Bergamot, Lemon" />
              </div>
              <div className="form-group">
                <label className="form-label">Heart Notes (comma separated)</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.notes.heart.join(", ")} onChange={e => setProductForm(p => ({ ...p, notes: { ...p.notes, heart: e.target.value.split(",").map(n => n.trim()) } }))} placeholder="Rose, Jasmine" />
              </div>
              <div className="form-group">
                <label className="form-label">Base Notes (comma separated)</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.notes.base.join(", ")} onChange={e => setProductForm(p => ({ ...p, notes: { ...p.notes, base: e.target.value.split(",").map(n => n.trim()) } }))} placeholder="Oud, Amber, Musk" />
              </div>
              <div className="form-group">
                <label className="form-label">Seasons (comma separated)</label>
                <input className="adm-input" style={{ width: "100%" }} value={productForm.season.join(", ")} onChange={e => setProductForm(p => ({ ...p, season: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} placeholder="Spring, Summer" />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button className="adm-action-btn" onClick={() => setShowProductModal(false)}>Cancel</button>
              <button className="adm-action-btn primary" onClick={saveProduct} disabled={productSaving}>
                {productSaving ? "Saving…" : editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CATEGORY ADD/EDIT MODAL ══════════════════════════════════════════════ */}
      {showCategoryModal && (
        <div className="adm-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <button className="adm-modal-close" onClick={() => setShowCategoryModal(false)}>✕</button>
            <div style={{ marginBottom: "1.4rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7288AE", marginBottom: 4 }}>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#111844" }}>
                {editingCategory ? editingCategory.label : "New Category"}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Slug * (URL-friendly, e.g. "oriental")</label>
                <input className="adm-input" style={{ width: "100%" }} value={categoryForm.slug} onChange={e => setCategoryForm(c => ({ ...c, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="e.g. oriental" disabled={!!editingCategory} />
              </div>
              <div className="form-group">
                <label className="form-label">Label * (Display name)</label>
                <input className="adm-input" style={{ width: "100%" }} value={categoryForm.label} onChange={e => setCategoryForm(c => ({ ...c, label: e.target.value }))} placeholder="e.g. Oriental" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="adm-textarea" value={categoryForm.desc} onChange={e => setCategoryForm(c => ({ ...c, desc: e.target.value }))} placeholder="Short description of this category" />
              </div>
              <div className="form-group">
                <label className="form-label">Card Image {!editingCategory && "*"} (img)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="adm-input"
                  style={{ width: "100%" }}
                  onChange={e => setCategoryImgFile(e.target.files?.[0] || null)}
                />
                <small style={{ fontSize: "0.7rem", color: "#7288AE" }}>
                  {editingCategory ? "Leave empty to keep the current image." : "Required for a new category."}
                </small>
                {(categoryImgFile || categoryForm.img) && (
                  <img
                    src={categoryImgFile ? URL.createObjectURL(categoryImgFile) : categoryForm.img}
                    alt="Card preview"
                    style={{ marginTop: 8, height: 60, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(75,86,148,0.2)" }}
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Banner Image {!editingCategory && "*"} (bannerImg)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="adm-input"
                  style={{ width: "100%" }}
                  onChange={e => setCategoryBannerFile(e.target.files?.[0] || null)}
                />
                <small style={{ fontSize: "0.7rem", color: "#7288AE" }}>
                  {editingCategory ? "Leave empty to keep the current image." : "Required for a new category."}
                </small>
                {(categoryBannerFile || categoryForm.bannerImg) && (
                  <img
                    src={categoryBannerFile ? URL.createObjectURL(categoryBannerFile) : categoryForm.bannerImg}
                    alt="Banner preview"
                    style={{ marginTop: 8, height: 60, width: "100%", borderRadius: 8, objectFit: "cover", border: "1px solid rgba(75,86,148,0.2)" }}
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button className="adm-action-btn" onClick={() => setShowCategoryModal(false)}>Cancel</button>
              <button className="adm-action-btn primary" onClick={saveCategory} disabled={categorySaving}>
                {categorySaving ? "Saving…" : editingCategory ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

