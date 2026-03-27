import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface PaymentFormProps {
  total: number;
}

type CardType = "visa" | "mastercard" | null;

export const PaymentForm = ({ total }: PaymentFormProps) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [cardType, setCardType] = useState<CardType>(null);
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cardType) newErrors.cardType = "Please select a card type";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Format: MM/YY";
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, "$1 ").trim();
    }

    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData({ ...formData, [name]: formattedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccess(true);

    // Clear cart and redirect after 2 seconds
    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="payment-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase</p>
          <p className="success-amount">Total Amount: ${total.toFixed(2)}</p>
          <p className="redirecting">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Payment Details</h2>
        <p className="total-amount">Amount to Pay: <strong>${total.toFixed(2)}</strong></p>
      </div>

      {/* Card Type Selection */}
      <div className="payment-section">
        <h3>Select Card Type</h3>
        <div className="card-type-selector">
          <label className={`card-option ${cardType === "visa" ? "selected" : ""}`}>
            <input
              type="radio"
              name="cardType"
              value="visa"
              checked={cardType === "visa"}
              onChange={() => {
                setCardType("visa");
                setErrors({ ...errors, cardType: "" });
              }}
            />
            <div className="card-option-content">
              <svg
                width="32"
                height="20"
                viewBox="0 0 32 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="20" rx="2" fill="#1A1F71" />
                <text x="16" y="14" textAnchor="middle" fill="white" fontSize="8">
                  VISA
                </text>
              </svg>
              <span>Visa Card</span>
            </div>
          </label>

          <label className={`card-option ${cardType === "mastercard" ? "selected" : ""}`}>
            <input
              type="radio"
              name="cardType"
              value="mastercard"
              checked={cardType === "mastercard"}
              onChange={() => {
                setCardType("mastercard");
                setErrors({ ...errors, cardType: "" });
              }}
            />
            <div className="card-option-content">
              <svg
                width="32"
                height="20"
                viewBox="0 0 32 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="20" rx="2" fill="#EB001B" />
                <circle cx="13" cy="10" r="6" fill="#FF5F00" opacity="0.8" />
                <circle cx="19" cy="10" r="6" fill="#0066B2" opacity="0.8" />
              </svg>
              <span>Mastercard</span>
            </div>
          </label>
        </div>
        {errors.cardType && <p className="error-message">{errors.cardType}</p>}
      </div>

      {/* Payment Form */}
      {cardType && (
        <div className="payment-section">
          <h3>Card Information</h3>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number *</label>
            <input
              id="cardNumber"
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={errors.cardNumber ? "input-error" : ""}
            />
            {errors.cardNumber && (
              <p className="error-message">{errors.cardNumber}</p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date *</label>
              <input
                id="expiryDate"
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                maxLength={5}
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={errors.expiryDate ? "input-error" : ""}
              />
              {errors.expiryDate && (
                <p className="error-message">{errors.expiryDate}</p>
              )}
            </div>

             <div className="form-group">
              <label htmlFor="cvv">CVV *</label>
              <input
                id="cvv"
                type="text"
                name="cvv"
                placeholder="123"
                maxLength={4}
                value={formData.cvv}
                onChange={handleInputChange}
                className={errors.cvv ? "input-error" : ""}
              />
              {errors.cvv && <p className="error-message">{errors.cvv}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address *</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleInputChange}
              className={errors.address ? "input-error" : ""}
              rows={3}
            />
            {errors.address && <p className="error-message">{errors.address}</p>}
          </div>

          <div className="payment-actions">
            <button
              className="payment-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
