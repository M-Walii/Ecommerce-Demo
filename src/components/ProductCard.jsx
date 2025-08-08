// ProductCard
// - Responsive product tile with fixed media ratio
// - Explicit variant selection; price/qty/CTA unlocked after selection
// - Per-card currency selection with unified-cart enforcement
// - Quantity stepper integrated in price row
// - Accessible states for Out of Stock and disabled controls
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";
import { formatPrice } from "../utils/formatPrice";
import { convertCurrency as convertFx } from "../utils/currency";
import CurrencyModal from "./CurrencyModal";

// Lightweight inline SVG flags to avoid external icon deps
const CurrencyFlag = ({ code }) => {
  const size = { width: 26, height: 18 };
  if (code === "USD") {
    return (
      <svg aria-hidden="true" {...size} viewBox="0 0 60 42">
        <rect width="60" height="42" fill="#b22234" />
        <g fill="#fff">
          <rect y="6" width="60" height="6" />
          <rect y="18" width="60" height="6" />
          <rect y="30" width="60" height="6" />
        </g>
        <rect width="28" height="21" fill="#3c3b6e" />
      </svg>
    );
  }
  if (code === "GBP") {
    return (
      <svg aria-hidden="true" {...size} viewBox="0 0 60 42">
        <rect width="60" height="42" fill="#012169" />
        <g fill="#fff">
          <polygon points="0,0 24,0 60,26 60,42 36,42 0,16" />
          <polygon points="60,0 36,0 0,26 0,42 24,42 60,16" />
        </g>
        <g fill="#C8102E">
          <polygon points="0,0 27,0 60,23 60,28 33,10 0,33" />
          <polygon points="60,0 33,0 0,23 0,28 27,10 60,33" />
        </g>
        <rect x="24" width="12" height="42" fill="#fff" />
        <rect y="15" width="60" height="12" fill="#fff" />
        <rect x="26" width="8" height="42" fill="#C8102E" />
        <rect y="17" width="60" height="8" fill="#C8102E" />
      </svg>
    );
  }
  if (code === "EUR") {
    return (
      <svg aria-hidden="true" {...size} viewBox="0 0 60 42">
        <rect width="60" height="42" fill="#003399" />
        <g fill="#ffcc00">
          <circle cx="30" cy="8" r="1.2" />
          <circle cx="38" cy="11" r="1.2" />
          <circle cx="42" cy="19" r="1.2" />
          <circle cx="38" cy="27" r="1.2" />
          <circle cx="30" cy="30" r="1.2" />
          <circle cx="22" cy="27" r="1.2" />
          <circle cx="18" cy="19" r="1.2" />
          <circle cx="22" cy="11" r="1.2" />
        </g>
      </svg>
    );
  }
  return null;
};

// Recognized variant collections in incoming data (no color, since image does not change)
const AVAILABLE_VARIANT_KEYS = ["size", "variant", "options", "storage", "material"]; // standardized keys (no color)

// Choose a primary image across supported shapes
function getPrimaryImage(product) {
  if (!product) return "";
  if (product.image) return product.image; // fakestore shape
  if (product.images && Array.isArray(product.images)) {
    const first = product.images[0];
    if (!first) return "";
    if (typeof first === "string") return first;
    if (first.url) return first.url;
  }
  return "";
}

// Extract variants from commonly used keys
function extractVariants(product) {
  if (!product || typeof product !== "object") return [];
  if (Array.isArray(product.variants)) return product.variants;
  const foundKey = AVAILABLE_VARIANT_KEYS.find((k) => Array.isArray(product[k]) && product[k].length > 0);
  if (foundKey) return product[foundKey];
  return [];
}

// Compute OOS using product-level and variant-level stock
function isOutOfStock(product, selectedVariant) {
  const stock = product?.stock ?? product?.quantity;
  if (typeof stock === "number") {
    if (stock <= 0) return true;
  }
  if (selectedVariant && typeof selectedVariant === "object") {
    const svStock = selectedVariant.stock ?? selectedVariant.quantity;
    if (typeof svStock === "number" && svStock <= 0) return true;
  }
  // If there are variants and all are OOS, treat product as OOS
  const allVariants = extractVariants(product);
  if (Array.isArray(allVariants) && allVariants.length > 0) {
    const anyInStock = allVariants.some((v) => {
      if (typeof v === "string") return true; // unknown stock for string options
      const vStock = v?.stock ?? v?.quantity;
      return typeof vStock !== "number" || vStock > 0;
    });
    if (!anyInStock) return true;
  }
  return false;
}

// Compute the unit price for the selected state (prefers exact variant price, then delta)
function getDisplayPrice(product, selectedVariant) {
  const base = typeof product?.price === "number" ? product.price : Number(product?.price) || 0;
  if (!selectedVariant) return base;
  if (typeof selectedVariant.price === "number") return selectedVariant.price;
  if (typeof selectedVariant.deltaPrice === "number") return base + selectedVariant.deltaPrice;
  return base;
}

