---
name: mobile-development
description: iOS and Android mobile development workflows including React Native, Flutter, and native development patterns. Use when building mobile applications, selecting cross-platform vs native approaches, implementing mobile-specific features, or optimizing mobile app performance and user experience.
---

# Mobile Development

## Overview

Mobile development presents unique challenges distinct from web development: limited resources, diverse device capabilities, platform-specific guidelines, and user expectations shaped by native app experiences. This skill provides frameworks for making strategic platform decisions and implementing mobile applications that meet both user expectations and business requirements.

The cross-platform vs native decision significantly impacts development velocity, maintenance burden, and user experience quality. React Native and Flutter have matured to handle most use cases, but understanding when native development is necessary remains crucial. This skill helps navigate these decisions with clarity.

Beyond platform selection, mobile development requires deep understanding of offline-first architecture, efficient state management, platform-specific UI patterns, and performance optimization techniques unique to resource-constrained environments.

### Why This Matters
- Mobile apps represent 70%+ of digital time for most consumer applications
- Poor mobile performance directly impacts user retention and app store ratings
- Platform choice affects time-to-market by 40-60% and long-term maintenance costs
- Native-quality experiences are increasingly expected regardless of underlying technology

## When to Use

### Primary Triggers
- Starting a new mobile application project
- Deciding between React Native, Flutter, or native development
- Implementing platform-specific features (camera, GPS, notifications)
- Optimizing mobile app performance and battery usage
- Submitting apps to App Store or Google Play

### Specific Use Cases
- "Should we use React Native or Flutter for our fintech app?"
- "Implement offline-first sync for our field service application"
- "Set up push notifications for iOS and Android"
- "Optimize our app's startup time and reduce bundle size"
- "Prepare our app for App Store submission with all required assets"

## Core Processes

### 1. Platform Selection Framework

**Decision Matrix**

| Factor | React Native | Flutter | Native (Swift/Kotlin) |
|--------|-------------|---------|----------------------|
| Team Skills | JavaScript/React devs | Any (Dart is learnable) | iOS/Android specialists |
| UI Fidelity | High (with effort) | Very High | Perfect |
| Performance | Good (95% use cases) | Excellent | Best |
| Code Sharing | 80-95% | 90-98% | 0% (separate codebases) |
| Native API Access | Via bridges | Via channels | Direct |
| Time to Market | Fast | Fast | Slower |
| Maintenance | Single codebase | Single codebase | Double effort |

**Selection Decision Tree**

```
Heavy native feature usage (AR, complex animations, games)?
├── Yes → Native development
└── No → Team knows JavaScript/React?
    ├── Yes → Performance critical with complex UI?
    │   ├── Yes → Flutter (or React Native with care)
    │   └── No → React Native
    └── No → Flutter
```

**When to Choose Native**
- Games or graphics-intensive applications
- Heavy AR/VR requirements
- Complex audio/video processing
- Deep hardware integration
- Maximum performance is non-negotiable
- Platform-specific features are core to the product

### 2. React Native Project Setup

**Project Structure**

```
src/
├── api/                    # API client and queries
│   ├── client.ts
│   └── hooks/
├── components/
│   ├── ui/                 # Base components
│   └── features/           # Feature components
├── navigation/
│   ├── RootNavigator.tsx
│   ├── AuthStack.tsx
│   └── MainTabs.tsx
├── screens/
│   ├── auth/
│   ├── home/
│   └── profile/
├── stores/                 # State management
├── hooks/                  # Custom hooks
├── utils/                  # Utilities
├── constants/              # App constants
└── types/                  # TypeScript types
```

**Essential Dependencies**

```json
{
  "dependencies": {
    "react-native": "0.73.x",
    "@react-navigation/native": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    "react-native-mmkv": "^2.x",
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x"
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.x",
    "detox": "^20.x"
  }
}
```

**Navigation Setup**

```typescript
// navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/stores/auth';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. Flutter Project Setup

**Project Structure**

```
lib/
├── main.dart
├── app/
│   ├── app.dart            # MaterialApp configuration
│   └── routes.dart         # Route definitions
├── core/
│   ├── constants/
│   ├── theme/
│   └── utils/
├── data/
│   ├── models/
│   ├── repositories/
│   └── providers/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   └── home/
└── shared/
    ├── widgets/
    └── services/
```

**State Management with Riverpod**

```dart
// features/auth/data/auth_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authRepositoryProvider));
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(const AuthState.initial());

  Future<void> signIn(String email, String password) async {
    state = const AuthState.loading();
    try {
      final user = await _repository.signIn(email, password);
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
}
```

### 4. Offline-First Architecture

**Sync Strategy Pattern**

```typescript
// React Native offline sync
import NetInfo from '@react-native-community/netinfo';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: unknown;
  timestamp: number;
}

