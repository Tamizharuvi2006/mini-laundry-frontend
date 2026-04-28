import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderByIdApi, editOrderApi, deleteOrderApi, refundOrderApi } from '../api/orderApi';
import OrderForm from '../components/OrderForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiTrash2, FiRefreshCcw } from 'react-icons/fi';

export default function EditOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByIdApi(orderId);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleEditSubmit = async (orderData) => {
    setSaving(true);
    setError(null);
    try {
      const res = await editOrderApi(orderId, orderData);
      if (res.success) {
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to edit order');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to completely delete this order? This action cannot be undone.')) return;
    setSaving(true);
    try {
      const res = await deleteOrderApi(orderId);
      if (res.success) navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order');
      setSaving(false);
    }
  };

  const handleRefund = async () => {
    const reason = window.prompt("Please enter a reason for this refund:");
    if (!reason) return;
    setSaving(true);
    try {
      const res = await refundOrderApi(orderId, reason);
      if (res.success) navigate(`/orders/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process refund');
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading order details..." />;

  if (error && !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Edit Order {orderId}</h1>
        <p className="text-sm text-slate-500">Update customer details or garments.</p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-600 animate-fade-in">
          {error}
        </div>
      )}

      <OrderForm onSubmit={handleEditSubmit} loading={saving} initialData={order} />

      {/* Danger Zone Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-rose-800 mb-4">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleRefund}
            disabled={saving || order.status === 'REFUNDED'}
            className="w-full sm:w-auto px-6 py-3 border border-orange-200 text-orange-600 hover:bg-orange-50 text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FiRefreshCcw /> {order.status === 'REFUNDED' ? 'Already Refunded' : 'Refund Order'}
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FiTrash2 /> Delete Order
          </button>
        </div>
      </div>
    </div>
  );
}
