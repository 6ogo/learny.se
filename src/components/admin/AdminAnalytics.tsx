import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart as BarChartIcon, 
  Users, 
  BookOpen,
  Activity,
  Layers,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  LineChart as LineChartComp, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart as BarChartComp,
  Bar,
  PieChart as PieChartComp,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

export const AdminAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const [userMetrics, setUserMetrics] = useState({
    total: 0,
    premium: 0,
    super: 0,
    activeToday: 0,
    growthRate: 0
  });
  const [contentMetrics, setContentMetrics] = useState({
    totalFlashcards: 0,
    reportedFlashcards: 0,
    mostPopularCategory: '',
    categoriesDistribution: [] as { name: string; value: number }[]
  });
  const [activityData, setActivityData] = useState<{ date: string; users: number; flashcards: number }[]>([]);
  const [difficultyDistribution, setDifficultyDistribution] = useState<{ name: string; value: number }[]>([]);
  
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be separate database queries with proper aggregations
      
      // 1. Get user metrics
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (userError) throw userError;
      
      const premiumUsers = userData.filter(u => u.subscription_tier === 'premium').length;
      const superUsers = userData.filter(u => u.subscription_tier === 'super').length;
      const activeUsers = userData.filter(u => u.daily_usage > 0).length;
      
      setUserMetrics({
        total: userData.length,
        premium: premiumUsers,
        super: superUsers,
        activeToday: activeUsers,
        growthRate: 5.2 // Mocked growth rate
      });
      
      // 2. Get content metrics
      const { data: flashcardsData, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('*');
      
      if (flashcardsError) throw flashcardsError;
      
      // Make sure to use the snake_case field names from the database
      const reportedCount = flashcardsData.filter(f => (f as any).report_count && (f as any).report_count > 0).length;
      
      // Calculate category distribution
      const categoryCount: Record<string, number> = {};
      flashcardsData.forEach(card => {
        categoryCount[card.category] = (categoryCount[card.category] || 0) + 1;
      });
      
      // Find most popular category
      let mostPopularCategory = '';
      let maxCount = 0;
      
      const categoryDistribution = Object.entries(categoryCount)
        .map(([name, value]) => {
          if (value > maxCount) {
            maxCount = value;
            mostPopularCategory = name;
          }
          return { name, value };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // Top 6 categories
      
      setContentMetrics({
        totalFlashcards: flashcardsData.length,
        reportedFlashcards: reportedCount,
        mostPopularCategory,
        categoriesDistribution: categoryDistribution
      });
      
      // 3. Calculate difficulty distribution
      const diffCount: Record<string, number> = {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0
      };
      
      flashcardsData.forEach(card => {
        diffCount[card.difficulty] = (diffCount[card.difficulty] || 0) + 1;
      });
      
      setDifficultyDistribution(
        Object.entries(diffCount).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        }))
      );
      
      // 4. Generate activity data (mocked for now)
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const mockActivityData = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        
        mockActivityData.push({
          date: date.toISOString().split('T')[0],
          users: Math.floor(Math.random() * 50) + 10,
          flashcards: Math.floor(Math.random() * 100) + 20
        });
      }
      
      setActivityData(mockActivityData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte hämta analysdata',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analysverktyg</h2>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tidsperiod" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 dagar</SelectItem>
              <SelectItem value="30days">30 dagar</SelectItem>
              <SelectItem value="90days">90 dagar</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Key metrics cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totala användare</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.total}</div>
              <p className="text-xs text-muted-foreground">
                +{userMetrics.growthRate}% sedan förra perioden
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Betalande användare</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.premium + userMetrics.super}</div>
              <p className="text-xs text-muted-foreground">
                {((userMetrics.premium + userMetrics.super) / userMetrics.total * 100).toFixed(1)}% av alla användare
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totala flashcards</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentMetrics.totalFlashcards}</div>
              <p className="text-xs text-muted-foreground">
                {contentMetrics.reportedFlashcards} rapporterade ({(contentMetrics.reportedFlashcards / contentMetrics.totalFlashcards * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktiva användare idag</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.activeToday}</div>
              <p className="text-xs text-muted-foreground">
                {(userMetrics.activeToday / userMetrics.total * 100).toFixed(1)}% av alla användare
              </p>
            </CardContent>
          </Card>
          
          {/* Charts */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Användaraktivitet över tid</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChartComp
                  data={activityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={(label) => `Datum: ${label}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    name="Aktiva användare" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="flashcards" 
                    name="Flashcards studerade" 
                    stroke="#82ca9d" 
                  />
                </LineChartComp>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Fördelning per kategori</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChartComp
                  data={contentMetrics.categoriesDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Antal flashcards" fill="#8884d8" />
                </BarChartComp>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Prenumerationsfördelning</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChartComp>
                  <Pie
                    data={[
                      { name: 'Gratis', value: userMetrics.total - userMetrics.premium - userMetrics.super },
                      { name: 'Premium', value: userMetrics.premium },
                      { name: 'Super', value: userMetrics.super }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Gratis', value: userMetrics.total - userMetrics.premium - userMetrics.super },
                      { name: 'Premium', value: userMetrics.premium },
                      { name: 'Super', value: userMetrics.super }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChartComp>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Fördelning per svårighetsgrad</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChartComp>
                  <Pie
                    data={difficultyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChartComp>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
