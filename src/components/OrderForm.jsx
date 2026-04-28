import { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { MdCheckroom, MdLocalLaundryService } from 'react-icons/md';
import { getProductsApi } from '../api/productApi';

const DEFAULT_GARMENT_TYPES = [
  { type: 'Shirt', price: 50 },
  { type: 'Pants', price: 80 },
  { type: 'T-Shirt', price: 40 },
  { type: 'Jeans', price: 90 },
];

export default function OrderForm({ onSubmit, loading, initialData = null }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [garments, setGarments] = useState([{ type: 'Shirt', quantity: 1 }]);
  const [availableProducts, setAvailableProducts] = useState(DEFAULT_GARMENT_TYPES);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch dynamic products
    const loadProducts = async () => {
      try {
        const res = await getProductsApi();
        if (res.success && res.data.length > 0) {
          setAvailableProducts(res.data.map(p => ({ type: p.name, price: Number(p.price) })));
          
          // Only reset initial garments if not editing and products loaded
          if (!initialData && garments[0].type === 'Shirt' && res.data[0]) {
             setGarments([{ type: res.data[0].name, quantity: 1 }]);
          }
        }
      } catch (err) {
        console.error('Failed to load products, using fallback');
      }
    };
    loadProducts();

    // Load initial data for editing
    if (initialData) {
      setCustomerName(initialData.customer_name || '');
      setPhone(initialData.phone || '');
      setEstimatedDeliveryDate(initialData.estimated_delivery_date || '');
      if (initialData.garments && initialData.garments.length > 0) {
        setGarments(initialData.garments);
      }
    }
  }, [initialData]);

  const addGarment = () => {
    setGarments([...garments, { type: 'Shirt', quantity: 1 }]);
  };

  const removeGarment = (index) => {
    if (garments.length === 1) return;
    setGarments(garments.filter((_, i) => i !== index));
  };

  const updateGarment = (index, field, value) => {
    const updated = [...garments];
    updated[index] = { ...updated[index], [field]: field === 'quantity' ? parseInt(value) || 0 : value };
    setGarments(updated);
  };

  const getPrice = (type) => {
    const found = availableProducts.find((g) => g.type === type);
    return found ? found.price : 0;
  };

  const previewTotal = garments.reduce((sum, g) => sum + (g.quantity * getPrice(g.type)), 0);

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = 'Customer name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    else if (phone.replace(/\D/g, '').length !== 10) errs.phone = 'Phone must be 10 digits';
    if (garments.some((g) => !g.type)) errs.garments = 'All garment types are required';
    if (garments.some((g) => g.quantity <= 0)) errs.garments = 'Quantity must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderData = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      garments: garments.map((g) => ({
        type: g.type,
        quantity: g.quantity,
        price: getPrice(g.type),
      })),
      estimatedDeliveryDate: estimatedDeliveryDate || undefined,
    };

    onSubmit(orderData);
  };

  const handleReset = () => {
    setCustomerName('');
    setPhone('');
    setEstimatedDeliveryDate('');
    setGarments([{ type: 'Shirt', quantity: 1 }]);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Customer Details */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FiUser className="text-lg text-primary-500" /> Customer Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Customer Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Tamizh"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.customerName ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'}`}
            />
            {errors.customerName && <p className="text-xs text-rose-500 mt-1">{errors.customerName}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.phone ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'}`}
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Estimated Delivery Date (optional)</label>
          <input
            type="date"
            value={estimatedDeliveryDate}
            onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Garments */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <MdCheckroom className="text-lg text-primary-500" /> Garments
          </h3>
        </div>

        {errors.garments && <p className="text-xs text-rose-500 mb-3">{errors.garments}</p>}

        <div className="space-y-3">
          {garments.map((garment, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/60">
              <div className="flex-1">
                <select
                  value={garment.type}
                  onChange={(e) => updateGarment(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg glass-input text-sm cursor-pointer"
                >
                  {availableProducts.map((g) => (
                    <option key={g.type} value={g.type}>
                      {g.type} — ₹{g.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={garment.quantity}
                  onChange={(e) => updateGarment(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg glass-input text-sm text-center"
                  placeholder="Qty"
                />
              </div>
              <div className="w-20 text-right">
                <span className="text-sm font-semibold text-slate-700">
                  ₹{garment.quantity * getPrice(garment.type)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeGarment(index)}
                disabled={garments.length === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={addGarment}
            className="w-full sm:w-auto text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 hover:bg-primary-100 px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            + Add Garment
          </button>
        </div>

        {/* Total Preview */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Preview Total</span>
          <span className="text-xl font-bold text-slate-800">₹{previewTotal}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">* Final amount is calculated by backend</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (initialData ? 'Saving...' : 'Creating Order...') : <><MdLocalLaundryService className="text-lg" /> {initialData ? 'Save Changes' : 'Create Order'}</>}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
