
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Program } from '@/types/program';
import { ProgramCard } from '@/components/ProgramCard';
import { Loader2 } from 'lucide-react';

interface ModulesSectionProps {
  title: string;
  icon: React.ReactNode;
  modules: Program[];
  emptyMessage: string;
  isLoading?: boolean;
  groupByCategory?: boolean;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({ 
  title, 
  icon, 
  modules, 
  emptyMessage,
  isLoading = false,
  groupByCategory = true
}) => {
  // Group modules by category
  const groupedModules = useMemo(() => {
    if (!groupByCategory) return { "": modules };
    
    return modules.reduce<Record<string, Program[]>>((groups, module) => {
      const category = module.category || "Övrigt";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(module);
      return groups;
    }, {});
  }, [modules, groupByCategory]);
  
  // Sort categories alphabetically
  const sortedCategories = useMemo(() => {
    return Object.keys(groupedModules).sort();
  }, [groupedModules]);

  return (
    <section className="mb-10">
      <div className="flex items-center mb-4">
        <div className="mr-2">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {modules.length > 0 
              ? `${modules.length} moduler tillgängliga` 
              : emptyMessage
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Laddar moduler...</span>
            </div>
          ) : modules.length > 0 ? (
            groupByCategory ? (
              <div className="space-y-8">
                {sortedCategories.map(category => (
                  <div key={category} className="space-y-4">
                    {category && (
                      <h3 className="text-xl font-semibold">{category}</h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupedModules[category].map(module => (
                        <ProgramCard key={module.id} program={module} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {modules.map(module => (
                  <ProgramCard key={module.id} program={module} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
