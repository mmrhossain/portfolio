import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { serverGetSettings } from "@/app/actions";

export async function Hero() {
  const settings = await serverGetSettings("hero");

  const hero = settings?.data?.hero as
    | {
      title?: string;
      subtitle?: string;
    }
    | undefined;

  const title =
    hero?.title ?? "Trusted Partner for Your Website Development.";

  const subtitle =
    hero?.subtitle ??
    "Building modern, scalable, and high-performance web applications with clean architecture and exceptional user experiences.";

  return (
    <section className="relative overflow-hidden py-10 md:py-12 2xl:py-42">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30">
        <Image
          src="/images/bg-gradiant1.svg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Live Status Badge */}
            <span className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-600 backdrop-blur sm:gap-3 sm:px-4 sm:text-sm dark:text-green-400">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              Available for new projects
            </span>

            <h1 className="mt-6 font-display text-3xl font-bold leading-[1.05] tracking-tight break-words sm:text-5xl md:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-10 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
                <Link href="/projects">
                  Show My Work
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/contact">Let's Talk</Link>
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Animated Glow */}
              <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-gradient-to-r from-teal-400/30 via-cyan-400/20 to-lime-400/30 blur-3xl" />

              {/* Floating Image Container */}
              <div className="mx-auto w-full max-w-[400px] animate-[float_6s_ease-in-out_infinite] 2xl:max-w-[520px]">
                <Image
                  src="/images/portfolio.webp"
                  alt="Monir Hossain"
                  width={520}
                  height={520}
                  priority
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, (max-width: 1536px) 400px, 520px"
                  className="aspect-square h-auto w-full rounded-md border border-border/50 object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}