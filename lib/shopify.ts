import { GraphQLClient } from 'graphql-request'

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''
const token = process.env.SHOPIFY_STOREFRONT_TOKEN || ''

if (!storeDomain || !token) {
  console.warn('Missing Shopify Storefront credentials. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN')
}

const endpoint = `https://${storeDomain}/api/2024-01/graphql.json`

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': token,
    'Content-Type': 'application/json',
  },
})

// ===== SHOPIFY QUERIES =====

export const GET_PRODUCTS = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 3) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                compareAtPriceV2 {
                  amount
                }
              }
            }
          }
          metafield(namespace: "custom", key: "origin") {
            value
          }
          metafield(namespace: "custom", key: "roast_level") {
            value
          }
          metafield(namespace: "custom", key: "tasting_notes") {
            value
          }
          metafield(namespace: "custom", key: "cupping_score") {
            value
          }
        }
      }
    }
  }
`

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
            }
            availableForSale
            sku
          }
        }
      }
      metafield(namespace: "custom", key: "origin") {
        value
      }
      metafield(namespace: "custom", key: "altitude") {
        value
      }
      metafield(namespace: "custom", key: "roast_level") {
        value
      }
      metafield(namespace: "custom", key: "tasting_notes") {
        value
      }
      metafield(namespace: "custom", key: "cupping_score") {
        value
      }
      metafield(namespace: "custom", key: "roast_date") {
        value
      }
    }
  }
`

export const CREATE_CART = `
  mutation CreateCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lineItems: $lineItems }) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lineItems: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lineItems) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  handle
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`

export const UPDATE_CART_LINES = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
            }
          }
        }
      }
    }
  }
`

// ===== TYPE DEFINITIONS =====

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        priceV2: {
          amount: string
          currencyCode: string
        }
        compareAtPriceV2?: {
          amount: string
        }
        availableForSale?: boolean
        sku?: string
      }
    }>
  }
  metafield?: {
    value: string | null
  }
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
      handle?: string
    }
    priceV2: {
      amount: string
      currencyCode: string
    }
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: CartLine
    }>
  }
  cost?: {
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
}
