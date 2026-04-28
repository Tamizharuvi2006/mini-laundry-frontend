import { useState, useEffect, useCallback } from 'react';
import { getAllOrdersApi, updateOrderStatusApi, deleteOrderApi } from '../api/orderApi';
import OrdersTable from '../components/OrdersTable';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiDownload } from 'react-icons/fi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await getAllOrdersApi(params);
      if (res.success) setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatusApi(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await deleteOrderApi(orderId);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
  };

  const handleQuickDeliver = async (orderId) => {
    await handleStatusUpdate(orderId, 'DELIVERED');
  };

  const exportOrdersCsv = () => {
    if (!orders.length) return;

    const headers = [
      'Order ID',
      'Customer Name',
      'Phone',
      'Status',
      'Total Amount',
      'Estimated Delivery Date',
      'Created At',
      'Garments',
    ];

    const rows = orders.map((order) => [
      order.order_id,
      order.customer_name,
      order.phone,
      order.status,
      order.total_amount,
      order.estimated_delivery_date || '',
      order.created_at || '',
      (order.garments || []).map((g) => `${g.quantity}x ${g.type}`).join(' | '),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laundry-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={exportOrdersCsv}
          disabled={!orders.length}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDownload />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClear={clearFilters}
      />

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading orders..." />
        ) : error ? (
          <div className="p-6">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-600">{error}</div>
          </div>
        ) : (
          <OrdersTable
            orders={orders}
            onStatusUpdate={handleStatusUpdate}
            onDeleteOrder={handleDeleteOrder}
            onQuickDeliver={handleQuickDeliver}
          />
        )}
      </div>
    </div>
  );
}
