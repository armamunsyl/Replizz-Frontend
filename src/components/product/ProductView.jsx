import { useCallback, useEffect, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
import api from '../../lib/api'
import { usePage } from '../../context/PageContext'
import { useAuth } from '../../context/AuthContext'

function timeLabel() {
  const now = new Date()
  const clock = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now)

  return `Today, ${clock}`
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read selected image.'))

    reader.readAsDataURL(file)
  })
}

function emptyForm() {
  return {
    image: '',
    productName: '',
    description: '',
    price: '',
    additionalComment: '',
    discount: '',
    availability: 'available',
    customInstruction: '',
  }
}

function mapProductToForm(product) {
  return {
    image: product.imageBase64 || '',
    productName: product.name,
    description: product.description || '',
    price: product.price,
    additionalComment: product.additionalComment || '',
    discount: product.discount || '0',
    availability: product.availability || 'available',
    customInstruction: product.customInstruction || '',
  }
}

function ProductView() {
  const { selectedPage } = usePage()
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const displayName = user?.displayName || user?.email || 'User'
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

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)
      updateForm('image', String(dataUrl))
      setError('')
    } catch {
      setError('Image upload failed. Please try another file.')
    }
  }

  const handleSaveProduct = async () => {
    if (!selectedPage) return
    const name = form.productName.trim()
    const price = form.price.trim()

    if (!name || !price) {
      setError('Product name and price are required.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      name,
      description: form.description.trim(),
      price,
      additionalComment: form.additionalComment.trim(),
      discount: form.discount.trim() || '0',
      availability: form.availability,
      customInstruction: form.customInstruction.trim(),
      imageBase64: form.image,
    }

    try {
      if (editingProductId) {
        const { data } = await api.put(`/api/products/${selectedPage.pageId}/${editingProductId}`, payload)
        setProducts((prev) => prev.map((p) => p._id === editingProductId ? data.data : p))
        setEditingProductId(null)
      } else {
        const { data } = await api.post(`/api/products/${selectedPage.pageId}`, payload)
        setProducts((prev) => [data.data, ...prev])
      }
      setForm(emptyForm())
    } catch (err) {
      setError('Failed to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProductId(product._id)
    setForm(mapProductToForm(product))
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingProductId(null)
    setForm(emptyForm())
    setError('')
  }

  const handleDeleteProduct = async (productId) => {
    if (!selectedPage) return
    try {
      await api.delete(`/api/products/${selectedPage.pageId}/${productId}`)
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      if (editingProductId === productId) handleCancelEdit()
      if (selectedProduct?._id === productId) setSelectedProduct(null)
    } catch (err) {
      console.error('Delete product error:', err)
    }
  }

  return (
    <section className="workspace product-view anim-reveal" aria-label="Your products dashboard">
      <header className="workspace-top product-top anim-pop anim-delay-1">
        <div className="overview-title-wrap">
          <p className="overview-kicker">Workspace</p>
          <h1>Your Product</h1>
        </div>

        <div className="workspace-actions">
          <ProfilePill />
        </div>
      </header>

      <div className="product-content anim-pop anim-delay-2">
        <section className="product-form-card anim-hover-lift" aria-label="Product form">
          <div className="product-grid">
            <div className="product-field product-field-full">
              <label htmlFor="product-image" className="product-label">
                Image Upload
              </label>
              <div className="product-image-row">
                <label htmlFor="product-image" className="product-upload-button anim-hover-lift">
                  Upload Image
                </label>
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  className="product-file-input"
                  onChange={handleImageUpload}
                />
                <div className="product-image-preview">
                  {form.image ? (
                    <img src={form.image} alt="Product preview" />
                  ) : (
                    <span>No image selected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="product-field">
              <label htmlFor="product-name" className="product-label">
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                className="product-input"
                value={form.productName}
                onChange={(event) => updateForm('productName', event.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="product-field">
              <label htmlFor="product-price" className="product-label">
                Price
              </label>
              <input
                id="product-price"
                type="number"
                className="product-input"
                value={form.price}
                onChange={(event) => updateForm('price', event.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="product-field">
              <label htmlFor="product-discount" className="product-label">
                Discount
              </label>
              <input
                id="product-discount"
                type="number"
                className="product-input"
                value={form.discount}
                onChange={(event) => updateForm('discount', event.target.value)}
                placeholder="0"
              />
            </div>

            <div className="product-field">
              <label className="product-label">Availability</label>
              <div className="product-toggle-row" role="radiogroup" aria-label="Availability">
                <button
                  type="button"
                  className={`product-toggle anim-hover-lift ${form.availability === 'available' ? 'active' : ''}`}
                  onClick={() => updateForm('availability', 'available')}
                >
                  Available
                </button>
                <button
                  type="button"
                  className={`product-toggle anim-hover-lift ${form.availability === 'stock-out' ? 'active' : ''}`}
                  onClick={() => updateForm('availability', 'stock-out')}
                >
                  Stock Out
                </button>
              </div>
            </div>

            <div className="product-field product-field-full">
              <label htmlFor="product-description" className="product-label">
                Description
              </label>
              <textarea
                id="product-description"
                className="product-textarea"
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                placeholder="Write product description"
              />
            </div>

            <div className="product-field product-field-full">
              <label htmlFor="product-comment" className="product-label">
                Additional Comment
              </label>
              <textarea
                id="product-comment"
                className="product-textarea"
                value={form.additionalComment}
                onChange={(event) => updateForm('additionalComment', event.target.value)}
                placeholder="Write any additional comment"
              />
            </div>

            <div className="product-field product-field-full">
              <label htmlFor="product-instruction" className="product-label">
                Custom Instruction For This Product
              </label>
              <textarea
                id="product-instruction"
                className="product-textarea"
                value={form.customInstruction}
                onChange={(event) => updateForm('customInstruction', event.target.value)}
                placeholder="Write custom instruction"
              />
            </div>
          </div>

          <div className="product-form-footer">
            {error ? <p className="product-error-text">{error}</p> : <span />}
            <div className="product-form-actions">
              {editingProductId ? (
                <button type="button" className="product-cancel-button anim-hover-lift" onClick={handleCancelEdit}>
                  Cancel
                </button>
              ) : null}
              <button type="button" className="product-save-button anim-hover-lift" onClick={handleSaveProduct}>
                {saving ? 'Saving...' : editingProductId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </section>

        <section className="product-list-card anim-hover-lift" aria-label="Saved products list">
          <header className="product-list-header">
            <h2>Saved Product List</h2>
            <p>{products.length} item(s)</p>
          </header>

          <div className="product-list-wrap">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Instruction</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingProducts ? (
                  <tr><td colSpan={7} style={{ opacity: 0.4, padding: '1.5rem' }}>Loading products…</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={7} style={{ opacity: 0.4, padding: '1.5rem' }}>No products yet. Add one above.</td></tr>
                ) : products.map((product, index) => (
                  <tr key={product._id} className="anim-pop" style={{ animationDelay: `${0.12 + index * 0.03}s` }}>
                    <td>
                      <div className="product-cell-image">
                        {product.imageBase64 ? (
                          <img src={product.imageBase64} alt={product.name} />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <p className="product-cell-name">{product.name}</p>
                      <p className="product-cell-subtext">{product.description || 'No description'}</p>
                      <p className="product-cell-subtext">{product.additionalComment || 'No comment'}</p>
                    </td>
                    <td>
                      <span className="product-price-pill">${product.price}</span>
                    </td>
                    <td>
                      <span className="product-discount-pill">
                        {product.discount ? `${product.discount}%` : '0%'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`product-status-pill ${product.availability === 'available' ? 'available' : 'stock-out'
                          }`}
                      >
                        {product.availability === 'available' ? 'Available' : 'Stock Out'}
                      </span>
                    </td>
                    <td>
                      <p className="product-cell-subtext">
                        {product.customInstruction || 'No custom instruction'}
                      </p>
                      <p className="product-cell-subtext">{product.savedAt || new Date(product.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td>
                      <div className="product-action-row">
                        <button
                          type="button"
                          className="product-view-button anim-hover-lift"
                          onClick={() => setSelectedProduct(product)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="product-edit-button anim-hover-lift"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="product-delete-button anim-hover-lift"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedProduct ? (
        <div
          className="product-modal-backdrop anim-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Product details modal"
          onClick={() => setSelectedProduct(null)}
        >
          <article className="product-modal anim-slide-right" onClick={(event) => event.stopPropagation()}>
            <header className="product-modal-head">
              <h2>Product Details</h2>
              <button
                type="button"
                className="product-modal-close anim-hover-lift"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </header>

            <div className="product-modal-body">
              <div className="product-modal-image">
                {selectedProduct.imageBase64 ? (
                  <img src={selectedProduct.imageBase64} alt={selectedProduct.name} />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="product-modal-grid">
                <div>
                  <p className="product-modal-label">Product Name</p>
                  <p className="product-modal-value">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="product-modal-label">Price</p>
                  <p className="product-modal-value">${selectedProduct.price}</p>
                </div>
                <div>
                  <p className="product-modal-label">Discount</p>
                  <p className="product-modal-value">
                    {selectedProduct.discount ? `${selectedProduct.discount}%` : '0%'}
                  </p>
                </div>
                <div>
                  <p className="product-modal-label">Availability</p>
                  <p className="product-modal-value">
                    {selectedProduct.availability === 'available' ? 'Available' : 'Stock Out'}
                  </p>
                </div>
                <div className="product-modal-wide">
                  <p className="product-modal-label">Description</p>
                  <p className="product-modal-value">
                    {selectedProduct.description || 'No description'}
                  </p>
                </div>
                <div className="product-modal-wide">
                  <p className="product-modal-label">Additional Comment</p>
                  <p className="product-modal-value">
                    {selectedProduct.additionalComment || 'No comment'}
                  </p>
                </div>
                <div className="product-modal-wide">
                  <p className="product-modal-label">Custom Instruction</p>
                  <p className="product-modal-value">
                    {selectedProduct.customInstruction || 'No custom instruction'}
                  </p>
                </div>
                <div className="product-modal-wide">
                  <p className="product-modal-label">Last Updated</p>
                  <p className="product-modal-value">{selectedProduct.savedAt}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}

export default ProductView
