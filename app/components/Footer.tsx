import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 上半部分：三列布局 */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* 左：Logo + 文案 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/icon/home_app_logo.svg"
                alt="Global Living Exchange logo"
                width={100}
                height={100}
              />
              <span className="text-lg font-semibold text-[rgb(var(--color-primary))]">
                Global Living Exchange
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[rgb(var(--color-muted))] max-w-md">
              Live like a local through verified home exchanges. Join our
              trusted community for authentic, mid- to long-term stays
              around the world.
            </p>
          </div>

          {/* 中：Company */}
          <div>
            <h3 className="text-base font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* 右：Legal */}
          <div>
            <h3 className="text-base font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 分割线 */}
        <div className="mt-10 border-t border-[rgb(var(--color-border))] pt-6">
          {/* 下半部分：居中 logo + 版权文字 */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-[rgb(var(--color-muted))]">
              © 2025 Global Living Exchange. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
