import {} from "../generated/prisma/client";
import { prisma } from "../../src/lib/prisma.ts";
import bcrypt from "bcryptjs";
import { env } from "../../src/config/env.ts";
async function main() {
    console.log("🌱 Seeding database...");
    // ------------------------------------------------------------------
    // 1. Admin & demo users
    // ------------------------------------------------------------------
    const adminPasswordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);
    const admin = await prisma.user.upsert({
        where: { email: env.SEED_ADMIN_EMAIL },
        update: {},
        create: {
            name: "Monir Hossain",
            email: env.SEED_ADMIN_EMAIL,
            passwordHash: adminPasswordHash,
            role: "ADMIN",
            bio: "Full-Stack Developer building fast, scalable, beautiful web applications.",
            lastLoginAt: new Date(),
        },
    });
    const demoPasswordHash = await bcrypt.hash("User@12345", 12);
    await prisma.user.upsert({
        where: { email: "user@devmonir.com" },
        update: {},
        create: {
            name: "Demo User",
            email: "user@devmonir.com",
            passwordHash: demoPasswordHash,
            role: "USER",
        },
    });
    console.log(`  ✓ Admin user: ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
    console.log("  ✓ Demo user: user@devmonir.com / User@12345");
    // ------------------------------------------------------------------
    // 2. Skills
    // ------------------------------------------------------------------
    const skills = [
        {
            name: "JavaScript",
            slug: "javascript",
            description: "High-level, dynamic programming language that enables interactive web pages — the core technology of the web alongside HTML and CSS.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
            category: "FRONTEND",
            proficiency: 92,
            order: 1,
        },
        {
            name: "TypeScript",
            slug: "typescript",
            description: "Typed superset of JavaScript that improves developer experience and reduces runtime errors in large-scale applications.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
            category: "FRONTEND",
            proficiency: 88,
            order: 2,
        },
        {
            name: "React",
            slug: "react",
            description: "Popular JavaScript library for building fast and interactive user interfaces using component-based architecture and a virtual DOM.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
            category: "FRONTEND",
            proficiency: 90,
            order: 3,
        },
        {
            name: "Next.js",
            slug: "next-js",
            description: "React framework enabling server-side rendering, static site generation, and API routes for performance and SEO.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
            category: "FRONTEND",
            proficiency: 85,
            order: 4,
        },
        {
            name: "Tailwind CSS",
            slug: "tailwind-css",
            description: "Utility-first CSS framework that makes it fast and consistent to build responsive, modern user interfaces.",
            iconUrl: "/images/icon.tailwind.png",
            category: "FRONTEND",
            proficiency: 93,
            order: 5,
        },
        {
            name: "Node.js",
            slug: "node-js",
            description: "JavaScript runtime built on Chrome\u2019s V8 engine for building scalable backend services and APIs.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
            category: "BACKEND",
            proficiency: 87,
            order: 6,
        },
        {
            name: "Express.js",
            slug: "express-js",
            description: "Minimal and flexible Node.js web framework for building single-page, multi-page, and RESTful APIs.",
            iconUrl: "/images/express.webp",
            category: "BACKEND",
            proficiency: 89,
            order: 7,
        },
        {
            name: "PostgreSQL",
            slug: "postgresql",
            description: "Powerful, open-source relational database with strong ACID guarantees and advanced query optimization.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
            category: "DATABASE",
            proficiency: 80,
            order: 8,
        },
        {
            name: "Prisma ORM",
            slug: "prisma-orm",
            description: "Next-generation Node.js and TypeScript ORM with a type-safe schema, migrations, and query builder.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
            category: "DATABASE",
            proficiency: 82,
            order: 9,
        },
        {
            name: "MongoDB",
            slug: "mongodb",
            description: "NoSQL document database that stores data in JSON-like documents and scales horizontally with ease.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
            category: "DATABASE",
            proficiency: 84,
            order: 10,
        },
        {
            name: "Git",
            slug: "git",
            description: "Distributed version control system for tracking source code changes and enabling team collaboration.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
            category: "TOOLS",
            proficiency: 90,
            order: 11,
        },
        {
            name: "Docker",
            slug: "docker",
            description: "Containerization platform that packages applications and their dependencies for consistent deployment.",
            iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
            category: "DEVOPS",
            proficiency: 72,
            order: 12,
        },
        {
            name: "Vercel",
            slug: "vercel",
            description: "Cloud platform for static sites and serverless functions, the official hosting platform for Next.js.",
            iconUrl: "/images/vercel.jpeg",
            category: "DEVOPS",
            proficiency: 88,
            order: 13,
        },
        {
            name: "Cloudinary",
            slug: "cloudinary",
            description: "Cloud-based media management platform for uploading, optimizing, and delivering images and video.",
            iconUrl: "/images/cloudinary.svg",
            category: "TOOLS",
            proficiency: 75,
            order: 14,
        },
    ];
    for (const skill of skills) {
        await prisma.skill.upsert({
            where: { slug: skill.slug },
            update: skill,
            create: skill,
        });
    }
    console.log(`  ✓ ${skills.length} skills`);
    // ------------------------------------------------------------------
    // 3. Projects
    // ------------------------------------------------------------------
    const projects = [
        {
            title: "Raangalay",
            slug: "raangalay",
            description: "A premium e-commerce platform specializing in traditional and lifestyle products. High-performance Next.js frontend with seamless UX, responsive product galleries, and optimized page speed.",
            longDescription: "A premium e-commerce platform specializing in traditional and lifestyle products. Developed the high-performance frontend using Next.js, focusing on a seamless user experience, responsive product galleries, and optimized page speed.",
            image: "/images/raangalay.webp",
            repoUrl: "https://github.com/monir-hossaien/raangalay-frontend",
            liveUrl: "https://raangalay-ecommerce.vercel.app",
            tags: [
                "Next.js",
                "Shadcn UI",
                "Tailwind CSS",
                "TypeScript",
                "Lucide Icons",
                "Framer Motion",
            ],
            featured: true,
            status: "PUBLISHED",
            order: 1,
        },
        {
            title: "Doctor Finder",
            slug: "doctor-finder",
            description: "A MERN-based platform to search doctors by location, specialty, and hospital. Secure JWT authentication, admin dashboard, and a full appointment booking system.",
            longDescription: "A MERN-based platform to search doctors by location, specialty, and hospital. Includes secure JWT authentication, an admin dashboard, and a full appointment booking system with modern UI/UX.",
            image: "/images/doctor_finder.webp",
            repoUrl: "https://github.com/monir-hossaien/doctor-finder",
            liveUrl: "https://care-hop-service.vercel.app",
            tags: ["React", "Express.js", "MongoDB", "JWT", "Tailwind", "Zustand"],
            featured: true,
            status: "PUBLISHED",
            order: 2,
        },
        {
            title: "Quran",
            slug: "quran",
            description: "A modern Quran learning app with a beautiful UI and comprehensive features, including audio recitation playback and search by translation.",
            longDescription: "A modern Quran learning app with a beautiful UI and comprehensive features, including audio recitation playback and search by translation, designed to help users study, read, and memorize the Holy Quran effectively.",
            image: "/images/quran.webp",
            repoUrl: "https://github.com/md-mhossain/quran-web-app",
            liveUrl: "https://quran-web-app-sigma.vercel.app",
            tags: ["Next.js", "Tailwind", "Express.js"],
            featured: false,
            status: "PUBLISHED",
            order: 3,
        },
        {
            title: "ShopSphere",
            slug: "shopsphere",
            description: "A full-stack e-commerce demo showcasing payment integration, cart management, and a modern storefront experience.",
            longDescription: "A full-stack e-commerce demo showcasing Stripe payment integration, cart management, product search, and a modern storefront experience built with a scalable architecture.",
            image: "/images/ecommerce.PNG",
            repoUrl: "https://github.com/md-mhossain",
            liveUrl: "",
            tags: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
            featured: false,
            status: "DRAFT",
            order: 4,
        },
    ];
    for (const project of projects) {
        await prisma.project.upsert({
            where: { slug: project.slug },
            update: project,
            create: project,
        });
    }
    console.log(`  ✓ ${projects.length} projects`);
    // ------------------------------------------------------------------
    // 4. Blogs
    // ------------------------------------------------------------------
    const blogs = [
        {
            title: "Understanding the MERN Stack: A Beginner's Guide",
            slug: "understanding-the-mern-stack-a-beginners-guide",
            excerpt: "The MERN stack is a powerful combination of MongoDB, Express.js, React, and Node.js. This guide walks you through how these tools work together to build robust full-stack applications.",
            content: "The MERN stack is a powerful combination of technologies including MongoDB, Express.js, React, and Node.js. This guide walks you through how these tools work together to build robust full-stack applications, with examples and diagrams to make the learning process easier. We cover each layer of the stack, how requests flow through the application, and best practices for structuring a production-ready codebase.",
            coverImage: "/images/Mern Stack.png",
            category: "Web Development",
            tags: ["MERN", "MongoDB", "Express", "React", "Node.js"],
            readTime: 6,
            status: "PUBLISHED",
            publishedAt: new Date("2025-06-25T09:00:00Z"),
            author: { connect: { id: admin.id } },
        },
        {
            title: "What are React Server Components and Why Do They Matter?",
            slug: "what-are-react-server-components-and-why-do-they-matter",
            excerpt: "React Server Components enable rendering on the server without sending unnecessary JavaScript to the browser. Explore their motivation and benefits for performance.",
            content: "React Server Components enable rendering on the server without sending unnecessary JavaScript to the browser. This article explores the motivation behind Server Components, their benefits for performance, and how to start using them with frameworks like Next.js. We compare streaming, suspense, and data fetching patterns to help you decide when to use them.",
            coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
            category: "React.js",
            tags: ["React", "Next.js", "Server Components"],
            readTime: 7,
            status: "PUBLISHED",
            publishedAt: new Date("2025-06-20T09:00:00Z"),
            author: { connect: { id: admin.id } },
        },
        {
            title: "Why Tailwind CSS is a Game Changer for Modern UI",
            slug: "why-tailwind-css-is-a-game-changer-for-modern-ui",
            excerpt: "Tailwind CSS introduces a utility-first approach to styling, making it faster and more consistent to build responsive user interfaces.",
            content: "Tailwind CSS introduces a utility-first approach to styling, making it faster and more consistent to build responsive user interfaces. This post explains how Tailwind improves development speed, how to customize themes, and why developers love it. We also look at design tokens, dark mode, and how it pairs with component libraries like shadcn/ui.",
            coverImage: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80",
            category: "CSS & Styling",
            tags: ["Tailwind CSS", "CSS", "UI/UX"],
            readTime: 5,
            status: "PUBLISHED",
            publishedAt: new Date("2025-06-15T09:00:00Z"),
            author: { connect: { id: admin.id } },
        },
        {
            title: "Deploying Your Full-Stack App on Render",
            slug: "deploying-your-full-stack-app-on-render",
            excerpt: "Deploying full-stack applications can be intimidating, but Render makes it simple. This tutorial covers step-by-step deployment of a Node.js backend and React frontend.",
            content: "Deploying full-stack applications can be intimidating, but Render makes it simple. This tutorial covers step-by-step deployment of a Node.js backend and React frontend, handling environment variables, and setting up auto-deploy from GitHub. We also cover migrations, logging, and health checks for production reliability.",
            coverImage: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=80",
            category: "Deployment",
            tags: ["Deployment", "Render", "DevOps"],
            readTime: 8,
            status: "PUBLISHED",
            publishedAt: new Date("2025-06-10T09:00:00Z"),
            author: { connect: { id: admin.id } },
        },
        {
            title: "Securing Your Node.js APIs with JWT Authentication",
            slug: "securing-your-nodejs-apis-with-jwt-authentication",
            excerpt: "Authentication is critical in modern applications. Learn how to implement JWT-based authentication in a Node.js API using Express and protect routes with middleware.",
            content: "Authentication is critical in modern applications. Learn how to implement JSON Web Token (JWT) based authentication in a Node.js API using Express, and protect routes with middleware to ensure secure access control. We cover access vs refresh tokens, hashing strategies, rotation, and common pitfalls to avoid.",
            coverImage: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1200&q=80",
            category: "Backend",
            tags: ["Node.js", "JWT", "Security"],
            readTime: 9,
            status: "PUBLISHED",
            publishedAt: new Date("2025-06-05T09:00:00Z"),
            author: { connect: { id: admin.id } },
        },
        {
            title: "React Performance Optimization: Techniques You Should Know",
            slug: "react-performance-optimization-techniques-you-should-know",
            excerpt: "React performance issues can occur as your application grows. This post discusses effective techniques like memoization, lazy loading, and code splitting.",
            content: "React performance issues can occur as your application grows. This post discusses effective techniques like memoization, lazy loading, code splitting, and virtualization to boost your React app\u2019s speed and efficiency. We also cover profiling with React DevTools and measuring Core Web Vitals.",
            coverImage: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80",
            category: "React.js",
            tags: ["React", "Performance", "Core Web Vitals"],
            readTime: 7,
            status: "PUBLISHED",
            publishedAt: new Date("2025-06-01T09:00:00Z"),
            author: { connect: { id: admin.id } },
        },
    ];
    for (const blog of blogs) {
        await prisma.blog.upsert({
            where: { slug: blog.slug },
            update: blog,
            create: blog,
        });
    }
    console.log(`  ✓ ${blogs.length} blogs`);
    // ------------------------------------------------------------------
    // 5. Sample messages
    // ------------------------------------------------------------------
    const sampleMessages = [
        {
            name: "Sarah Ahmed",
            email: "sarah@example.com",
            subject: "Project inquiry",
            body: "Hi Monir, we are looking for a full-stack developer to build an e-commerce platform. Would love to discuss!",
            status: "NEW",
        },
        {
            name: "James Carter",
            email: "james@example.com",
            subject: "Freelance opportunity",
            body: "Great portfolio! We need help modernizing our React dashboard. Are you available next month?",
            status: "READ",
            readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
            name: "Priya Sharma",
            email: "priya@example.com",
            subject: "Thanks!",
            body: "The blog on JWT authentication was super helpful. Thanks for sharing your knowledge.",
            status: "REPLIED",
            repliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
    ];
    const messageCount = await prisma.message.count();
    if (messageCount === 0) {
        for (const message of sampleMessages) {
            await prisma.message.create({ data: message });
        }
        console.log(`  ✓ ${sampleMessages.length} sample messages`);
    }
    else {
        console.log("  - Messages already seeded, skipping");
    }
    // ------------------------------------------------------------------
    // 6. App settings
    // ------------------------------------------------------------------
    const settings = {
        siteName: "dev.monir",
        siteDescription: "Full-Stack Developer | Next.js, React, Node.js",
        contactEmail: "monirhdigital@gmail.com",
        socials: {
            linkedin: "https://www.linkedin.com/in/monirhdigital",
            github: "https://github.com/monir-hossaien",
            facebook: "https://facebook.com/MonirHossain20230",
            whatsapp: "https://wa.me/8801787960556",
            medium: "https://medium.com/@monirhdigital",
        },
        resumeUrl: "/cv/Monir_Hossain.pdf",
        hero: {
            title: "Trusted Partner for Your Website Develop.",
            subtitle: "Building the world's best marketing websites for over a decade. Your trusted partner for strategy, design, and dev.",
        },
        workProcess: [
            {
                title: "Discovery",
                description: "We start every new client interaction with an in-depth discovery call where we get to know each other, discuss your current and future objectives, and recommend the best course of action.",
            },
            {
                title: "Strategy",
                description: "Every end-to-end project of ours begins with a bespoke pre-build strategy. From brand ID consultation to in-depth code reviews we set the stage for success.",
            },
            {
                title: "Design",
                description: "After we have a comprehensive understanding of your brand, we move onto design. Each page is designed, reviewed, and given your stamp of approval.",
            },
            {
                title: "Build",
                description: "Whether we just finished designing your new site or you are handing off finished designs, we apply our trusted development process to your project.",
            },
        ],
    };
    for (const [key, value] of Object.entries(settings)) {
        await prisma.appSetting.upsert({
            where: { key },
            update: { value: value },
            create: { key, value: value },
        });
    }
    console.log(`  ✓ ${Object.keys(settings).length} app settings`);
    // ------------------------------------------------------------------
    // 7. Sample analytics
    // ------------------------------------------------------------------
    const eventCount = await prisma.analyticsEvent.count();
    if (eventCount === 0) {
        const events = [];
        const paths = ["/", "/about", "/projects", "/blogs", "/contact"];
        for (let day = 0; day < 30; day += 1) {
            const base = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
            const visits = 5 + Math.floor(Math.random() * 20);
            for (let i = 0; i < visits; i += 1) {
                const d = new Date(base);
                d.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
                events.push({
                    eventType: "pageview",
                    path: paths[Math.floor(Math.random() * paths.length)],
                    createdAt: d,
                });
            }
        }
        await prisma.analyticsEvent.createMany({ data: events });
        console.log(`  ✓ ${events.length} analytics events`);
    }
    else {
        console.log("  - Analytics already seeded, skipping");
    }
    console.log("✅ Seeding complete.");
}
main()
    .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map