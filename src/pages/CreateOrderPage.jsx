import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrderApi } from '../api/orderApi';
import OrderForm from '../components/OrderForm';
import { FiCheckCircle } from 'react-icons/fi';

export default function CreateOrderPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (orderData) => {
    setLoading(true);
    setError('');
    try {
      const res = await createOrderApi(orderData);
      if (res.success) {
        setSuccess(res.data);
        setTimeout(() => navigate(`/orders/${res.data.order_id}`), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-800">Create New Order</h1>
        <p className="text-sm text-slate-400 mt-0.5">Add customer and garment details</p>
      </div>
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-slide-down">
          <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5"><FiCheckCircle className="text-lg" /> Order created!</p>
          <p className="text-xs text-emerald-600 mt-1">ID: {success.order_id} • ₹{success.total_amount}</p>
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-600 animate-slide-down">{error}</div>
      )}
      {!success && <OrderForm onSubmit={handleSubmit} loading={loading} />}
    </div>
  );
}
