import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Award, Zap, Target, Trophy } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../../common/LoadingSpinner';

export default function EngagementAnalytics() {
  // ✅ FIX: ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP
  // This fixes the React Hooks violation where hooks were called after early return
  
  // Fetch all necessary data
  const { data: userPoints, isLoading: loadingPoints } = useQuery({
    queryKey: ['analytics-user-points'],
    queryFn: () => base44.entities.UserPoints.list()
  });

  const { data: participations, isLoading: loadingParticipations } = useQuery({
    queryKey: ['analytics-participations'],
    queryFn: () => base44.entities.Participation.list()
  });

  const { data: badgeAwards, isLoading: loadingBadges } = useQuery({
    queryKey: ['analytics-badges'],
    queryFn: () => base44.entities.BadgeAward.list()
  });

  const { data: recognitions, isLoading: loadingRecognitions } = useQuery({
    queryKey: ['analytics-recognitions'],
    queryFn: () => base44.entities.Recognition.filter({ status: 'approved' })
  });

  const { data: challenges, isLoading: loadingChallenges } = useQuery({
    queryKey: ['analytics-challenges'],
    queryFn: () => base44.entities.PersonalChallenge.list()
  });

  // ✅ FIX: useMemo must be called unconditionally, even during loading
  // Calculate metrics
  const metrics = useMemo(() => {
    // Return empty metrics during loading
    if (loadingPoints || loadingParticipations || loadingBadges || loadingRecognitions || loadingChallenges) {
      return {
        totalUsers: 0,
        totalPoints: 0,
        avgPoints: 0,
        activeUsers: 0,
        engagementRate: '0',
        totalBadges: 0,
        avgBadges: '0',
        completedChallenges: 0,
        activeChallenges: 0,
        tierCounts: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
        topPerformers: [],
        pointsTimeline: [],
        tierDistribution: [],
        badgeDistribution: [],
        challengeCompletion: { completed: 0, in_progress: 0, not_started: 0 }
      };
    }

    const totalUsers = userPoints?.length || 0;
    const totalPoints = userPoints?.reduce((sum, p) => sum + (p.total_points || 0), 0) || 0;
    const avgPoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;
    
    const activeUsers = userPoints?.filter(p => (p.total_points || 0) > 0).length || 0;
    const engagementRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : '0';

    const totalBadges = badgeAwards?.length || 0;
    const avgBadges = totalUsers > 0 ? (totalBadges / totalUsers).toFixed(1) : '0';

    const completedChallenges = challenges?.filter(c => c.status === 'completed').length || 0;
    const activeChallenges = challenges?.filter(c => c.status === 'in_progress').length || 0;

    // Tier distribution
    const tierCounts = {
      bronze: userPoints?.filter(p => p.tier === 'bronze').length || 0,
      silver: userPoints?.filter(p => p.tier === 'silver').length || 0,
      gold: userPoints?.filter(p => p.tier === 'gold').length || 0,
      platinum: userPoints?.filter(p => p.tier === 'platinum').length || 0
    };

    // Top performers
    const topPerformers = [...(userPoints || [])]
      .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
      .slice(0, 10);

    // Points over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const pointsTimeline = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        points: 0,
        badges: 0
      };
    });

    // Tier distribution for chart
    const tierDistribution = [
      { tier: 'Bronze', count: tierCounts.bronze, color: '#CD7F32' },
      { tier: 'Silver', count: tierCounts.silver, color: '#C0C0C0' },
      { tier: 'Gold', count: tierCounts.gold, color: '#FFD700' },
      { tier: 'Platinum', count: tierCounts.platinum, color: '#E5E4E2' }
    ];

    // Badge distribution (top 5 badges)
    const badgeDistribution = Object.entries(
      (badgeAwards || []).reduce((acc, award) => {
        const badgeName = award.badge_name || 'Unknown';
        acc[badgeName] = (acc[badgeName] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Challenge completion stats
    const challengeCompletion = {
      completed: completedChallenges,
      in_progress: activeChallenges,
      not_started: (challenges?.length || 0) - completedChallenges - activeChallenges
    };

    return {
      totalUsers,
      totalPoints,
      avgPoints,
      activeUsers,
      engagementRate,
      totalBadges,
      avgBadges,
      completedChallenges,
      activeChallenges,
      tierCounts,
      topPerformers,
      pointsTimeline,
      tierDistribution,
      badgeDistribution,
      challengeCompletion
    };
  }, [userPoints, badgeAwards, participations, recognitions, challenges, loadingPoints, loadingParticipations, loadingBadges, loadingRecognitions, loadingChallenges]);

  // ✅ NOW SAFE: Early return AFTER all hooks
  if (loadingPoints || loadingParticipations || loadingBadges || loadingRecognitions || loadingChallenges) {
    return <LoadingSpinner />;
  }

  const COLORS = ['#F47C20', '#0A1C39', '#4A6070', '#F5C16A', '#C46322'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeUsers} active ({metrics.engagementRate}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {metrics.avgPoints} per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Awarded</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBadges}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {metrics.avgBadges} per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Challenges</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedChallenges}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeChallenges} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Tier Distribution</CardTitle>
            <CardDescription>Current tier breakdown of all users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.tierDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tier, count }) => `${tier}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {metrics.tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Most Awarded Badges</CardTitle>
            <CardDescription>Top 5 badges by award count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.badgeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F47C20" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Leaderboard of top 10 users by total points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.topPerformers.map((user, index) => (
              <div
                key={user.user_email}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    {index < 3 ? (
                      <Trophy className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.user_email}</p>
                    <p className="text-sm text-muted-foreground">Tier: {user.tier || 'Bronze'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{(user.total_points || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
