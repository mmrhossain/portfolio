"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

interface SkillCardProps {
  name: string;
  description: string;
  iconUrl: string;
  proficiency: number;
}

function SkillCard({
  name,
  description,
  iconUrl,
  proficiency,
}: SkillCardProps) {
  return (
    <div className="group flex w-[220px] shrink-0 flex-col gap-3 rounded-md border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg sm:w-[260px] sm:p-6">
      <div className="flex items-center justify-between">
        <Image
          src={iconUrl}
          alt={name}
          width={40}
          height={40}
          className="rounded-xl bg-muted p-1.5 object-contain"
        />

        <span className="text-xs font-semibold text-muted-foreground">
          {proficiency}%
        </span>
      </div>

      <h3 className="font-display text-xl font-bold">{name}</h3>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

interface SkillsMarqueeProps {
  skills: Skill[];
}

export function SkillsMarquee({ skills }: SkillsMarqueeProps) {
  if (skills.length === 0) {
    return (
      <section className="overflow-hidden bg-black py-12 text-white dark:bg-gray-900 lg:py-20">
        <div className="container-page">
          <div className="text-center text-gray-400">
            Skills could not be loaded right now.
          </div>
        </div>
      </section>
    );
  }

  const duplicatedSkills = [...skills, ...skills];
  const duration = Math.max(24, skills.length * 4);

  return (
    <section className="overflow-hidden bg-black py-12 text-white dark:bg-gray-900 lg:py-20">
      <div className="container-page">
        <div className="mb-8 min-w-0 space-y-3 sm:mb-12 sm:space-y-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
            <span className="h-px w-8 bg-accent" />
            Why Choose Me
          </span>

          <h2 className="break-words text-3xl font-bold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
            My Extensive List of Skills
          </h2>

          <p className="max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Building modern web applications with a focus on performance,
            scalability, user experience, and clean architecture.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Left Fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent sm:w-24" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent sm:w-24" />

        <div
          className={cn("flex gap-4 px-4 hover:[animation-play-state:paused] sm:gap-5 sm:px-6")}
          style={{
            animation: `scroll ${duration}s linear infinite`,
            width: "max-content",
          }}
        >
          {duplicatedSkills.map((skill, index) => (
            <SkillCard
              key={`${skill.id}-${index}`}
              name={skill.name}
              description={skill.description}
              iconUrl={skill.iconUrl}
              proficiency={skill.proficiency}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
