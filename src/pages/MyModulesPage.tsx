
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ModulesSection } from '@/components/ModulesSection';
import { Program } from '@/types/program';
import { Library, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MyModulesPage = () => {
  const { user } = useAuth();
  const { fetchUserModules } = useLocalStorage();
  const [userModules, setUserModules] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserModules = useCallback(async () => {
    if (!user) {
      setUserModules([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const modules = await fetchUserModules();
      // Filter to only show modules created by the current user
      const filteredModules = modules.filter(mod => mod.user_id === user.id);
      setUserModules(filteredModules);
    } catch (err: any) {
      console.error('Failed to load user modules:', err);
      setError(err.message || 'Failed to load your modules');
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchUserModules]);

  useEffect(() => {
    loadUserModules();
  }, [loadUserModules]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Laddar dina moduler...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-8 border-l-4 border-destructive">
        <CardHeader><CardTitle>Fel</CardTitle></CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button className="mt-4" onClick={loadUserModules}>Försök igen</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mina Moduler</h1>
      
      {userModules.length > 0 ? (
        <ModulesSection 
          title="Dina skapade moduler" 
          icon={<Library className="h-6 w-6" />} 
          modules={userModules} 
          emptyMessage="Du har inte skapat några egna moduler än."
          isLoading={false}
          groupByCategory={true}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Inga moduler hittades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Du har inte skapat några egna moduler ännu. Skapa din första modul nu!</p>
            <Button asChild>
              <Link to="/create" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Skapa nya flashcards
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyModulesPage;
