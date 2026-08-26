import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Award, Zap, Target, Trophy } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '../../common/LoadingSpinner';

// ── Constants ─────────────────────────────────────────────────────────────────

const TIER_COLORS = {
  bronze:   '#CD7F32',
  silver:   '#C0C0C0',
  gold:     '#FFD700',
  platinum: '#E5E4E2',
};

const CHART_COLORS = ['#F47C20', '#0A1C39', '#4A6070', '#F5C16A', '#C46322'];

// ── Data hooks ────────────────────────────────────────────────────────────────

function useAnalyticsData() {
  const { data: userPoints,    isLoading: loadingPoints }        = useQuery({ queryKey: ['analytics-user-points'],    queryFn: () => base44.entities.UserPoints.list() });
  const { data: participations, isLoading: loadingParticipations } = useQuery({ queryKey: ['analytics-participations'], queryFn: () => base44.entities.Participation.list() });
  const { data: badgeAwards,   isLoading: loadingBadges }        = useQuery({ queryKey: ['analytics-badges'],         queryFn: () => base44.entities.BadgeAward.list() });
  const { data: recognitions,  isLoading: loadingRecognitions }  = useQuery({ queryKey: ['analytics-recognitions'],   queryFn: () => base44.entities.Recognition.filter({ status: 'approved' }) });
  const { data: challenges,    isLoading: loadingChallenges }    = useQuery({ queryKey: ['analytics-challenges'],     queryFn: () => base44.entities.PersonalChallenge.list() });

  const isLoading = loadingPoints || loadingParticipations || loadingBadges || loadingRecognitions || loadingChallenges;

  return { userPoints, participations, badgeAwards, recognitions, challenges, isLoading };
}

// ── Metrics computation ───────────────────────────────────────────────────────

function useMetrics({ userPoints, badgeAwards, challenges, isLoading }) {
  return useMemo(() => {
    if (isLoading || !userPoints) {
      return null;
    }

    const totalUsers  = userPoints.length;
    const totalPoints = userPoints.reduce((sum, p) => sum + (p.total_points ?? 0), 0);
    const avgPoints   = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;
    const activeUsers = userPoints.filter(p => (p.total_points ?? 0) > 0).length;
    const engagementRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : '0';

    const totalBadges = badgeAwards?.length ?? 0;
    const avgBadges   = totalUsers > 0 ? (totalBadges / totalUsers).toFixed(1) : '0';

    const completedChallenges = challenges?.filter(c => c.status === 'completed').length ?? 0;
    const activeChallenges    = challenges?.filter(c => c.status === 'in_progress').length ?? 0;

    // Tier counts + distribution
    const tierCounts = ['bronze', 'silver', 'gold', 'platinum'].reduce((acc, tier) => {
      acc[tier] = userPoints.filter(p => p.tier === tier).length;
      return acc;
    }, {});

    const tierDistribution = Object.entries(tierCounts).map(([tier, count]) => ({
      tier: tier.charAt(0).toUpperCase() + tier.slice(1),
      count,
      color: TIER_COLORS[tier],
    }));

    // Top performers
    const topPerformers = [...userPoints]
      .sort((a, b) => (b.total_points ?? 0) - (a.total_points ?? 0))
      .slice(0, 10);

    // Badge frequency
    const badgeFrequency = badgeAwards?.reduce((acc, award) => {
      const name = award.badge_name ?? 'Unknown';
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

    const badgeDistribution = Object.entries(badgeFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      totalUsers, totalPoints, avgPoints,
      activeUsers, engagementRate,
      totalBadges, avgBadges,
      completedChallenges, activeChallenges,
      tierDistribution, topPerformers, badgeDistribution,
    };
  }, [userPoints, badgeAwards, challenges, isLoading]);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, primary, secondary }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{primary}</div>
        {secondary && <p className="text-xs text-muted-foreground">{secondary}</p>}
      </CardContent>
    </Card>
  );
}

function TierChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Tier Distribution</CardTitle>
        <CardDescription>Current tier breakdown of all users</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ tier, count }) => `${tier}: ${count}`}
              outerRadius={80}
              dataKey="count"
            >
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function BadgeChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Awarded Badges</CardTitle>
        <CardDescription>Top 5 badges by award count</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={CHART_COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function PerformerRow({ user, index }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
          {index < 3
            ? <Trophy className="h-4 w-4 text-primary" />
            : <span className="text-sm font-bold text-primary">#{index + 1}</span>}
        </div>
        <div>
          <p className="font-medium">{user.user_email}</p>
          <p className="text-sm text-muted-foreground">Tier: {user.tier ?? 'Bronze'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">{(user.total_points ?? 0).toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">points</p>
      </div>
    </div>
  );
}

function TopPerformers({ performers }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Leaderboard of top 10 users by total points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {performers.map((user, i) => (
            <PerformerRow key={user.user_email} user={user} index={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EngagementAnalytics() {
  // All hooks called unconditionally at top level
  const data    = useAnalyticsData();
  const metrics = useMetrics(data);

  // Safe early return — after all hooks
  if (data.isLoading || !metrics) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          primary={metrics.totalUsers}
          secondary={`${metrics.activeUsers} active (${metrics.engagementRate}%)`}
        />
        <StatCard
          icon={Zap}
          label="Total Points"
          primary={metrics.totalPoints.toLocaleString()}
          secondary={`Avg: ${metrics.avgPoints} per user`}
        />
        <StatCard
          icon={Award}
          label="Badges Awarded"
          primary={metrics.totalBadges}
          secondary={`Avg: ${metrics.avgBadges} per user`}
        />
        <StatCard
          icon={Target}
          label="Challenges"
          primary={metrics.completedChallenges}
          secondary={`${metrics.activeChallenges} in progress`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TierChart data={metrics.tierDistribution} />
        <BadgeChart data={metrics.badgeDistribution} />
      </div>

      {/* Top Performers */}
      <TopPerformers performers={metrics.topPerformers} />
    </div>
  );
}
