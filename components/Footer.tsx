'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="container-max px-4 py-12 md:py-16">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">☕</div>
              <div>
                <div className="font-bold text-primary">Volcanic</div>
                <div className="text-xs text-accent font-semibold">Colombian Coffee</div>
              </div>
            </div>
            <p className="text-sm text-gray leading-relaxed">
              Hand-roasted by SCA-certified expert. Sourced directly from a family farm in Colombia's volcanic highlands.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-gray hover:text-secondary transition-colors">
                  All Coffee
                </Link>
              </li>
              <li>
                <Link href="/shop?type=subscription" className="text-gray hover:text-secondary transition-colors">
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/shop?type=gift" className="text-gray hover:text-secondary transition-colors">
                  Gift Sets
                </Link>
              </li>
              <li>
                <Link href="/shop?type=brewing" className="text-gray hover:text-secondary transition-colors">
                  Brewing Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray hover:text-secondary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Connect</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray hover:text-secondary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/volcaniccolombianc offee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray hover:text-secondary transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/volcaniccolomb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray hover:text-secondary transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-gray hover:text-secondary transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>

            <div className="flex gap-2">
              <span className="inline-block px-3 py-1 bg-light-bg rounded-full text-xs font-semibold text-primary">
                🌱 Organic
              </span>
              <span className="inline-block px-3 py-1 bg-light-bg rounded-full text-xs font-semibold text-primary">
                ☕ SCA
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray">
          <p>© {currentYear} Volcanic Colombian Coffee. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-secondary transition-colors">
              Shipping & Returns
            </Link>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-gray-light mb-3">Certified & Trusted By</p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <span className="text-xs font-semibold text-primary">🏆 SCA Q-Grader Certified</span>
            <span className="text-xs font-semibold text-primary">🌱 USDA Organic Certified</span>
            <span className="text-xs font-semibold text-primary">🤝 Fair Trade Direct</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
