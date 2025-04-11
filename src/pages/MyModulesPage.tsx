
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ModulesSection } from '@/components/ModulesSection';
import { Program } from '@/types/program';
import { Library, Plus, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const MyModulesPage = () => {
  const { user } = useAuth();
  const { fetchUserModules } = useLocalStorage();
  const [userModules, setUserModules] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);

  const loadUserModules = useCallback(async () => {
    if (!user) {
      setUserModules([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Start progress animation
    setLoadProgress(10);
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev < 90) return prev + 10;
        return prev;
      });
    }, 300);
    
    try {
      const modules = await fetchUserModules();
      console.log(`Fetched ${modules.length} user modules`);
      
      // Filter to only show modules created by the current user
      const filteredModules = modules.filter(mod => mod.user_id === user.id);
      setUserModules(filteredModules);
      setLoadAttempts(0); // Reset attempts counter on success
    } catch (err: any) {
      console.error('Failed to load user modules:', err);
      setError(err.message || 'Failed to load your modules');
      setLoadAttempts(prev => prev + 1);
    } finally {
      clearInterval(progressInterval);
      setLoadProgress(100);
      
      // Short delay before hiding loading indicator
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [user, fetchUserModules]);

  useEffect(() => {
    // Prevent excessive retries
    if (loadAttempts < 3) {
      loadUserModules();
    }
  }, [loadUserModules, loadAttempts]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Laddar dina moduler...</span>
            <span>{Math.round(loadProgress)}%</span>
          </div>
          <Progress value={loadProgress} className="h-2" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-8 border-l-4 border-destructive">
        <CardHeader><CardTitle>Fel</CardTitle></CardHeader>
        <CardContent>
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadUserModules}>
            <RefreshCcw className="h-4 w-4 mr-2" /> 
            Försök igen
          </Button>
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
            <CardTitle>Inga skapade moduler</CardTitle>
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
