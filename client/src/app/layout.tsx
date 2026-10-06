import type {Metadata, Viewport} from "next";
import {Jost} from "next/font/google";
import {Providers} from "@/providers";
import {ScrollToTop} from "@/components/shared/scroll-to-top";
import {JsonLd} from "@/components/shared/seo/json-ld";
import {
    DEFAULT_DESCRIPTION,
    DEFAULT_OG_IMAGE,
    PERSON_NAME,
    SITE_NAME,
    SITE_URL,
    TITLE_TEMPLATE,
    siteGraphJsonLd,
} from "@/lib/seo";

import "./globals.css";

const jost = Jost({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: TITLE_TEMPLATE,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{name: PERSON_NAME, url: SITE_URL}],
    creator: PERSON_NAME,
    publisher: PERSON_NAME,
    category: "technology",
    keywords: [
        "Monir Hossain",
        "Full Stack Developer",
        "Full Stack Developer Bangladesh",
        "Next.js Developer Bangladesh",
        "React Developer Bangladesh",
        "Node.js Developer Bangladesh",
        "MERN Stack Developer Bangladesh",
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: [{url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME}],
        url: SITE_URL,
        siteName: SITE_NAME,
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
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
        <JsonLd data={siteGraphJsonLd()} />
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
