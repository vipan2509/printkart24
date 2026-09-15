'use client'

import { useState } from 'react'
import { Check, Heart, Minus, Plus, Star, Upload } from 'lucide-react'
import type { Product } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog'
import { useCart, useWishlist } from '@/hooks/use-store'

export function ProductCustomizer({ product }: { product: Product }) {
  const [image, setImage] = useState(product.image)
  const [uploadedImage, setUploadedImage] = useState('')
  const [option, setOption] = useState(product.options[0])
  const [quantity, setQuantity] = useState(1)
  const [text, setText] = useState('Your story starts here')
  const [cartMessage, setCartMessage] = useState('')
  const [wishlist, setWishlist] = useWishlist()
  const { add } = useCart()
  const saved = wishlist.includes(product.slug)
  const total = product.price * quantity

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => {
      const source = new Image()
      source.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(source.width, source.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(source.width * scale))
        canvas.height = Math.max(1, Math.round(source.height * scale))
        canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.78)
        setUploadedImage(dataUrl)
        setImage(dataUrl)
      }
      source.src = typeof reader.result === 'string' ? reader.result : ''
    }
    reader.readAsDataURL(file)
  }

  function addItem() {
    add({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      option,
      customization: text,
      uploadedImage,
    })
    setCartMessage(`${quantity} ${quantity === 1 ? 'Item' : 'Items'} added to cart`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.setTimeout(() => setCartMessage(''), 2600)
  }

  return (
    <div className="product-detail">
      <div className="product-gallery">
        <div className="main-product-image">
          <img src={image} alt={product.name} />
          <span className="preview-label">Live preview</span>
        </div>
        <div className="gallery-thumbs">
          {product.gallery.map((src) => (
            <button
              type="button"
              key={src}
              onClick={() => setImage(src)}
              className={image === src ? 'active' : ''}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      </div>
      <div className="customizer-panel">
        <div className="eyebrow">{product.categoryLabel.toUpperCase()}</div>
        <h1>{product.name}</h1>
        <div className="detail-rating">
          <Star size={16} fill="currentColor" /> {product.rating}{' '}
          <span>({product.reviews} reviews)</span>
        </div>
        <p className="detail-description">{product.description}</p>
        <div className="price-row">
          <strong>{formatPrice(total)}</strong>
          {product.originalPrice && <del>{formatPrice(product.originalPrice * quantity)}</del>}
          <span>inclusive of all taxes</span>
        </div>
        <div className="custom-option">
          <label>Choose your style</label>
          <div className="option-list">
            {product.options.map((item) => (
              <button
                type="button"
                className={option === item ? 'selected' : ''}
                onClick={() => setOption(item)}
                key={item}
              >
                {option === item && <Check size={15} />} {item}
              </button>
            ))}
          </div>
        </div>
        <div className="custom-option">
          <label>Add your personal touch</label>
          <div className="text-preview">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={40}
              aria-label="Personal message"
            />
            <span>{text.length}/40</span>
          </div>
        </div>
        <label className="upload-box">
          <Upload size={18} />
          <span>{uploadedImage ? 'Photo uploaded' : 'Upload your photo'}</span>
          <small>JPG or PNG, up to 5MB</small>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            aria-label="Upload your photo"
          />
        </label>
        <div className="purchase-row">
          <div className="quantity-control">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          <button type="button" className="button-primary add-button" onClick={addItem}>
            {cartMessage || 'Add to cart'} <span>{formatPrice(total)}</span>
          </button>
          <button
            type="button"
            className={`wishlist-button ${saved ? 'saved' : ''}`}
            onClick={() =>
              setWishlist(
                saved
                  ? wishlist.filter((item) => item !== product.slug)
                  : [...wishlist, product.slug],
              )
            }
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="product-note">Free delivery above ₹999 · Made to order in India</p>
      </div>
    </div>
  )
}

export function ProductDetailExtras({ product }: { product: Product }) {
  const recommendations = [
    { label: 'Classic finish', image: product.image },
    { label: 'Premium finish', image: product.gallery[0] ?? product.image },
    { label: 'Gift-ready set', image: product.image },
    { label: 'Desk essentials', image: product.gallery[0] ?? product.image },
  ]

  return (
    <div className="product-detail-extras">
      <section className="detail-rail">
        <div className="detail-section-heading">
          <div>
            <span className="eyebrow">CURATED FOR YOU</span>
            <h2>Other designs you might like</h2>
          </div>
          <a href={`/category/${product.category}`}>View all</a>
        </div>
        <div className="detail-recommendations">
          {recommendations.map((item) => (
            <a href={`/category/${product.category}`} key={item.label}>
              <img src={item.image} alt="" />
              <strong>{item.label}</strong>
              <span>From {formatPrice(product.price)}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="detail-info-grid">
        <div>
          <span className="eyebrow">ABOUT {product.categoryLabel.toUpperCase()}</span>
          <h2>Made for your everyday moments</h2>
          <p>
            {product.description} Designed with thoughtful details and printed to order in India.
          </p>
          <ul>
            <li>Premium materials and vibrant, lasting color</li>
            <li>Personalize with your message or artwork</li>
            <li>Carefully checked before it leaves our studio</li>
            <li>Made to order with less unnecessary waste</li>
          </ul>
        </div>
        <div>
          <span className="eyebrow">ABOUT THIS DESIGN</span>
          <h2>Make it unmistakably yours</h2>
          <p>
            Choose a finish, add your words, and upload a photo when your design needs a personal
            touch.
          </p>
          <button type="button" className="button-secondary">
            Contact us
          </button>
        </div>
      </section>

      <section className="detail-review-section">
        <div className="review-summary">
          <span className="eyebrow">CUSTOMER REVIEWS</span>
          <strong>{product.rating}</strong>
          <span className="stars">★★★★★</span>
          <small>{product.reviews.toLocaleString()} verified reviews</small>
        </div>
        <div className="review-list">
          {[
            'Beautiful quality and exactly what I imagined.',
            'The finish feels premium and delivery was smooth.',
            'A thoughtful gift that arrived looking wonderful.',
          ].map((review) => (
            <article key={review}>
              <span className="stars">★★★★★</span>
              <strong>Verified purchase</strong>
              <p>{review}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-newsletter">
        <span className="eyebrow">STAY IN THE LOOP</span>
        <h2>Get exclusive offers</h2>
        <p>New products, design inspiration, and offers from PRINTKART24.</p>
        <form>
          <input type="email" placeholder="Your email address" aria-label="Your email address" />
          <button type="submit" className="button-primary">
            Sign up now
          </button>
        </form>
      </section>
    </div>
  )
}
