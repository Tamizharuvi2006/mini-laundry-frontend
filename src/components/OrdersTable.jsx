import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import { FiPackage, FiEye, FiTrash2, FiEdit, FiTruck } from 'react-icons/fi';

export default function OrdersTable({ orders, onStatusUpdate, onDeleteOrder, onQuickDeliver, compact = false }) {
  if (!orders || orders.length === 0) {
    return <EmptyState title="No orders found" message="Create your first order to get started!" icon={<FiPackage />} />;
  }

  const statusOptions = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getGarmentSummary = (garments) => {
    if (!garments || garments.length === 0) return '—';
    return garments.map((g) => `${g.quantity}x ${g.type}`).join(', ');
  };

  const displayOrders = compact ? orders.slice(0, 5) : orders;

  return (
    <div className="overflow-x-auto animate-fade-in">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
            {!compact && <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Phone</th>}
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Garments</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
            {!compact && <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Delivery</th>}
            <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayOrders.map((order) => (
            <tr key={order.order_id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4">
                <span className="font-mono text-xs font-semibold text-primary-600">{order.order_id}</span>
              </td>
              <td className="py-3 px-4">
                <span className="font-medium text-slate-700">{order.customer_name}</span>
              </td>
              {!compact && <td className="py-3 px-4 hidden md:table-cell text-slate-500">{order.phone}</td>}
              <td className="py-3 px-4 hidden lg:table-cell">
                <span className="text-slate-500 text-xs max-w-[200px] truncate block">{getGarmentSummary(order.garments)}</span>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="font-semibold text-slate-800">₹{order.total_amount}</span>
              </td>
              <td className="py-3 px-4">
                {onStatusUpdate ? (
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order.order_id, e.target.value)}
                    className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={order.status} />
                )}
              </td>
              {!compact && <td className="py-3 px-4 hidden md:table-cell text-slate-500 text-xs">{formatDate(order.estimated_delivery_date)}</td>}
              {/* Actions Column */}
              <td className="py-3 px-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/orders/${order.order_id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
                    title="View Details"
                  >
                    <FiEye className="text-lg" />
                  </Link>
                  <Link
                    to={`/orders/${order.order_id}/edit`}
                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                    title="Edit Order"
                  >
                    <FiEdit className="text-lg" />
                  </Link>
                  {onDeleteOrder && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOrder(order.order_id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Delete Order"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  )}
                  {onQuickDeliver && order.status !== 'DELIVERED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickDeliver(order.order_id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                      title="Mark Delivered"
                    >
                      <FiTruck className="text-lg" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
