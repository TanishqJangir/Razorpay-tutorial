"use client";

import { useState } from "react";
import axios from "axios";
import Script from "next/script";

export default function Home() {
  const [amount, setamount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const handlecreateOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/createorder", {
        amount: amount
      });
      const result = response.data as any;

      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.amount,
        currency: result.currency,
        order_id: result.id,
        name: 'Razorpay Sandbox',
        description: 'Test Payment',
        image: 'https://example.com/logo.png',
        handler: async function (response: any) {
          const res = await axios.post("/api/verifyOrder", {
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })

          const data = await res.data as any;
          console.log(data)
          if (data.isOk) {
            alert("Payment Successful")
          } else {
            alert("Payment Failed")
          }

        },
      };

      const payment = new (window as any).Razorpay(paymentData);
      payment.open();

      setData(result);
      console.log(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <Script type="text/javascript" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="brand-section">
        <div className="logo-badge">R</div>
        <h1 className="title">Razorpay Sandbox</h1>
        <p className="subtitle">Create and test payment orders instantly</p>
      </div>

      <div className="input-wrapper">
        <label htmlFor="amount-input" className="input-label">Order Amount</label>
        <div className="currency-input-container">
          <span className="currency-symbol">₹</span>
          <input
            id="amount-input"
            type="number"
            placeholder="Enter amount in paise (e.g. 1000 = ₹10)"
            className="amount-input"
            value={amount === 0 ? "" : amount}
            onChange={(e) => setamount(Number(e.target.value))}
            disabled={loading}
          />
        </div>
        <p className="subtitle" style={{ fontSize: "0.75rem", marginTop: "0.4rem" }}>
          {amount > 0 ? `Equivalent to ₹ ${(amount / 100).toFixed(2)} INR` : "1 INR = 100 paise"}
        </p>
      </div>

      <button
        className="btn-submit"
        onClick={handlecreateOrder}
        disabled={loading || amount <= 0}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Creating Order...
          </>
        ) : (
          "Create Order"
        )}
      </button>

      {data !== null ? (
        <div className="result-card">
          <div className="result-header">
            <span className="result-title">Order Status</span>
            <span className="badge badge-success">{data.status}</span>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Order ID</span>
              <span className="info-value mono">{data.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Amount</span>
              <span className="info-value">₹ {(data.amount / 100).toFixed(2)} <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>({data.amount} paise)</span></span>
            </div>
            <div className="info-item">
              <span className="info-label">Currency</span>
              <span className="info-value">{data.currency}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Attempts</span>
              <span className="info-value">{data.attempts}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created At</span>
              <span className="info-value">
                {new Date(data.created_at * 1000).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="details-wrapper">
            <details>
              <summary className="details-summary">
                Raw JSON Response
              </summary>
              <pre className="raw-json">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      ) : (
        <div className="no-data-card">
          <span className="no-data-icon">💳</span>
          <span>No order details loaded yet. Enter an amount and click "Create Order".</span>
        </div>
      )}
    </div>
  );
}

