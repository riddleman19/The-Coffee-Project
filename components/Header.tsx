'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useStore } from '@/lib/store'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItemCount, setIsCartOpen } = useStore()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container-max px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl">☕</div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                Volcanic
              </span>
              <span className="text-xs text-accent font-semibold tracking-wide">Colombian Coffee</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-primary hover:text-secondary transition-colors font-medium"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-primary hover:text-secondary transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-primary hover:text-secondary transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-primary hover:text-secondary transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Cart Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-light-bg rounded-lg transition-colors"
              aria-label="Open cart"
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-warning text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-light-bg rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border space-y-3">
            <Link
              href="/shop"
              className="block text-primary hover:text-secondary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-primary hover:text-secondary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block text-primary hover:text-secondary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="block text-primary hover:text-secondary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
