import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-charcoal">
            <span className="text-orange">echo</span>Hello
          </Link>
          <div className="flex gap-8">
            <Link href="/about/" className="text-charcoal hover:text-orange transition-colors">
              About
            </Link>
            <Link href="/services/" className="text-charcoal hover:text-orange transition-colors">
              Services
            </Link>
            <Link href="/oss/" className="text-charcoal hover:text-orange transition-colors">
              OSS
            </Link>
            <Link href="/projects/" className="text-charcoal hover:text-orange transition-colors">
              Projects
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
