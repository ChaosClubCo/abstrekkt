---
name: firebase-deployment
description: Firebase Firestore, Authentication, Hosting, Cloud Functions, and deployment workflows. Use when setting up Firebase projects, configuring Firestore security rules, implementing Firebase Auth, deploying to Firebase Hosting, or creating Cloud Functions.
allowed-tools: mcp__plugin_firebase_firebase__*
---

# Firebase Deployment

## Overview

Firebase provides a comprehensive platform for building and deploying web and mobile applications. Its suite of services includes real-time databases (Firestore), authentication, static hosting, serverless functions, and analytics. Firebase excels at rapid development and scales from prototype to production.

This skill covers Firebase project setup, Firestore database design and security rules, Authentication configuration, Hosting deployment, and Cloud Functions development. It provides patterns for building secure, performant applications on Firebase infrastructure.

Firebase's strength is its tight integration between services and excellent client SDKs. This skill helps leverage these capabilities while avoiding common pitfalls around security rules, costs, and architectural decisions.

### Why This Matters
- Firebase accelerates development with pre-built authentication and real-time sync
- Proper security rules are critical - misconfigured rules have caused major data breaches
- Understanding Firebase pricing prevents unexpected costs at scale
- Firebase Hosting provides fast, global CDN deployment with minimal configuration

## When to Use

### Primary Triggers
- Setting up new Firebase projects
- Configuring Firestore database and security rules
- Implementing Firebase Authentication
- Deploying to Firebase Hosting
- Creating and deploying Cloud Functions

### Specific Use Cases
- "Set up a new Firebase project for our React application"
- "Write Firestore security rules for a multi-tenant application"
- "Configure Firebase Auth with Google and email/password providers"
- "Deploy our Next.js app to Firebase Hosting"
- "Create a Cloud Function to process Stripe webhooks"

## Core Processes

### 1. Project Setup and Configuration

**Firebase Project Setup Checklist**

```markdown
## Firebase Project Setup

### 1. Create Project
- [ ] Create project in Firebase Console
- [ ] Enable Google Analytics (optional but recommended)
- [ ] Register web/iOS/Android apps

### 2. Install and Configure CLI
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 3. Configure Services
- [ ] Enable Firestore database
- [ ] Enable Authentication providers
- [ ] Set up Hosting
- [ ] Configure Cloud Functions (if needed)

### 4. Environment Configuration
- [ ] Download Firebase config
- [ ] Set up environment variables
- [ ] Configure local emulators

### 5. Security Review
- [ ] Review Firestore security rules
- [ ] Review Storage security rules
- [ ] Configure authorized domains
- [ ] Set up App Check (optional)
```

**Firebase Configuration**

```typescript
// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

### 2. Firestore Database Design

**Collection Structure Patterns**

```typescript
// Data model for multi-tenant SaaS

// Root collections
// /organizations/{orgId}
// /users/{userId}

// Subcollections
// /organizations/{orgId}/projects/{projectId}
// /organizations/{orgId}/members/{userId}
// /organizations/{orgId}/projects/{projectId}/tasks/{taskId}

// Types
interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  organizationIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  memberIds: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assigneeId: string | null;
  dueDate: Timestamp | null;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Firestore Operations**

```typescript
// lib/firestore/organizations.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

const organizationsRef = collection(db, 'organizations');

export async function getOrganization(orgId: string) {
  const docRef = doc(db, 'organizations', orgId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Organization not found');
  }

  return { id: docSnap.id, ...docSnap.data() } as Organization;
}

export async function createOrganization(
  data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
) {
  const batch = writeBatch(db);

  // Create organization
  const orgRef = doc(organizationsRef);
  batch.set(orgRef, {
    ...data,
    ownerId: userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  // Add user as member
  const memberRef = doc(db, 'organizations', orgRef.id, 'members', userId);
  batch.set(memberRef, {
    userId,
    role: 'owner',
    joinedAt: Timestamp.now(),
  });

  // Update user's organization list
  const userRef = doc(db, 'users', userId);
  batch.update(userRef, {
    organizationIds: arrayUnion(orgRef.id),
    updatedAt: Timestamp.now(),
  });

  await batch.commit();
  return orgRef.id;
}

export async function getOrganizationProjects(orgId: string) {
  const projectsRef = collection(db, 'organizations', orgId, 'projects');
  const q = query(
    projectsRef,
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
}

// Real-time subscription
export function subscribeToProjects(
  orgId: string,
  callback: (projects: Project[]) => void
) {
  const projectsRef = collection(db, 'organizations', orgId, 'projects');
  const q = query(
    projectsRef,
    where('status', '==', 'active'),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
    callback(projects);
  });
}
```

### 3. Firestore Security Rules

