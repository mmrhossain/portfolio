import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Code2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] lg:min-h-[80vh] 2xl:min-h-screen flex items-center py-12 2xl:py-0">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30">
        <Image
          src="/images/bg/bg-gradiant1.svg"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="container-page mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Content (Code Snippet & CTAs) */}
          <div className="w-full min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Live Status */}
            <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-green-600 backdrop-blur dark:text-green-400">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span>Available for new projects</span>
            </div>

            {/* Code Editor */}
            <div className="w-full overflow-hidden rounded-xl border border-border/70 bg-background/80 shadow-2xl backdrop-blur-xl">
              {/* Editor Header */}
              <div className="flex h-10 sm:h-11 items-center justify-between border-b border-border/60 bg-muted/50 px-3 sm:px-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400/80" />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>developer.ts</span>
                </div>

                <div className="w-10 sm:w-12" />
              </div>

              {/* Code Content */}
              <div className="w-full overflow-x-auto p-3.5 sm:p-5 font-mono text-[11px] sm:text-[13px] leading-6 sm:leading-7">
                <div className="inline-block min-w-full">
                  <div>
                    <span className="text-muted-foreground">01</span>
                    <span className="ml-3 sm:ml-5 text-purple-500 dark:text-purple-400">
                      const
                    </span>{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      developer
                    </span>{" "}
                    = {"{"}
                  </div>

                  <div>
                    <span className="text-muted-foreground">02</span>
                    <span className="ml-3 sm:ml-5 text-muted-foreground">
                      name:
                    </span>{" "}
                    <span className="text-green-600 dark:text-green-400">
                      "Monir Hossain"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="text-muted-foreground">03</span>
                    <span className="ml-3 sm:ml-5 text-muted-foreground">
                      role:
                    </span>{" "}
                    <span className="text-green-600 dark:text-green-400">
                      "Full Stack Web Developer"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="text-muted-foreground">04</span>
                    <span className="ml-3 sm:ml-5 text-muted-foreground">
                      stack:
                    </span>{" "}
                    {"["}
                  </div>

                  <div>
                    <span className="text-muted-foreground">05</span>
                    <span className="ml-6 sm:ml-10 text-green-600 dark:text-green-400">
                      "Next.js"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="text-muted-foreground">06</span>
                    <span className="ml-6 sm:ml-10 text-green-600 dark:text-green-400">
                      "React"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="text-muted-foreground">07</span>
                    <span className="ml-6 sm:ml-10 text-green-600 dark:text-green-400">
                      "Express.js"
                    </span>
                    ,
                  </div>

                  <div>
                    <span className="text-muted-foreground">08</span>
                    <span className="ml-6 sm:ml-10 text-green-600 dark:text-green-400">
                      "PostgreSQL"
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">09</span>
                    <span className="ml-3 sm:ml-5">],</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">10</span>
                    <span className="ml-3 sm:ml-5 text-muted-foreground">
                      focus:
                    </span>{" "}
                    <span className="text-green-600 dark:text-green-400">
                      "Clean & Scalable Apps"
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">11</span>
                    {"};"}
                  </div>
                </div>
              </div>

              {/* Editor Footer */}
              <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs text-muted-foreground">
                <span>TypeScript</span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Ready to build</span>
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/projects">
                  <span>Show My Work</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/contact">Let's Talk</Link>
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex w-full justify-center lg:justify-end">
            <div className="relative w-full sm:max-w-[380px] lg:max-w-[440px] xl:max-w-[500px]">
              {/* Animated Glow */}
              <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-teal-400/30 via-cyan-400/20 to-lime-400/30 blur-3xl" />

              {/* Floating Image */}
              <div className="mx-auto w-full animate-[float_6s_ease-in-out_infinite]">
                <Image
                  src="/images/default/portfolio.webp"
                  alt="Monir Hossain"
                  width={520}
                  height={520}
                  priority
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 500px"
                  className="aspect-square h-auto w-full rounded-sm border border-border/50 object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
