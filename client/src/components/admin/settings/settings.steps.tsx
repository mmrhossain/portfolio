'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Step {
    title: string;
    description: string;
}

interface SettingsStepsProps {
    steps: Step[];
    onChange: (steps: Step[]) => void;
}

export function SettingsSteps({
                                  steps,
                                  onChange,
                              }: SettingsStepsProps) {
    const addStep = () => {
        onChange([
            ...steps,
            {
                title: '',
                description: '',
            },
        ]);
    };

    const removeStep = (
        index: number,
    ) => {
        onChange(
            steps.filter(
                (_, i) => i !== index,
            ),
        );
    };

    const updateStep = (
        index: number,
        field: keyof Step,
        value: string,
    ) => {
        const next = [...steps];

        next[index] = {
            ...next[index],
            [field]: value,
        };

        onChange(next);
    };

    return (
        <div className="min-w-0 space-y-4">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className="min-w-0 space-y-2 rounded-lg border p-4"
                >
                    <Input
                        value={step.title}
                        placeholder="Title"
                        onChange={(e) =>
                            updateStep(
                                index,
                                'title',
                                e.target.value,
                            )
                        }
                    />

                    <Input
                        value={step.description}
                        placeholder="Description"
                        onChange={(e) =>
                            updateStep(
                                index,
                                'description',
                                e.target.value,
                            )
                        }
                    />

                    <Button
                        variant="destructive"
                        onClick={() =>
                            removeStep(index)
                        }
                    >
                        Remove
                    </Button>
                </div>
            ))}

            <Button
                variant="outline"
                onClick={addStep}
            >
                Add Step
            </Button>
        </div>
    );
}