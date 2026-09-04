import type {Metadata, Viewport} from "next";
import {Jost} from "next/font/google";
import {Providers} from "@/components/providers";
import {ScrollToTop} from "@/components/site/scroll-to-top";

import "./globals.css";

const jost = Jost({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

const SITE_NAME = "Monir Hossain | Full Stack Developer";
const SITE_DESCRIPTION =
    "Monir Hossain is a full-stack developer specializing in Next.js, React, Node.js and modern UI/UX. Explore projects, blogs, and skills.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-monir.vercel.app";

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            name: "Monir Hossain",
            url: SITE_URL,
            logo: `${SITE_URL}/images/favicon.png`,
            sameAs: [
                "https://www.linkedin.com/in/mmrhossain",
                "https://github.com/mmrhossain",
                "https://facebook.com/MonirHossain20230",
                "https://wa.me/8801787960556",
            ],
        },
        {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
        },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-monir.vercel.app",
    ),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "Monir Hossain",
        "portfolio",
        "full stack developer",
        "Next.js",
        "React",
        "Node.js",
        "web developer",
    ],
    authors: [{name: "Monir Hossain"}],
    openGraph: {
        type: "website",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [{url: "https://res.cloudinary.com/dw0ojh7h8/image/upload/v1788488505/seo-image_p2ftyo.webp"}],
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-monir.vercel.app",
        siteName: "dev.monir",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: ["https://res.cloudinary.com/dw0ojh7h8/image/upload/v1788488505/seo-image_p2ftyo.webp"],
    },
    robots: {index: true, follow: true},
    alternates: {
        canonical: "/",
    },
};

export const viewport: Viewport = {
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "#ffffff"},
        {media: "(prefers-color-scheme: dark)", color: "#0f172a"},
    ],
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={jost.variable}
        >
        <body
            className="min-h-screen bg-background text-foreground antialiased"
            suppressHydrationWarning
        >
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
        <Providers>
            <>
                <ScrollToTop/>
                {children}
            </>
        </Providers>
        </body>
        </html>
    );
}
