import { SectionHeading } from '@/components/site/section-heading';
import { cn } from '@/lib/utils';
import {serverGetSettings} from "@/app/actions";

interface WorkStep {
  title: string;
  description: string;
}

const fallbackSteps: WorkStep[] = [
  { title: 'Discovery', description: 'We start with an in-depth discovery call to understand your goals.' },
  { title: 'Strategy', description: 'Every project begins with a bespoke pre-build strategy.' },
  { title: 'Design', description: 'Each page is designed, reviewed, and approved by you.' },
  { title: 'Build', description: 'We apply our trusted development process to bring it to life.' },
];

export async function WorkProcess() {
  const settings = await serverGetSettings('workProcess');
  const raw = settings?.data?.workProcess;
  const steps = Array.isArray(raw)
    ? raw.map((step) => ({
        title: String((step as Record<string, unknown>).title ?? ''),
        description: String((step as Record<string, unknown>).description ?? ''),
      }))
    : fallbackSteps;

  return (
    <section className="overflow-hidden bg-[#141414] py-12 text-white dark:bg-gray-900 lg:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Work Process"
          title="My Work Process"
          className="text-white dark:text-white"
        />
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className={cn(
                'rounded-md p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-8',
                index === 1 ? 'bg-[#C5FF41] text-black' : 'bg-white/[0.06] text-white',
              )}
            >
              <div className="mb-6 flex min-w-0 items-center justify-between gap-2">
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-sm font-medium sm:px-5 sm:text-lg',
                    index === 1 ? 'bg-black text-white' : 'bg-[#C5FFEE] text-black',
                  )}
                >
                  {step.title}
                </span>
                <span className="font-display shrink-0 text-3xl font-bold opacity-30 sm:text-4xl">0{index + 1}</span>
              </div>
              <p className="leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
