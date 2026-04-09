import { useCallback, useEffect, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
import api from '../../lib/api'
import { usePage } from '../../context/PageContext'

function emptyForm() {
  return { imageUrl: '', productName: '', description: '', price: '', additionalComment: '', discount: '', availability: 'available', customInstruction: '' }
}

function mapProductToForm(product) {
  return {
    imageUrl: product.imageUrl || '',
    productName: product.name,
    description: product.description || '',
    price: product.price,
    additionalComment: product.additionalComment || '',
    discount: product.discount || '0',
    availability: product.availability || 'available',
    customInstruction: product.customInstruction || '',
  }
}

const inputStyle = { width: '100%', padding: '8px 10px', fontSize: 13, color: '#111827', border: '1px solid #E5E7EB', borderRadius: 8, outline: 'none', background: '#fff', boxSizing: 'border-box' }
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 5 }

function ProductView() {
  const { selectedPage } = usePage()
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingProductId, setEditingProductId] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const fetchProducts = useCallback(async () => {
    if (!selectedPage) return
    setLoadingProducts(true)
    try {
      const { data } = await api.get(`/api/products/${selectedPage.pageId}`)
      setProducts(data.data || [])
    } catch (err) {
      console.error('Fetch products error:', err)
    } finally {
      setLoadingProducts(false)
    }
  }, [selectedPage])

  useEffect(() => {
    fetchProducts()
    setEditingProductId(null)
    setForm(emptyForm())
  }, [fetchProducts])

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSaveProduct = async () => {
    if (!selectedPage) return
    const name = form.productName.trim()
    const price = form.price.toString().trim()
    if (!name || !price) { setError('Product name and price are required.'); return }
    setSaving(true); setError('')
    const payload = {
      name, description: form.description.trim(), price,
      additionalComment: form.additionalComment.trim(),
      discount: form.discount.toString().trim() || '0',
      availability: form.availability,
      customInstruction: form.customInstruction.trim(),
      imageUrl: form.imageUrl.trim() || undefined,
    }
    try {
      if (editingProductId) {
        const { data } = await api.put(`/api/products/${selectedPage.pageId}/${editingProductId}`, payload)
        setProducts(prev => prev.map(p => p._id === editingProductId ? data.data : p))
        setEditingProductId(null)
      } else {
        const { data } = await api.post(`/api/products/${selectedPage.pageId}`, payload)
        setProducts(prev => [data.data, ...prev])
      }
      setForm(emptyForm())
    } catch {
      setError('Failed to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditProduct = (product) => { setEditingProductId(product._id); setForm(mapProductToForm(product)); setError('') }
  const handleCancelEdit = () => { setEditingProductId(null); setForm(emptyForm()); setError('') }
  const handleDeleteProduct = async (productId) => {
    if (!selectedPage) return
    try {
      await api.delete(`/api/products/${selectedPage.pageId}/${productId}`)
      setProducts(prev => prev.filter(p => p._id !== productId))
      if (editingProductId === productId) handleCancelEdit()
      if (selectedProduct?._id === productId) setSelectedProduct(null)
    } catch (err) { console.error('Delete product error:', err) }
  }

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Workspace</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Products</h1>
        </div>
        <ProfilePill />
      </div>

      {!selectedPage ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>Select a Facebook page from the sidebar to manage products.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          {/* Form card */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                {editingProductId ? 'Edit Product' : 'Add Product'}
              </h2>
              <p style={{ fontSize: 13, color: '#6B7280' }}>
                {editingProductId ? 'Update the details for this product.' : 'Add a new product for the AI to reference when answering questions.'}
              </p>
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Product Image URL</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={e => updateForm('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB', flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />
                )}
              </div>
            </div>

            {/* Grid fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Product Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="text" value={form.productName} onChange={e => updateForm('productName', e.target.value)} placeholder="e.g. Premium T-Shirt" style={inputStyle} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <div>
                <label style={labelStyle}>Price <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" value={form.price} onChange={e => updateForm('price', e.target.value)} placeholder="0.00" style={inputStyle} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <div>
                <label style={labelStyle}>Discount (%)</label>
                <input type="number" value={form.discount} onChange={e => updateForm('discount', e.target.value)} placeholder="0" style={inputStyle} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <div>
                <label style={labelStyle}>Availability</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['available', 'stock-out'].map(val => (
                    <button key={val} type="button" onClick={() => updateForm('availability', val)} style={{ flex: 1, padding: '7px 10px', fontSize: 13, fontWeight: 500, borderRadius: 8, border: '1px solid', borderColor: form.availability === val ? '#2563EB' : '#E5E7EB', color: form.availability === val ? '#2563EB' : '#6B7280', background: form.availability === val ? '#EFF6FF' : '#fff', cursor: 'pointer' }}>
                      {val === 'available' ? 'Available' : 'Stock Out'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Describe the product…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Additional Comment</label>
              <textarea value={form.additionalComment} onChange={e => updateForm('additionalComment', e.target.value)} placeholder="Any extra notes…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Custom Instruction for This Product</label>
              <textarea value={form.customInstruction} onChange={e => updateForm('customInstruction', e.target.value)} placeholder="e.g. Always mention the warranty when asked about this product…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
            </div>

            {error && <p style={{ fontSize: 13, color: '#EF4444', marginBottom: 12 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 8 }}>
              {editingProductId && (
                <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#6B7280', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
              <button type="button" onClick={handleSaveProduct} disabled={saving} style={{ padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#fff', background: saving ? '#93C5FD' : '#2563EB', border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : editingProductId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>

          {/* Product list */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Product List</h2>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{products.length} items</span>
            </div>

            {loadingProducts ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', padding: '12px 0' }}>Loading products…</p>
            ) : products.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', padding: '12px 0' }}>No products yet. Add one above.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      {['Image', 'Product', 'Price', 'Discount', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '10px 12px' }}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #E5E7EB' }} onError={e => { e.target.style.display = 'none' }} />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 6, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#9CA3AF' }}>No img</div>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <p style={{ fontWeight: 600, color: '#111827', marginBottom: 2 }}>{product.name}</p>
                          <p style={{ fontSize: 12, color: '#6B7280', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description || '—'}</p>
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>৳{product.price}</td>
                        <td style={{ padding: '10px 12px', color: '#6B7280' }}>{product.discount ? `${product.discount}%` : '0%'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: product.availability === 'available' ? '#F0FDF4' : '#FFF7ED', color: product.availability === 'available' ? '#16A34A' : '#EA580C' }}>
                            {product.availability === 'available' ? 'Available' : 'Stock Out'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button type="button" onClick={() => setSelectedProduct(product)} style={{ fontSize: 12, fontWeight: 500, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>View</button>
                            <button type="button" onClick={() => handleEditProduct(product)} style={{ fontSize: 12, fontWeight: 500, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>Edit</button>
                            <button type="button" onClick={() => handleDeleteProduct(product._id)} style={{ fontSize: 12, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Product Details</h2>
              <button type="button" onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: 18, color: '#6B7280', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              {selectedProduct.imageUrl && (
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8, border: '1px solid #E5E7EB', marginBottom: 16 }} onError={e => { e.target.style.display = 'none' }} />
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Product Name', selectedProduct.name],
                  ['Price', `৳${selectedProduct.price}`],
                  ['Discount', selectedProduct.discount ? `${selectedProduct.discount}%` : '0%'],
                  ['Availability', selectedProduct.availability === 'available' ? 'Available' : 'Stock Out'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{val}</p>
                  </div>
                ))}
                {[
                  ['Description', selectedProduct.description],
                  ['Additional Comment', selectedProduct.additionalComment],
                  ['Custom Instruction', selectedProduct.customInstruction],
                ].map(([label, val]) => val ? (
                  <div key={label} style={{ gridColumn: '1 / -1' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{val}</p>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductView
