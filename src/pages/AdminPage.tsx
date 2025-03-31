
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
  const { user, tier } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // Check if user is super admin (tier='super' is considered admin for now)
      // In a real application, you'd want to check a specific admin role
      if (tier === 'super') {
        setIsAdmin(true);
      } else {
        toast({
          title: 'Åtkomst nekad',
          description: 'Du har inte behörighet att komma åt admin-gränssnittet.',
          variant: 'destructive'
        });
        navigate('/home');
      }
    };
    
    checkAdminStatus();
  }, [user, tier, navigate, toast]);
  
  if (!isAdmin) {
    return <div className="flex items-center justify-center h-screen">Kontrollerar behörighet...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Administratörsverktyg</h1>
      
      <Tabs defaultValue="reported" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reported">Rapporterade Flashcards</TabsTrigger>
          <TabsTrigger value="creation">Skapa Flashcards</TabsTrigger>
          <TabsTrigger value="users">Användarhantering</TabsTrigger>
          <TabsTrigger value="analytics">Analys</TabsTrigger>
        </TabsList>
        
        <Card className="mt-6">
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
