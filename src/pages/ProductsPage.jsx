import { useState, useEffect } from 'react';
import { getProductsApi, addProductApi, deleteProductApi, editProductApi } from '../api/productApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiTrash2, FiPlus, FiTag, FiEdit, FiCheck, FiX } from 'react-icons/fi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProductsApi();
      if (res.success) setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;
    setAdding(true);
    setError(null);
    try {
      const res = await addProductApi({ name: newName.trim(), price: Number(newPrice) });
      if (res.success) {
        setProducts([...products, res.data].sort((a, b) => a.name.localeCompare(b.name)));
        setNewName('');
        setNewPrice('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await deleteProductApi(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const startEditing = (p) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(p.price);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditPrice('');
  };

  const handleEditSave = async (id) => {
    if (!editName.trim() || !editPrice) return;
    try {
      const res = await editProductApi(id, { name: editName.trim(), price: Number(editPrice) });
      if (res.success) {
        setProducts(products.map(p => p.id === id ? res.data : p));
        setEditingId(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FiTag className="text-primary-600" /> Products Menu
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage the items and prices available for orders.</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-600 animate-fade-in">
          {error}
        </div>
      )}

      {/* Add Product Form */}
      <div className="glass-panel rounded-2xl p-6 animate-fade-in">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Product Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Leather Jacket"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              required
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Price (₹)</label>
            <input
              type="number"
              min="0"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newName.trim() || !newPrice}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-6 font-semibold text-slate-500">Product Name</th>
              <th className="text-left py-3 px-6 font-semibold text-slate-500">Price</th>
              <th className="text-right py-3 px-6 font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-slate-500">No products found. Add one above!</td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  {editingId === p.id ? (
                    <>
                      <td className="py-3 px-6">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </td>
                      <td className="py-3 px-6">
                        <input
                          type="number"
                          min="0"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-24 px-3 py-1.5 rounded border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </td>
                      <td className="py-3 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditSave(p.id)}
                          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer mr-1"
                          title="Save"
                        >
                          <FiCheck className="text-lg" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Cancel"
                        >
                          <FiX className="text-lg" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-6 font-medium text-slate-800">{p.name}</td>
                      <td className="py-3 px-6 font-semibold text-primary-700">₹{p.price}</td>
                      <td className="py-3 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => startEditing(p)}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer mr-1"
                          title="Edit Product"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