class OfflineSyncManager {
  private pendingOperations: SyncOperation[] = [];

  constructor() {
    this.loadPendingOperations();
    this.setupNetworkListener();
  }

  private loadPendingOperations() {
    const stored = storage.getString('pendingOperations');
    if (stored) {
      this.pendingOperations = JSON.parse(stored);
    }
  }

  private savePendingOperations() {
    storage.set('pendingOperations', JSON.stringify(this.pendingOperations));
  }

  async queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp'>) {
    const op: SyncOperation = {
      ...operation,
      id: generateId(),
      timestamp: Date.now(),
    };
    this.pendingOperations.push(op);
    this.savePendingOperations();
    await this.attemptSync();
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.attemptSync();
      }
    });
  }

  async attemptSync() {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    const operations = [...this.pendingOperations];
    for (const op of operations) {
      try {
        await this.executeOperation(op);
        this.pendingOperations = this.pendingOperations.filter(o => o.id !== op.id);
        this.savePendingOperations();
      } catch (error) {
        console.error('Sync failed for operation:', op.id);
        break; // Stop on first failure to maintain order
      }
    }
  }
}
```

### 5. Push Notifications Setup

**React Native Push Notifications**

```typescript
// services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export async function requestNotificationPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
         authStatus === messaging.AuthorizationStatus.PROVISIONAL;
}

export async function getDeviceToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}

export async function setupNotificationChannels() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Notifications',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createChannel({
    id: 'orders',
    name: 'Order Updates',
    importance: AndroidImportance.HIGH,
    sound: 'order_notification',
  });
}

export function setupMessageHandlers() {
  // Foreground messages
  messaging().onMessage(async remoteMessage => {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: remoteMessage.data?.channel || 'default',
        pressAction: { id: 'default' },
      },
    });
  });

  // Background message handler (in index.js)
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message:', remoteMessage);
  });
}
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Expo | Rapid RN development | Free-$99/mo | Managed workflow, OTA updates |
| Flipper | RN debugging | Free | Network, layout, performance |
| Firebase | Backend services | Free tier | Auth, Firestore, Analytics |
| RevenueCat | In-app purchases | % of revenue | Cross-platform subscriptions |
| Sentry | Error tracking | Free tier | Crash reports, performance |
| Fastlane | CI/CD automation | Free | Build, test, deploy automation |

### App Store Submission Checklist

**iOS Requirements**
- [ ] App icons (1024x1024 for App Store, plus device sizes)
- [ ] Screenshots for all required device sizes
- [ ] Privacy policy URL
- [ ] App Store description and keywords
- [ ] Age rating questionnaire completed
- [ ] In-app purchases configured (if applicable)
- [ ] App Review information filled out

**Android Requirements**
- [ ] App icon (512x512 for Play Store)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots for phone and tablet
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target API level compliance
- [ ] App signing configured

## Metrics & KPIs

### Performance Metrics
- **App Startup Time**: Cold start < 2s, warm start < 1s
- **Frame Rate**: Maintain 60fps, no drops below 30fps
- **Memory Usage**: Stay within platform guidelines
- **Battery Impact**: Minimal background drain
- **App Size**: iOS < 200MB, Android < 150MB

### User Metrics
- **Crash-Free Rate**: Target > 99.5%
- **ANR Rate (Android)**: < 0.1%
- **App Store Rating**: Maintain > 4.5 stars
- **User Retention**: Day 1 > 40%, Day 7 > 20%

## Common Pitfalls

### 1. Ignoring Platform Conventions
**Problem**: Using the same UI patterns on iOS and Android, frustrating users
**Prevention**: Study Human Interface Guidelines and Material Design. Use platform-specific components where expectations differ (navigation, buttons, alerts).

### 2. Over-fetching on Mobile Networks
**Problem**: Downloading excessive data on slow or metered connections
**Prevention**: Implement pagination, cache aggressively, compress payloads, and respect data saver mode settings.

### 3. Memory Leaks in Navigation
**Problem**: Screens not properly cleaned up, causing memory growth
**Prevention**: Clean up subscriptions and listeners in useEffect cleanup. Use React Navigation's focus/blur events appropriately.

### 4. Blocking the UI Thread
**Problem**: Heavy computations causing jank and ANRs
**Prevention**: Use background threads (InteractionManager, worklets) for heavy operations. Profile with Flipper/Android Profiler.

## Integration Points

- **API Development**: Design APIs optimized for mobile (pagination, partial responses)
- **Testing Strategies**: Implement device testing and E2E with Detox/Maestro
- **Performance Optimization**: Apply mobile-specific performance techniques
- **DevOps Practices**: Integrate with Fastlane for automated deployments
- **Firebase Deployment**: Use Firebase for auth, analytics, and crash reporting
- **Technical Documentation**: Document platform-specific implementations
