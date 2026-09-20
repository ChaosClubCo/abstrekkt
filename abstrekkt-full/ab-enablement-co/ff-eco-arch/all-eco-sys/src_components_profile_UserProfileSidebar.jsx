import { useState, useEffect } from 'react';
import { X, Trophy, Target, Activity, TrendingUp, Award, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import BadgeCard from './BadgeCard';
import AchievementCard from './AchievementCard';
import ProgressRing from './ProgressRing';

export default function UserProfileSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?. id && isOpen,
  });

  const { data: recentActivities } = useQuery({
    queryKey: ['recentActivities', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/activities? limit=5`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
    enabled:  !!user?.id && isOpen,
  });

  // Calculate level progress
  const calculateLevelProgress = () => {
    if (!userProfile) return 0;
    const xpForNextLevel = userProfile.level * 1000;
    const currentLevelXP = userProfile.experiencePoints % 1000;
    return (currentLevelXP / xpForNextLevel) * 100;
  };

  if (! isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      data-b44-sync="true"
    >
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-gray-900",
          "shadow-2xl transform transition-transform duration-300 ease-out",
          "flex flex-col"
        )}
        onClick={(e) => e.stopPropagation()}
        data-b44-sync="true"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <img
              src={userProfile?.avatar || '/avatars/default.png'}
              alt={userProfile?.name}
              className="w-14 h-14 rounded-full ring-4 ring-blue-500/20"
              data-b44-sync="true"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white" data-b44-sync="true">
                {userProfile?.name || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400" data-b44-sync="true">
                {userProfile?. department || 'Team Member'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            data-b44-sync="true"
          >
            <X className="w-5 h-5" />
          </Button>
        </header>

        {/* Tabs */}
        <nav className="flex gap-2 px-6 pt-4 border-b border-gray-200 dark:border-gray-800" data-b44-sync="true">
          {['overview', 'badges', 'achievements']. map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
                "capitalize",
                activeTab === tab
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              data-b44-sync="true"
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 py-6" data-b44-sync="true">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6" data-b44-sync="true">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      icon={Trophy}
                      label="Total Points"
                      value={userProfile?.points?. toLocaleString() || '0'}
                      color="text-yellow-600"
                      bgColor="bg-yellow-50 dark:bg-yellow-900/20"
                    />
                    <StatCard
                      icon={Target}
                      label="Level"
                      value={userProfile?.level || '1'}
                      color="text-blue-600"
                      bgColor="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <StatCard
                      icon={Activity}
                      label="Activities"
                      value={userProfile?.activitiesCompleted || '0'}
                      color="text-green-600"
                      bgColor="bg-green-50 dark:bg-green-900/20"
                    />
                    <StatCard
                      icon={TrendingUp}
                      label="Streak"
                      value={`${userProfile?.streak || '0'} days`}
                      color="text-purple-600"
                      bgColor="bg-purple-50 dark:bg-purple-900/20"
                    />
                  </div>

                  {/* Level Progress */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6" data-b44-sync="true">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Level Progress
                      </h3>
                      <Badge variant="secondary" className="font-bold" data-b44-sync="true">
                        Level {userProfile?.level || 1}
                      </Badge>
                    </div>
                    <ProgressRing
                      progress={calculateLevelProgress()}
                      size={120}
                      strokeWidth={12}
                    />
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                      {Math.floor(calculateLevelProgress())}% to Level {(userProfile?.level || 1) + 1}
                    </p>
                  </div>

                  {/* Recent Activities */}
                  <div data-b44-sync="true">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Recent Activities
                    </h3>
                    <div className="space-y-2">
                      {recentActivities?.length > 0 ? (
                        recentActivities.map((activity) => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark: text-gray-400 text-center py-8">
                          No recent activities
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'badges' && (
                <div className="space-y-4" data-b44-sync="true">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Badges
                    </h3>
                    <Badge variant="outline" data-b44-sync="true">
                      {userProfile?.badges?.length || 0} Earned
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {userProfile?.badges?.map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </div>
                  {(! userProfile?.badges || userProfile. badges.length === 0) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">
                      Complete activities to earn badges! 
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4" data-b44-sync="true">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Achievements
                    </h3>
                    <Badge variant="outline" data-b44-sync="true">
                      {userProfile?.achievements?.filter(a => a.completed).length || 0} / {userProfile?.achievements?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {userProfile?.achievements?.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                  {(! userProfile?.achievements || userProfile. achievements.length === 0) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">
                      No achievements yet.  Keep going!
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </aside>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className={cn("rounded-xl p-4", bgColor)} data-b44-sync="true">
      <div className="flex items-center justify-between mb-2">
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white" data-b44-sync="true">
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400" data-b44-sync="true">
        {label}
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors" data-b44-sync="true">
      <div className={cn(
        "w-2 h-2 rounded-full",
        activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
      )} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {activity.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(activity.createdAt).toLocaleDateString()}
        </p>
      </div>
      <Badge variant="secondary" className="text-xs" data-b44-sync="true">
        +{activity.pointsReward} pts
      </Badge>
    </div>
  );
}