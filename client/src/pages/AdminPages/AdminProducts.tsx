import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, XCircle, Search } from 'lucide-react';
import api from '../../services/api';
import { Product, Category } from '../../types';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    basePrice: '',
    salePrice: '',
    stock: '100',
    description: '',
    shortDescription: '',
    imageUrl: '',
    isCustomizable: true,
    isFeatured: false,
    isBestSeller: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/categories'),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Error loading admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        categoryId: formData.categoryId || categories[0]?.id,
        basePrice: parseFloat(formData.basePrice),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock, 10),
        description: formData.description,
        shortDescription: formData.shortDescription,
        isCustomizable: formData.isCustomizable,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
      };

      const res = await api.post('/admin/products', payload);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          sku: '',
          categoryId: '',
          basePrice: '',
          salePrice: '',
          stock: '100',
          description: '',
          shortDescription: '',
          imageUrl: '',
          isCustomizable: true,
          isFeatured: false,
          isBestSeller: false,
        });
        loadData();
      }
    } catch (err) {
      console.error('Error creating product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      loadData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#0B132B', margin: 0 }}>
            Product Catalog Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Configure prices, material finishes, inventory thresholds, and design studio options.
          </p>
        </div>

        <Button variant="accent" onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus size={18} />}>
          Add New Product
        </Button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '360px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Filter by product name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 36px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
          }}
        />
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
      </div>

      {/* Product Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748B' }}>Product</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748B' }}>SKU</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748B' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748B' }}>Price (INR)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748B' }}>Stock</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748B' }}>Customizable</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100'}
                    alt={prod.name}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0B132B' }}>{prod.name}</strong>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748B' }}>{prod.sku}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{prod.category?.name || 'General'}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700 }}>
                  ₹{prod.salePrice || prod.basePrice}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: prod.stock > 25 ? '#ECFDF5' : '#FEF2F2',
                      color: prod.stock > 25 ? '#10B981' : '#EF4444',
                    }}
                  >
                    {prod.stock} in stock
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                  {prod.isCustomizable ? (
                    <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={16} /> Yes
                    </span>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>No</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Catalog Product"
        size="lg"
      >
        <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Luxury Velvet Gold Foil Visiting Cards"
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. PK-BC-099"
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Base Price (INR) *</label>
              <input
                type="number"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="499"
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Initial Stock *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700 }}>Product Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700 }}>Detailed Commercial Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Specify GSM, material grades, printing tech and packaging..."
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isCustomizable}
                onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
              />
              <span>Enable 2D Customizer</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span>Feature on Homepage</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit" isLoading={isSubmitting}>
              Publish Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
