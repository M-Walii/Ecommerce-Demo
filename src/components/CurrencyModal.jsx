// CurrencyModal: informs users that the cart enforces a single currency
// Provides guidance to finish/empty the cart to switch currency
import React from "react";

const CurrencyModal = ({ isOpen, onClose, onConfirm, cartCurrency }) => {
  if (!isOpen) return null;
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1050 }}>
      <div className="d-flex justify-content-center align-items-center w-100 h-100">
        <div className="card shadow" style={{ maxWidth: 460, width: '92%' }}>
          <div className="card-header bg-light">
            <strong>Unified currency required</strong>
          </div>
          <div className="card-body">
            <p className="mb-2">
              Your cart uses a single currency. To keep prices, totals, and taxes consistent, all items must be added in the same currency.
            </p>
            {cartCurrency && (
              <p className="text-muted small mb-2">Current cart currency: <strong>{cartCurrency}</strong></p>
            )}
            <p className="text-muted small mb-3">
              To change currency, please complete checkout from the Cart, or empty the cart and then start a new order in your preferred currency.
            </p>
            <div className="d-flex justify-content-end" style={{ gap: 8 }}>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
              <button type="button" className="btn btn-dark" onClick={onConfirm}>OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyModal;