**Comprehensive Security Rules**

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function getUser() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function isOrgMember(orgId) {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
    }

    function isOrgAdmin(orgId) {
      let member = get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
      return isAuthenticated() &&
        member != null &&
        member.data.role in ['owner', 'admin'];
    }

    function isOrgOwner(orgId) {
      let org = get(/databases/$(database)/documents/organizations/$(orgId));
      return isAuthenticated() && org.data.ownerId == request.auth.uid;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false; // Users can't delete themselves
    }

    // Organizations collection
    match /organizations/{orgId} {
      allow read: if isOrgMember(orgId);
      allow create: if isAuthenticated() &&
        request.resource.data.ownerId == request.auth.uid;
      allow update: if isOrgAdmin(orgId);
      allow delete: if isOrgOwner(orgId);

      // Members subcollection
      match /members/{memberId} {
        allow read: if isOrgMember(orgId);
        allow create: if isOrgAdmin(orgId);
        allow update: if isOrgAdmin(orgId) &&
          // Can't demote the owner
          !(resource.data.role == 'owner' && request.resource.data.role != 'owner');
        allow delete: if isOrgAdmin(orgId) &&
          // Can't remove the owner
          resource.data.role != 'owner';
      }

      // Projects subcollection
      match /projects/{projectId} {
        allow read: if isOrgMember(orgId);
        allow create: if isOrgMember(orgId);
        allow update: if isOrgMember(orgId) &&
          request.resource.data.memberIds.hasAny([request.auth.uid]);
        allow delete: if isOrgAdmin(orgId);

        // Tasks subcollection
        match /tasks/{taskId} {
          function isProjectMember() {
            let project = get(/databases/$(database)/documents/organizations/$(orgId)/projects/$(projectId));
            return project.data.memberIds.hasAny([request.auth.uid]);
          }

          allow read: if isOrgMember(orgId);
          allow create: if isProjectMember();
          allow update: if isProjectMember();
          allow delete: if isProjectMember() || isOrgAdmin(orgId);
        }
      }
    }
  }
}
```

### 4. Firebase Authentication

**Auth Implementation**

```typescript
// hooks/useAuth.ts
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile
    await updateProfile(user, { displayName });

    // Create user document
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      displayName,
      photoURL: null,
      organizationIds: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        organizationIds: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 5. Firebase Hosting and Deployment

**firebase.json Configuration**

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18",
    "predeploy": ["npm --prefix functions run build"]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true
    }
  }
}
```

### 6. Cloud Functions

**Cloud Functions Examples**

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// HTTP function for webhooks
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const signature = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      functions.config().stripe.webhook_secret
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Firestore trigger - on user creation
export const onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const user = snap.data();
    const { userId } = context.params;

    // Send welcome email
    await admin.firestore().collection('mail').add({
      to: user.email,
      template: {
        name: 'welcome',
        data: {
          displayName: user.displayName,
        },
      },
    });

    console.log(`Welcome email queued for user ${userId}`);
  });

// Scheduled function - daily cleanup
export const dailyCleanup = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const thirtyDaysAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    // Delete old notifications
    const oldNotifications = await db
      .collectionGroup('notifications')
      .where('createdAt', '<', thirtyDaysAgo)
      .where('read', '==', true)
      .limit(500)
      .get();

    const batch = db.batch();
    oldNotifications.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${oldNotifications.size} old notifications`);
  });

// Callable function - invite member
export const inviteMember = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { organizationId, email, role } = data;

  // Verify caller is admin
  const memberDoc = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('members')
    .doc(context.auth.uid)
    .get();

  if (!memberDoc.exists || !['owner', 'admin'].includes(memberDoc.data()?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }

  // Create invitation
  const invitation = await db.collection('invitations').add({
    organizationId,
    email,
    role,
    invitedBy: context.auth.uid,
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ),
  });

  return { invitationId: invitation.id };
});
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Firebase CLI | Deployment, emulators | Free | Full local development |
| Firebase Console | Project management | Included | Visual database, analytics |
| Firestore Emulator | Local development | Free | Full offline development |
| Firebase Extensions | Pre-built features | Varies | Resize images, send emails |
| Firebase MCP | Claude integration | Free | Direct Firebase access |

## Metrics & KPIs

### Firebase Metrics
- **Firestore Reads/Writes**: Monitor for cost optimization
- **Function Invocations**: Track usage and cold starts
- **Hosting Bandwidth**: Monitor CDN usage
- **Auth Success Rate**: Track login failures

### Cost Metrics
- **Daily Spend**: Set budget alerts
- **Reads per User**: Optimize queries
- **Function Duration**: Reduce cold starts
- **Storage Usage**: Monitor growth

## Common Pitfalls

### 1. Insecure Security Rules
**Problem**: Rules that allow unauthenticated or overly broad access
**Prevention**: Start with deny-all, add specific allows. Test rules with Firebase Emulator. Use Firebase Security Rules Simulator.

### 2. Expensive Queries
**Problem**: Queries that read more documents than necessary
**Prevention**: Use composite indexes, limit queries, denormalize data for common reads, monitor usage in Console.

### 3. Cold Start Latency
**Problem**: Cloud Functions taking 1-5 seconds on cold start
**Prevention**: Use minimum instances, keep functions warm, optimize bundle size, consider Firebase Hosting for static content.

### 4. Missing Offline Support
**Problem**: App fails when offline without proper handling
**Prevention**: Enable Firestore offline persistence, handle offline state in UI, queue writes for sync.

## Integration Points

- **Web Development**: Firebase SDK integrates with React/Vue/Angular
- **Mobile Development**: Native iOS/Android and Flutter support
- **Authentication**: Pre-built auth flows and UI components
- **DevOps Practices**: Firebase CLI in CI/CD pipelines
- **Testing Strategies**: Emulator suite for local testing
- **Cloud Architecture**: Integrates with GCP services
