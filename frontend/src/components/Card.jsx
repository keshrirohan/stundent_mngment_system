import React from "react";
import Image from "next/image";

const Card = ({ products }) => {
  return (
    <>
      {products.map((product) => (
        <div
          key={product._id}
          className="w-72 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          style={{
            background: "#18181b",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Image */}
          <div className="relative">
            {product.imageUrl?.[0] ? (
              <Image
                src={product.imageUrl[0]}
                alt={product.name}
                className="w-full h-52 object-cover"
                width={288}
                height={208}
              />
            ) : (
              <div
                className="w-full h-52 flex items-center justify-center"
                style={{ background: "#09090b" }}
              >
                <svg className="w-10 h-10 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
              </div>
            )}

            {/* Discount badge */}
            {product.mrp > product.selling_price && (
              <span
                className="absolute top-2.5 left-2.5 text-white text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#dc2626" }}
              >
                {Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)}% OFF
              </span>
            )}

            {/* Stock badge */}
            <span
              className="absolute top-2.5 right-2.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={
                product.isInStock
                  ? { background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }
                  : { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }
              }
            >
              {product.isInStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Info */}
          <div className="p-4">
            <h2 className="text-white font-bold text-base leading-tight truncate">{product.name}</h2>

            <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded text-white"
                style={{ background: "#16a34a" }}
              >
                4.5 ★
              </span>
              <span className="text-zinc-500 text-xs">{product.reviews || 0} Reviews</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-white text-xl font-bold">
                ₹{product.selling_price.toLocaleString()}
              </span>
              {product.mrp > product.selling_price && (
                <>
                  <span className="text-zinc-600 line-through text-sm">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                  <span className="text-emerald-400 text-xs font-semibold">
                    Save ₹{(product.mrp - product.selling_price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-4">
              <button
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{ background: "#27272a", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Add to Cart
              </button>
              <button
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{ background: "#3f3f46", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;
