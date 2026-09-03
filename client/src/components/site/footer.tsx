import Link from 'next/link';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { FaGithub, FaLinkedin, FaFacebookSquare } from 'react-icons/fa';

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mmrhossain',
    Icon: FaLinkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mmrhossain',
    Icon: FaGithub,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/MonirHossain20230',
    Icon: FaFacebookSquare,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/8801787960556',
    Icon: MessageCircle,
  },
];

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog', path: '/blogs' },
  { label: 'Contact', path: '/contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-black text-white dark:bg-gray-950">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="font-display text-3xl font-extrabold uppercase tracking-tight"
            >
              dev<span className="text-accent">.monir</span>
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-gray-400">
              Full-stack developer crafting fast, scalable, and beautiful web applications. Trusted
              partner for strategy, design, and development.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-all hover:border-accent hover:bg-accent hover:text-black lg:h-10 lg:w-10"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h5 className="mb-4 font-semibold uppercase tracking-widest text-gray-500">Menu</h5>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-gray-300 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h5 className="mb-4 font-semibold uppercase tracking-widest text-gray-500">Say hello</h5>
            <div className="space-y-3 text-gray-300">
              <a
                href="mailto:monirhdigital@gmail.com"
                className="flex min-w-0 items-center gap-3 break-all transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 shrink-0" />
                info.mmrhossain@gmail.com
              </a>
              <a
                href="tel:+8801787960556"
                className="flex min-w-0 items-center gap-3 transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +880 1787 960 556
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 sm:flex-row">
          <p>&copy; dev.monir {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/" className="transition-colors hover:text-accent">
              Privacy
            </Link>
            <Link href="/" className="transition-colors hover:text-accent">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
