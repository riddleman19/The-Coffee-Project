'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShopifyProduct } from '@/lib/shopify'
import { useStore } from '@/lib/store'
import { shopifyClient, CREATE_CART, ADD_TO_CART, GET_CART } from '@/lib/shopify'

interface ProductCardProps {
  product: ShopifyProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, setCart } = useStore()
  const imageUrl = product.images.edges[0]?.node.url
  const variant = product.variants.edges[0]?.node
  const price = variant?.priceV2.amount
  const comparePrice = variant?.compareAtPriceV2?.amount
  const discount = comparePrice ? Math.round(((parseFloat(comparePrice) - parseFloat(price)) / parseFloat(comparePrice)) * 100) : 0

  const handleAddToCart = async () => {
    try {
      if (!variant) return

      let cartId = cart?.id

      // Create cart if it doesn't exist
      if (!cartId) {
        const createCartResponse = await shopifyClient.request(CREATE_CART, {
          lineItems: [
            {
              variantId: variant.id,
              quantity: 1,
            },
          ],
        })
        cartId = createCartResponse.cartCreate.cart.id
        setCart(createCartResponse.cartCreate.cart)
        return
      }

      // Add to existing cart
      const addToCartResponse = await shopifyClient.request(ADD_TO_CART, {
        cartId,
        lineItems: [
          {
            variantId: variant.id,
            quantity: 1,
          },
        ],
      })
      setCart(addToCartResponse.cartLinesAdd.cart)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  return (
    <div className="card card-hover group">
      {/* Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-lg bg-light-bg aspect-square">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-warning text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors mb-2 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Origin & Roast Level */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.metafield && (
            <span className="text-xs bg-light-bg text-primary px-2 py-1 rounded">
              {product.metafield.value}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray mb-4 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-primary">${price}</span>
          {comparePrice && (
            <span className="text-sm text-gray line-through">${comparePrice}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 btn-primary-light text-sm py-2"
            disabled={!variant}
          >
            Add to Cart
          </button>
          <Link
            href={`/products/${product.handle}`}
            className="flex-1 btn-secondary text-sm py-2 text-center"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
