import type {Metadata, Viewport} from "next";
import {Providers} from "@/components/providers";
import {ScrollToTop} from "@/components/site/scroll-to-top";

import "./globals.css";

const SITE_NAME = "Monir Hossain | Full Stack Developer";
const SITE_DESCRIPTION =
    "Monir Hossain is a full-stack developer specializing in Next.js, React, Node.js and modern UI/UX. Explore projects, blogs, and skills.";

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
        images: [{url: "/images/seo-image.PNG"}],
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-monir.vercel.app",
        siteName: "dev.monir",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: ["/images/seo-image.PNG"],
    },
    robots: {index: true, follow: true},
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
        <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
        <body
            className="min-h-screen bg-background text-foreground antialiased"
            suppressHydrationWarning
        >
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
