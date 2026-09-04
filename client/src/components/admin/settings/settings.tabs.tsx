'use client';

import { Button } from '@/components/ui/button';

interface SettingsTabsProps {
    activeTab: string;
    onChange: (tab: string) => void;
}

const tabs = [
    {
        id: 'general',
        label: 'General',
    },
    {
        id: 'seo',
        label: 'SEO',
    },
    {
        id: 'hero',
        label: 'Hero',
    },
    {
        id: 'contact',
        label: 'Contact',
    },
];

export function SettingsTabs({
                                 activeTab,
                                 onChange,
                             }: SettingsTabsProps) {
    return (
        <div className="flex min-w-0 flex-wrap gap-2">
            {tabs.map((tab) => (
                <Button
                    key={tab.id}
                    variant={
                        activeTab === tab.id
                            ? 'default'
                            : 'outline'
                    }
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    );
}