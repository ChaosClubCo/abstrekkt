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


## References
- `references/4-firebase-authentication.md` — 4. Firebase Authentication
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
