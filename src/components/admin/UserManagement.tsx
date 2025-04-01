import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, ArrowUpDown, RefreshCw, UserCog, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { UserProfile } from '@/types/user';

type UserData = {
  id: string;
  email: string;
  created_at: string;
  subscription_tier: 'free' | 'premium' | 'super';
  daily_usage: number;
  last_sign_in?: string;
};

export const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'free' | 'premium' | 'super'>('free');
  const [sortField, setSortField] = useState<keyof UserData>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const USERS_PER_PAGE = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching user profiles from Supabase...');

      // Get user profiles from the user_profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        throw profilesError;
      }
      
      console.log(`Retrieved ${profilesData?.length || 0} user profiles`);
      
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) throw authError;
        
        const combinedUsers = authData.users.map((authUser) => {
          const profile = profilesData.find((p) => p.id === authUser.id);
          return {
            id: authUser.id,
            email: authUser.email || 'No email',
            created_at: authUser.created_at,
            last_sign_in: authUser.last_sign_in_at,
            subscription_tier: (profile?.subscription_tier || 'free') as 'free' | 'premium' | 'super',
            daily_usage: profile?.daily_usage || 0,
          };
        });
        
        setUsers(combinedUsers);
        setTotalPages(Math.ceil(combinedUsers.length / USERS_PER_PAGE));
      } catch (authError) {
        console.log('Using mock user data since auth.admin.listUsers requires admin privileges');
        
        // Generate mock emails for user profiles that don't have one
        const mockUsers: UserData[] = profilesData.map((profile: any) => {
          // Handle case where email might not exist on profile
          const generatedEmail = `user_${profile.id.substring(0, 6)}@example.com`;
          
          return {
            id: profile.id,
            // Use profile.email if it exists, otherwise use generated email
            email: profile.email || generatedEmail,
            created_at: profile.created_at,
            subscription_tier: profile.subscription_tier as 'free' | 'premium' | 'super',
            daily_usage: profile.daily_usage,
            last_sign_in: profile.updated_at,
          };
        });
        
        setUsers(mockUsers);
        setTotalPages(Math.ceil(mockUsers.length / USERS_PER_PAGE));
      }

    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte hämta användare',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (field: keyof UserData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleUserEdit = (user: UserData) => {
    setSelectedUser(user);
    setSelectedTier(user.subscription_tier);
    setIsUserDialogOpen(true);
  };

  const handleSaveUserEdit = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ subscription_tier: selectedTier })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...user, subscription_tier: selectedTier }
          : user
      ));

      toast({
        title: 'Uppdaterad',
        description: `Användarens prenumerationsnivå ändrad till ${selectedTier}`
      });

      setIsUserDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera användaren',
        variant: 'destructive'
      });
    }
  };

  const handleSendEmail = (user: UserData) => {
    toast({
      title: 'E-post funktion',
      description: `Skulle skicka ett e-postmeddelande till ${user.email}`
    });
  };

  // Apply sorting and filtering
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase());
      const matchesSubscription = subscriptionFilter && subscriptionFilter !== 'all'
        ? user.subscription_tier === subscriptionFilter
        : true;
      return matchesSearch && matchesSubscription;
    })
    .sort((a, b) => {
      if (sortField === 'created_at' || sortField === 'last_sign_in') {
        const dateA = new Date(a[sortField] || 0).getTime();
        const dateB = new Date(b[sortField] || 0).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Numbers
      if (typeof a[sortField] === 'number') {
        return sortDirection === 'asc'
          ? (a[sortField] as number) - (b[sortField] as number)
          : (b[sortField] as number) - (a[sortField] as number);
      }

      // Strings
      const valA = String(a[sortField] || '');
      const valB = String(b[sortField] || '');
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  // Paginate
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Användarhantering</h2>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Uppdatera
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Sök på e-post..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prenumerationsnivå" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla nivåer</SelectItem>
            <SelectItem value="free">Gratis</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="super">Super</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : paginatedUsers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      E-post
                      {sortField === 'email' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('subscription_tier')}>
                    <div className="flex items-center">
                      Prenumeration
                      {sortField === 'subscription_tier' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('daily_usage')}>
                    <div className="flex items-center">
                      Daglig användning
                      {sortField === 'daily_usage' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center">
                      Registrerad
                      {sortField === 'created_at' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('last_sign_in')}>
                    <div className="flex items-center">
                      Senast inloggad
                      {sortField === 'last_sign_in' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={
                        user.subscription_tier === 'super' 
                          ? "bg-primary text-primary-foreground" 
                          : user.subscription_tier === 'premium' 
                            ? "bg-secondary text-secondary-foreground" 
                            : "bg-transparent border border-input text-foreground"
                      }>
                        {user.subscription_tier === 'free' && 'Gratis'}
                        {user.subscription_tier === 'premium' && 'Premium'}
                        {user.subscription_tier === 'super' && 'Super'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.daily_usage}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.last_sign_in
                        ? new Date(user.last_sign_in).toLocaleDateString()
                        : 'Aldrig'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserEdit(user)}
                          title="Hantera användare"
                        >
                          <UserCog className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendEmail(user)}
                          title="Skicka e-post"
                        >
                          <Mail className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Inga användare hittades</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  size="icon"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}

      {/* User Edit Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hantera användare</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="mb-4">
                <User className="h-16 w-16 mx-auto mb-2 text-primary" />
                <p className="text-center font-medium">{selectedUser.email}</p>
                <p className="text-center text-sm text-muted-foreground">
                  Användare sedan {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prenumerationsnivå</label>
                  <Select value={selectedTier} onValueChange={(value: any) => setSelectedTier(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Gratis</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="super">Super</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Användarstatistik</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Daglig användning:</div>
                    <div>{selectedUser.daily_usage}</div>
                    <div>Senast inloggad:</div>
                    <div>
                      {selectedUser.last_sign_in
                        ? new Date(selectedUser.last_sign_in).toLocaleDateString()
                        : 'Aldrig'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Avbryt</Button>
            <Button onClick={handleSaveUserEdit}>Spara ändringar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