const ProductCard = ({ product, currency: currencyProp = "USD", onAdded }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.handleCart);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [adding, setAdding] = useState(false);
  const [currency, setCurrency] = useState(currencyProp);
  const [quantity, setQuantity] = useState(1);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const imageSrc = useMemo(() => getPrimaryImage(product), [product]);
  const variants = useMemo(() => extractVariants(product), [product]);
  const selectedVariant = selectedIndex >= 0 ? variants[selectedIndex] : null;

  const outOfStock = isOutOfStock(product, selectedVariant);
  const price = getDisplayPrice(product, selectedVariant);
  const requiresVariantSelection = variants.length > 0 && selectedVariant == null;

  const convertCurrency = (amount, to) => {
    return convertFx(amount, 'USD', to);
  };

  // Enforce unified currency from existing cart
  useEffect(() => {
    if (Array.isArray(cart) && cart.length > 0 && cart[0]?.currency && cart[0].currency !== currency) {
      setCurrency(cart[0].currency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, currency]);

  const handleAdd = async () => {
    if (adding || outOfStock) return;
    if (variants.length > 0 && selectedVariant == null) return; // force selection
    try {
      setAdding(true);
      const unitBase = getDisplayPrice(product, selectedVariant);
      const enforcedCurrency = Array.isArray(cart) && cart.length > 0 && cart[0]?.currency ? cart[0].currency : currency;
      const unitConverted = convertCurrency(unitBase, enforcedCurrency);
      const variantLabel = selectedVariant
        ? (typeof selectedVariant === 'string' ? selectedVariant : (selectedVariant.name || selectedVariant.label))
        : undefined;
      const payload = {
        ...product,
        price: unitConverted,
        currency: enforcedCurrency,
        selectedVariant: selectedVariant || null,
        variantLabel,
        addQty: quantity,
      };
      dispatch(addCart(payload));
      toast.custom((t) => (
        <div className={`card shadow ${t.visible ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__fadeOutUp'}`} style={{ maxWidth: 420 }}>
          <div className="card-body d-flex align-items-center" style={{ gap: 12 }}>
            <div className="bg-success" style={{ width: 8, height: 8, borderRadius: 999 }}></div>
            <div>
              <div className="fw-semibold">Added to cart</div>
              <div className="text-muted small">
                {product?.title || product?.name} {variantLabel ? `• ${variantLabel}` : ''} • {quantity} × {formatPrice(unitConverted, { currency: enforcedCurrency })}
              </div>
            </div>
            <button className="btn btn-link btn-sm ms-auto text-decoration-none" onClick={() => toast.dismiss(t.id)}>Dismiss</button>
          </div>
        </div>
      ));
      if (onAdded) onAdded(payload);
    } catch (e) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const unitPriceConverted = convertCurrency(price, currency);
  const priceText = formatPrice(unitPriceConverted * quantity, { currency });

  return (
    <div className="card text-center h-100">
      <div className="ratio ratio-4x3 bg-light">
        {imageSrc ? (
          <img
            className="card-img-top p-3 w-100 h-100"
            style={{ objectFit: 'cover' }}
            src={imageSrc}
            alt={product?.title || product?.name || "Product"}
            loading="lazy"
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center w-100 h-100 text-muted">
            No Image
          </div>
        )}
      </div>
      <div className="card-body">
        <h5
          className="card-title"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {product?.title || product?.name || "Untitled"}
        </h5>
      </div>
      <ul className="list-group list-group-flush">
        {requiresVariantSelection ? (
          <li className="list-group-item">
            <div className="text-muted small">Select a variant to see price and enable quantity.</div>
          </li>
        ) : (
          <li className="list-group-item">
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
              <div className="lead mb-0">{priceText}</div>
              <div className="d-flex align-items-center" style={{ gap: 10 }}>
                <div className="btn-group" role="group" aria-label="Quantity selector">
                  <button type="button" className="btn btn-outline-secondary btn-sm" disabled={outOfStock} onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                  <span className={`px-3 py-1 border-top border-bottom ${outOfStock ? 'text-muted' : ''}`} style={{ minWidth: 36, textAlign: 'center' }}>{quantity}</span>
                  <button type="button" className="btn btn-outline-secondary btn-sm" disabled={outOfStock} onClick={() => setQuantity((q) => Math.min(99, q + 1))} aria-label="Increase quantity">+</button>
                </div>
                <div className="d-flex align-items-center" style={{ gap: 6 }}>
                  <CurrencyFlag code={currency} />
                  <select
                    className="form-select form-select-sm"
                    aria-label="Select currency"
                    value={currency}
                    onChange={(e) => {
                      const next = e.target.value;
                      const cartCurrency = cart[0]?.currency;
                      if (cartCurrency && cartCurrency !== next) {
                        setShowCurrencyModal(true);
                        return;
                      }
                      setCurrency(next);
                    }}
                    style={{ maxWidth: 130 }}
                  >
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                  </select>
                </div>
              </div>
            </div>
          </li>
        )}
      </ul>
      <div className="card-body">
        
        {variants.length > 0 ? (
          <select
            className="form-select mb-2"
            aria-label="Select variant"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            <option value={-1} disabled>
              Select variant
            </option>
            {variants.map((v, idx) => {
              const name = typeof v === "string" ? v : v?.name || v?.label || `Option ${idx + 1}`;
              const priceForVariant = typeof v?.price === "number" ? v.price :
                typeof v?.deltaPrice === "number" ? price + (v.deltaPrice) : price;
              const vPrice = ` · ${formatPrice(convertCurrency(priceForVariant, currency), { currency })}`;
              const vOOS = (v?.stock ?? v?.quantity) === 0 ? " (Out of Stock)" : "";
              return (
                <option key={idx} value={idx} disabled={(v?.stock ?? v?.quantity) === 0}>
                  {name}{vPrice}{vOOS}
                </option>
              );
            })}
          </select>
        ) : (
          <div className="text-muted mb-2 small">No variants</div>
        )}

        <button
          type="button"
          className="btn btn-dark m-1"
          style={{ transition: 'transform 120ms ease, box-shadow 120ms ease' }}
          disabled={adding || outOfStock || (variants.length > 0 && selectedVariant == null)}
          aria-live="polite"
          onClick={handleAdd}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          onFocus={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
          onBlur={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {outOfStock ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
      <CurrencyModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        onConfirm={() => { setCurrency(cart[0]?.currency || currency); setShowCurrencyModal(false); }}
        cartCurrency={cart[0]?.currency}
      />
    </div>
  );
};

export default ProductCard;

