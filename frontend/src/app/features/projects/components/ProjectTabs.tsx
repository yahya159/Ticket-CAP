import React from 'react';

export interface ProjectTabDefinition<TTabKey extends string> {
  key: TTabKey;
  label: string;
  icon?: React.ReactNode;
}

interface ProjectTabsProps<TTabKey extends string> {
  tabs: Array<ProjectTabDefinition<TTabKey>>;
  activeTab: TTabKey;
  onTabChange: (tab: TTabKey) => void;
  onTabKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>, tab: TTabKey) => void;
}

export const ProjectTabs = <TTabKey extends string>({
  tabs,
  activeTab,
  onTabChange,
  onTabKeyDown,
}: ProjectTabsProps<TTabKey>) => {
  return (
    <div className="overflow-visible md:overflow-x-auto">
      <div
        role="tablist"
        aria-label="Project detail sections"
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:min-w-max"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`project-tab-${tab.key}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`project-panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(event) => onTabKeyDown(event, tab.key)}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center justify-center gap-1.5 rounded border px-4 py-2 text-sm whitespace-nowrap ${
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-accent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
