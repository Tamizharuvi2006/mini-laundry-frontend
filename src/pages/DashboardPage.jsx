import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardApi } from '../api/dashboardApi';
import { getAllOrdersApi, deleteOrderApi } from '../api/orderApi';
import DashboardCard from '../components/DashboardCard';
import OrdersTable from '../components/OrdersTable';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FiPackage,
  FiDollarSign,
  FiInbox,
  FiSettings,
  FiCheckCircle,
  FiTruck,
  FiCalendar,
  FiTrendingUp,
  FiRotateCcw,
  FiBarChart2,
} from 'react-icons/fi';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartMode, setChartMode] = useState('NET');
  const [isChartTransitioning, setIsChartTransitioning] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchDashboard();
  }, [startDate, endDate]);

  useEffect(() => {
    setIsChartTransitioning(true);
    const t = setTimeout(() => setIsChartTransitioning(false), 240);
    return () => clearTimeout(t);
  }, [chartMode]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, ordersRes] = await Promise.all([
        getDashboardApi({ startDate, endDate }),
        getAllOrdersApi(),
      ]);
      if (dashRes.success) setMetrics(dashRes.data);
      if (ordersRes.success) setRecentOrders(ordersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await deleteOrderApi(orderId);
      if (res.success) {
        setRecentOrders((prev) => prev.filter((o) => o.order_id !== orderId));
        fetchDashboard();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const trendData = metrics?.revenueByDayLast7 || [];
  const maxSeriesValue = Math.max(
    ...trendData.flatMap((d) => [d.grossRevenue || 0, d.refunded || 0, Math.abs(d.netRevenue || 0)]),
    1
  );
  const avgNet = metrics?.averageNetRevenuePerOrder || 0;

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between animate-fade-in gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Business overview at a glance</p>
        </div>
        <Link
          to="/orders/new"
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
        >
          + New Order
        </Link>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <DashboardCard title="Total Orders" value={metrics.totalOrders} icon={<FiPackage />} color="primary" />
          <DashboardCard title="Net Revenue" value={`INR ${Math.round(metrics.totalRevenue).toLocaleString()}`} icon={<FiDollarSign />} color="emerald" />
          <DashboardCard title="Refunded" value={`INR ${Math.round(metrics.totalRefunded || 0).toLocaleString()}`} icon={<FiRotateCcw />} color="rose" />
          <DashboardCard title="Received" value={metrics.ordersPerStatus?.RECEIVED || 0} icon={<FiInbox />} color="slate" />
          <DashboardCard title="Processing" value={metrics.ordersPerStatus?.PROCESSING || 0} icon={<FiSettings />} color="amber" />
          <DashboardCard title="Delivered" value={metrics.ordersPerStatus?.DELIVERED || 0} icon={<FiTruck />} color="blue" />
        </div>
      )}

      <div className="glass-panel rounded-2xl p-4 sm:p-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-[170px] px-3 py-2 rounded-xl glass-input text-sm text-slate-700"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-[170px] px-3 py-2 rounded-xl glass-input text-sm text-slate-700"
            />
          </div>
          <button
            onClick={() => {
              const today = new Date();
              const s = new Date();
              s.setDate(today.getDate() - 6);
              setStartDate(s.toISOString().slice(0, 10));
              setEndDate(today.toISOString().slice(0, 10));
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Last 7 Days
          </button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard title="Today's Orders" value={metrics.todayOrders} icon={<FiCalendar />} color="purple" subtitle="Orders received today" />
          <DashboardCard title="Today's Net" value={`INR ${Math.round(metrics.todayRevenue || 0).toLocaleString()}`} icon={<FiTrendingUp />} color="emerald" subtitle="Revenue after refunds" />
          <DashboardCard title="Today's Refunds" value={`INR ${Math.round(metrics.todayRefunded || 0).toLocaleString()}`} icon={<FiRotateCcw />} color="rose" subtitle="Refunded amount today" />
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
          <h2 className="text-sm font-semibold text-slate-800">Recent Orders</h2>
          <Link to="/orders" className="text-xs font-medium text-primary-600 hover:text-primary-700">
            View All {'->'}
          </Link>
        </div>
        <OrdersTable orders={recentOrders} compact onDeleteOrder={handleDeleteOrder} />
      </div>

      {metrics && (
        <div className="glass-panel rounded-2xl p-5 sm:p-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <FiBarChart2 />
              Revenue vs Refund Trend
            </h2>
            <div className="text-xs text-slate-500">
              {startDate} to {endDate}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setChartMode('NET')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    chartMode === 'NET' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Net
                </button>
                <button
                  onClick={() => setChartMode('GROSS')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    chartMode === 'GROSS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Gross
                </button>
              </div>
              <div className="text-xs text-slate-500 bg-white/60 px-3 py-1.5 rounded-full border border-slate-100">
                Avg Net / Order: <span className="font-semibold text-slate-700">INR {Math.round(avgNet).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {trendData.length === 0 ? (
            <p className="text-sm text-slate-400">No trend data yet.</p>
          ) : (
            <div className={`space-y-4 transition-all duration-300 ${isChartTransitioning ? 'opacity-85 scale-[0.995]' : 'opacity-100 scale-100'}`}>
              {trendData.map((point) => {
                const grossWidth = Math.max(((point.grossRevenue || 0) / maxSeriesValue) * 100, point.grossRevenue ? 3 : 0);
                const refundedWidth = Math.max(((point.refunded || 0) / maxSeriesValue) * 100, point.refunded ? 3 : 0);
                const netPositive = (point.netRevenue || 0) >= 0;
                const primaryValue = chartMode === 'GROSS' ? (point.grossRevenue || 0) : Math.abs(point.netRevenue || 0);
                const primaryWidth = Math.max((primaryValue / maxSeriesValue) * 100, primaryValue ? 3 : 0);
                return (
                  <div key={point.date} className="grid grid-cols-1 sm:grid-cols-[90px_1fr_130px] gap-2 sm:gap-3 items-center">
                    <span className="text-xs text-slate-500">
                      {new Date(point.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                    <div className="space-y-2">
                      {chartMode === 'GROSS' ? (
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${primaryWidth}%` }} />
                        </div>
                      ) : (
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ease-out ${netPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${primaryWidth}%` }} />
                        </div>
                      )}
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400 rounded-full transition-all duration-300 ease-out" style={{ width: `${refundedWidth}%` }} />
                      </div>
                    </div>
                    <div className="text-xs text-right transition-all duration-300">
                      <div className="text-emerald-700 font-medium">
                        {chartMode === 'GROSS'
                          ? `Gross: INR ${Math.round(point.grossRevenue || 0).toLocaleString()}`
                          : `Net: ${netPositive ? '' : '-'}INR ${Math.abs(Math.round(point.netRevenue || 0)).toLocaleString()}`}
                      </div>
                      <div className="text-rose-600 font-medium">-INR {Math.round(point.refunded || 0).toLocaleString()}</div>
                      {chartMode === 'GROSS' && (
                        <div className={`font-semibold ${netPositive ? 'text-slate-700' : 'text-rose-700'}`}>
                          Net: {netPositive ? '' : '-'}INR {Math.abs(Math.round(point.netRevenue || 0)).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 mt-1 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2"><span className={`w-3 h-3 rounded ${chartMode === 'GROSS' ? 'bg-emerald-500' : 'bg-slate-700'}`}></span> {chartMode === 'GROSS' ? 'Gross Revenue' : 'Net Revenue'}</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-400"></span> Refunded</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
