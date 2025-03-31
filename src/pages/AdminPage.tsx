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
// Removed Supabase client and UserProfile type as they are not needed here anymore

const AdminPage = () => {
  const { user, isAdmin, isLoading: authIsLoading } = useAuth(); // Use isAdmin and isLoading from context
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdminChecked, setIsAdminChecked] = useState(false); // Still useful to track if the check passed

  useEffect(() => {
    // Wait for auth context to finish loading
    if (authIsLoading) {
      return;
    }

    // Check if user is logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    // Use the isAdmin value directly from the context
    if (!isAdmin) {
      toast({
        title: 'Åtkomst nekad',
        description: 'Du har inte behörighet att komma åt admin-gränssnittet.',
        variant: 'destructive'
      });
      navigate('/home');
    } else {
      // User is confirmed admin by the context
      setIsAdminChecked(true);
    }
  }, [user, isAdmin, authIsLoading, navigate, toast]); // Depend on context values

  // Show loading spinner while auth context is loading
  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
      </div>
    );
  }

  // If the check determined the user is not admin, this prevents rendering the page briefly before redirect
  if (!isAdminChecked) {
    return null; // Or a "Checking permissions..." message
  }

  // Render the admin page content only if isAdminChecked is true
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