
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ReportedFlashcards } from '@/components/admin/ReportedFlashcards';
import { FlashcardCreation } from '@/components/admin/FlashcardCreation';
import { UserManagement } from '@/components/admin/UserManagement';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // If we already know the user is an admin from AuthContext
      if (isAdmin) {
        setIsAdminChecked(true);
        setIsLoading(false);
        return;
      }
      
      try {
        // Double-check admin status with direct database query
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking admin status:', error);
          throw error;
        }
        
        // Check if the user is admin or super_admin
        if (data && (data.is_admin === true || data.is_super_admin === 'yes')) {
          setIsAdminChecked(true);
        } else {
          toast({
            title: 'Åtkomst nekad',
            description: 'Du har inte behörighet att komma åt admin-gränssnittet.',
            variant: 'destructive'
          });
          navigate('/home');
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte verifiera admin-behörighet.',
          variant: 'destructive'
        });
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, toast, isAdmin]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
      </div>
    );
  }
  
  if (!isAdminChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        Kontrollerar behörighet...
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-8">Administratörsverktyg</h1>
      
      <Tabs defaultValue="reported" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reported">Rapporterade Flashcards</TabsTrigger>
          <TabsTrigger value="creation">Skapa Flashcards</TabsTrigger>
          <TabsTrigger value="users">Användarhantering</TabsTrigger>
          <TabsTrigger value="analytics">Analys</TabsTrigger>
        </TabsList>
        
        <Card className="mt-6 bg-card text-card-foreground">
          <CardContent className="pt-6">
            <TabsContent value="reported">
              <ReportedFlashcards />
            </TabsContent>
            
            <TabsContent value="creation">
              <FlashcardCreation />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AdminPage;
