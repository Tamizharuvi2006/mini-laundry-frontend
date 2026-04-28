import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByIdApi, updateOrderStatusApi } from '../api/orderApi';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUser, FiEdit, FiInfo, FiDownload } from 'react-icons/fi';
import { MdCheckroom } from 'react-icons/md';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderByIdApi(orderId);
      if (res.success) setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await updateOrderStatusApi(orderId, newStatus);
      if (res.success) setOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadInvoice = () => {
    if (!order) return;

    const garmentRows = (order.garments || [])
      .map(
        (g) => `
        <tr>
          <td>${g.type}</td>
          <td style="text-align:center;">${g.quantity}</td>
          <td style="text-align:right;">INR ${g.price}</td>
          <td style="text-align:right;">INR ${g.subtotal}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <html>
        <head>
          <title>Invoice ${order.order_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
            h1 { margin: 0 0 4px 0; font-size: 22px; }
            .muted { color: #64748b; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 13px; }
            th { background: #f8fafc; text-align: left; }
            .total { margin-top: 16px; font-size: 16px; font-weight: 700; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Mini Laundry - Delivery Slip</h1>
          <p class="muted">Order ID: ${order.order_id}</p>
          <p class="muted">Customer: ${order.customer_name} (${order.phone})</p>
          <p class="muted">Status: ${order.status} | Est. Delivery: ${formatDate(order.estimated_delivery_date)}</p>
          <table>
            <thead>
              <tr>
                <th>Garment</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
                <th style="text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${garmentRows}</tbody>
          </table>
          <p class="total">Total: INR ${order.total_amount}</p>
          <p class="muted" style="margin-top: 24px;">Generated on ${new Date().toLocaleString('en-IN')}</p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) return <LoadingSpinner text="Loading order..." />;
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-600">{error}</div>
        <Link to="/orders" className="text-sm text-primary-600 hover:underline mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }
  if (!order) return null;

  const statusFlow = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
  const currentIndex = Math.max(statusFlow.indexOf(order.status), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="animate-fade-in">
        <Link to="/orders" className="text-sm text-slate-400 hover:text-primary-600 transition-colors">
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-mono flex items-center gap-3">
              {order.order_id}
              <Link
                to={`/orders/${order.order_id}/edit`}
                className="text-sm text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <FiEdit /> Edit
              </Link>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Created {formatDateTime(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadInvoice}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
            >
              <FiDownload />
              Invoice
            </button>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 animate-fade-in">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Order Status</h3>

        {order.status === 'REFUNDED' ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <FiInfo className="text-rose-600 text-xl mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-rose-800">Order Refunded</h4>
              <p className="text-sm text-rose-600 mt-1">
                <span className="font-medium">Reason:</span> {order.refund_reason}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {statusFlow.map((s, i) => {
              const isCurrent = order.status === s;
              const isPast = statusFlow.indexOf(order.status) > i;
              return (
                <div key={s} className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusUpdate(s)}
                    disabled={updating}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
                      isCurrent
                        ? 'bg-primary-600 text-white shadow-sm'
                        : isPast
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                  {i < statusFlow.length - 1 && <span className="text-slate-300">{'->'}</span>}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5">
          <div className="flex items-center gap-2 sm:gap-3">
            {statusFlow.map((s, i) => {
              const done = i <= currentIndex;
              return (
                <div key={`timeline-${s}`} className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className="flex items-center gap-2 min-w-[72px]">
                    <span className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-primary-600' : 'bg-slate-300'}`}></span>
                    <span className={`text-[11px] font-semibold ${done ? 'text-slate-700' : 'text-slate-400'}`}>{s}</span>
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div className={`h-[2px] flex-1 ${i < currentIndex ? 'bg-primary-500' : 'bg-slate-200'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Started: {formatDateTime(order.created_at)} | Last status update: {formatDateTime(order.updated_at)}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 animate-fade-in">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FiUser className="text-lg text-primary-500" /> Customer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400">Name</p>
            <p className="text-sm font-medium text-slate-700">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Phone</p>
            <p className="text-sm font-medium text-slate-700">{order.phone}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Est. Delivery</p>
            <p className="text-sm font-medium text-slate-700">{formatDate(order.estimated_delivery_date)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Last Updated</p>
            <p className="text-sm font-medium text-slate-700">{formatDateTime(order.updated_at)}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 animate-fade-in">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <MdCheckroom className="text-lg text-primary-500" /> Garments
        </h3>
        <div className="space-y-2">
          {order.garments?.map((g, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
              <div>
                <span className="text-sm font-medium text-slate-700">{g.type}</span>
                <span className="text-xs text-slate-400 ml-2">x {g.quantity}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">INR {g.price} each</span>
                <span className="text-sm font-semibold text-slate-800 ml-3">INR {g.subtotal}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">Total Amount</span>
          <span className="text-xl font-bold text-slate-800">INR {order.total_amount}</span>
        </div>
      </div>
    </div>
  );
}
