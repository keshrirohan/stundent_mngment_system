"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// ─── Types ─────────────────────────────────────────────────────────────────
interface OrderItem {
  product: {
    _id: string;
    name: string;
    imageUrl: string[];
    selling_price: number;
    mrp: number;
  } | null;
  quantity: number;
  status: "ordered" | "delivered" | "cancelled" | "listed";
  paymentMode: "COD" | "Online";
  paymentStatus: "Pending" | "Completed" | "Failed";
  orderDate: string;
}

interface Order {
  _id: string;
  products: OrderItem[];
}

interface UserProfile {
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

// ─── Status Badge ──────────────────────────────────────────────────────────
const statusConfig = {
  ordered:   { label: "Ordered",   bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.3)",   text: "#fbbf24" },
  delivered: { label: "Delivered", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)",   text: "#4ade80" },
  cancelled: { label: "Cancelled", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   text: "#f87171" },
  listed:    { label: "Listed",    bg: "rgba(161,161,170,0.12)", border: "rgba(161,161,170,0.3)", text: "#a1a1aa" },
};

const paymentStatusConfig = {
  Pending:   { bg: "rgba(234,179,8,0.1)",  border: "rgba(234,179,8,0.25)",  text: "#fbbf24" },
  Completed: { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  text: "#4ade80" },
  Failed:    { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)",  text: "#f87171" },
};

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const cfg = statusConfig[status] ?? statusConfig.listed;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.text }} />
      {cfg.label}
    </span>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────
function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const total = order.products.reduce((sum, item) => {
    const price = item.product?.selling_price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Order header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors duration-200"
        id={`order-card-${index}`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-zinc-300 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            #{index + 1}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              Order &middot; {order.products.length} item{order.products.length !== 1 ? "s" : ""}
            </p>
            <p className="text-zinc-500 text-xs mt-0.5 font-mono truncate">{order._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-white font-bold text-sm">
            ₹{total.toLocaleString()}
          </span>
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded order items */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-5 py-4 space-y-4">
            {order.products.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                {/* Product image / placeholder */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {item.product?.imageUrl?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.imageUrl[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {item.product?.name ?? "Product unavailable"}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <StatusBadge status={item.status} />
                    <span
                      className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: paymentStatusConfig[item.paymentStatus]?.bg,
                        border: `1px solid ${paymentStatusConfig[item.paymentStatus]?.border}`,
                        color: paymentStatusConfig[item.paymentStatus]?.text,
                      }}
                    >
                      {item.paymentStatus}
                    </span>
                    <span
                      className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa" }}
                    >
                      {item.paymentMode}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="text-zinc-400 text-xs">
                      Qty: <span className="text-white font-semibold">{item.quantity}</span>
                    </span>
                    {item.product && (
                      <span className="text-zinc-400 text-xs">
                        Price:{" "}
                        <span className="text-white font-semibold">
                          ₹{(item.product.selling_price * item.quantity).toLocaleString()}
                        </span>
                      </span>
                    )}
                    <span className="text-zinc-500 text-xs">
                      {new Date(item.orderDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order total footer */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}
          >
            <span className="text-zinc-400 text-sm">Order Total</span>
            <span className="text-white font-bold">₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile Page ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch profile
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/me`,
          { credentials: "include" }
        );
        if (profileRes.status === 401) { router.push("/login"); return; }
        if (!profileRes.ok) throw new Error("Failed to load profile.");
        const profileData = await profileRes.json();
        setProfile(profileData);

        // Fetch user orders
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/my-orders`,
          { credentials: "include" }
        );
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders ?? []);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const initials = profile?.name
    ? profile.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "?";

  const totalSpent = orders.reduce((sum, order) =>
    sum + order.products.reduce((s, item) => s + (item.product?.selling_price ?? 0) * item.quantity, 0), 0
  );

  return (
    <main
      className="min-h-screen pt-16"
      style={{ background: "#09090b" }}
    >
      {/* Subtle top gradient glow */}
      <div
        className="fixed top-0 left-0 right-0 h-64 pointer-events-none opacity-30"
        style={{ background: "linear-gradient(180deg, rgba(39,39,42,0.8) 0%, transparent 100%)" }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && (
          <div
            className="mb-6 p-4 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Skeleton ──────────────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-5">
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-5">
                <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        )}

        {/* ── Main content ──────────────────────────────────────────────── */}
        {!loading && profile && (
          <div className="space-y-5">

            {/* ── Profile Card ──────────────────────────────────────────── */}
            <div
              className="rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                {/* Avatar + info */}
                <div className="flex items-center gap-5">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #3f3f46, #52525b)" }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h1>
                    <p className="text-zinc-400 text-sm mt-0.5">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={
                          profile.role === "admin"
                            ? { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }
                            : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#a1a1aa" }
                        }
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: profile.role === "admin" ? "#f87171" : "#71717a" }}
                        />
                        {profile.role === "admin" ? "Admin" : "Member"}
                      </span>
                      <span className="text-zinc-600 text-xs">Since {joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <button
                    id="profile-logout-btn"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/10"
                    style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  label: "Orders", value: orders.length,
                  icon: (
                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  )
                },
                {
                  label: "Delivered", value: orders.reduce((s,o)=> s + o.products.filter(p=>p.status==="delivered").length, 0),
                  icon: (
                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  )
                },
                {
                  label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`,
                  icon: (
                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  )
                },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs font-medium">{label}</p>
                    <p className="text-white font-bold text-lg leading-tight mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Orders Section ────────────────────────────────────────── */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full bg-zinc-400" />
                  <h2 className="text-base font-semibold text-white">My Orders</h2>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full text-zinc-400"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  {orders.length} total
                </span>
              </div>

              {/* Order list */}
              <div className="p-4 space-y-3">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <svg className="w-7 h-7 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">No orders yet</p>
                    <p className="text-zinc-500 text-sm mt-1">
                      Your orders will appear here once you shop.
                    </p>
                    <button
                      onClick={() => router.push("/")}
                      className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "#27272a", border: "1px solid rgba(255,255,255,0.1)" }}
                      id="profile-shop-now-btn"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order, i) => (
                    <OrderCard key={order._id} order={order} index={i} />
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
