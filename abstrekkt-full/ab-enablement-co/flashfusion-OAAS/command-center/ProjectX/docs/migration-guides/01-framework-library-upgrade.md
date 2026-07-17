# Framework & Library Upgrade Migration Guide

> **Version**: 1.0.0
> **Last Updated**: January 2026
> **Scope**: React, Vue, Angular, Tailwind CSS, Node.js, TypeScript, Testing Libraries

---

## Table of Contents

1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [React 18 to 19 Migration](#react-18-to-19-migration)
3. [Vue 2 to 3 Migration](#vue-2-to-3-migration)
4. [Angular Version Upgrades](#angular-version-upgrades)
5. [Tailwind CSS 3 to 4 Migration](#tailwind-css-3-to-4-migration)
6. [Node.js LTS Upgrades](#nodejs-lts-upgrades)
7. [TypeScript Major Version Upgrades](#typescript-major-version-upgrades)
8. [Testing Library Migrations](#testing-library-migrations)
9. [Dependency Conflict Resolution](#dependency-conflict-resolution)
10. [Rollback Procedures](#rollback-procedures)
11. [Testing Strategy](#testing-strategy)
12. [Common Issues & Troubleshooting](#common-issues--troubleshooting)

---

## Pre-Migration Checklist

### Universal Pre-Migration Steps

- [ ] **Backup Current State**
  ```bash
  # Create a backup branch
  git checkout -b backup/pre-migration-$(date +%Y%m%d)
  git push origin backup/pre-migration-$(date +%Y%m%d)

  # Tag current release
  git tag -a v-pre-migration -m "State before migration"
  ```

- [ ] **Audit Current Dependencies**
  ```bash
  # Node.js projects
  npm outdated --long
  npm audit

  # Generate dependency tree
  npm ls --all > dependency-tree.txt
  ```

- [ ] **Document Current Versions**
  ```bash
  # Create version snapshot
  node -v > .version-snapshot
  npm -v >> .version-snapshot
  npx tsc --version >> .version-snapshot 2>/dev/null
  cat package.json | grep -E '"(react|vue|angular|tailwind|typescript)"' >> .version-snapshot
  ```

- [ ] **Review Breaking Changes**
  - Read official migration guides
  - Check GitHub release notes
  - Review RFC/proposals for new features

- [ ] **Test Coverage Verification**
  ```bash
  # Ensure adequate test coverage before migration
  npm run test -- --coverage
  # Aim for >80% coverage on critical paths
  ```

- [ ] **Create Migration Branch**
  ```bash
  git checkout -b feature/upgrade-[framework]-v[version]
  ```

- [ ] **Set Up Monitoring**
  - Enable error tracking (Sentry, etc.)
  - Set up performance baselines
  - Configure CI/CD for migration branch

### Migration Risk Assessment Matrix

| Risk Factor | Low | Medium | High |
|-------------|-----|--------|------|
| Project Age | < 1 year | 1-3 years | > 3 years |
| Test Coverage | > 80% | 50-80% | < 50% |
| Custom Patches | None | Few | Many |
| Third-party Deps | < 20 | 20-50 | > 50 |
| Team Experience | Familiar | Some exp | New to framework |

---

## React 18 to 19 Migration

### Overview

React 19 introduces significant improvements including the React Compiler, Server Components stability, Actions, and new hooks.

### Breaking Changes Table

| Feature | React 18 | React 19 | Migration Action |
|---------|----------|----------|------------------|
| `ref` prop | Requires `forwardRef` | Direct prop support | Remove `forwardRef` wrappers |
| `Context.Provider` | Required wrapper | Use `Context` directly | Update context usage |
| `useContext` | Returns `undefined` | Throws error if no provider | Add providers |
| Cleanup functions | Optional return | Required for effects with cleanup | Add explicit cleanup |
| `propTypes` | Runtime validation | Removed | Use TypeScript instead |
| `defaultProps` | Function component support | Deprecated | Use default parameters |
| String refs | Deprecated | Removed | Use `useRef` or callback refs |
| Legacy Context | Deprecated | Removed | Use modern Context API |
| `react-test-renderer` | Supported | Deprecated | Use `@testing-library/react` |

### Step-by-Step Upgrade Process

#### Step 1: Update Dependencies

```bash
# Update React packages
npm install react@19 react-dom@19

# Update TypeScript types
npm install -D @types/react@19 @types/react-dom@19

# Update related packages
npm install react-router-dom@latest
npm install @tanstack/react-query@latest
```

#### Step 2: Remove forwardRef Wrappers

**Before (React 18):**
```tsx
import { forwardRef, Ref } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, onClick }, ref) => {
    return (
      <button ref={ref} onClick={onClick}>
        {label}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
```

**After (React 19):**
```tsx
import { Ref } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  ref?: Ref<HTMLButtonElement>;
}

function Button({ label, onClick, ref }: ButtonProps) {
  return (
    <button ref={ref} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
```

#### Step 3: Update Context Usage

**Before (React 18):**
```tsx
import { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

**After (React 19):**
```tsx
import { createContext, use, ReactNode, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Provider - use Context directly (no .Provider needed)
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext value={{
      theme,
      toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
    }}>
      {children}
    </ThemeContext>
  );
}

// Consumer hook using new `use` API
function useTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### Step 4: Replace defaultProps with Default Parameters

**Before (React 18):**
```tsx
interface CardProps {
  title: string;
  subtitle?: string;
  elevated?: boolean;
}

function Card({ title, subtitle, elevated }: CardProps) {
  return (
    <div className={elevated ? 'card elevated' : 'card'}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

Card.defaultProps = {
  subtitle: '',
  elevated: false,
};
```

**After (React 19):**
```tsx
interface CardProps {
  title: string;
  subtitle?: string;
  elevated?: boolean;
}

function Card({
  title,
  subtitle = '',
  elevated = false
}: CardProps) {
  return (
    <div className={elevated ? 'card elevated' : 'card'}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
```

#### Step 5: Implement New Actions API

**Before (React 18):**
```tsx
import { useState, useTransition } from 'react';

function UpdateProfile() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await updateProfile({ name });
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

**After (React 19):**
```tsx
import { useActionState } from 'react';

async function updateProfileAction(
  previousState: { error: string | null },
  formData: FormData
) {
  try {
    const name = formData.get('name') as string;
    await updateProfile({ name });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

function UpdateProfile() {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    { error: null }
  );

  return (
    <form action={formAction}>
      <input name="name" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

#### Step 6: Use New Hooks

**useOptimistic Hook:**
```tsx
import { useOptimistic, useActionState } from 'react';

interface Message {
  id: string;
  text: string;
  sending?: boolean;
}

function MessageList({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: Message[], newMessage: Message) => [
      ...state,
      { ...newMessage, sending: true }
    ]
  );

  async function sendMessage(formData: FormData) {
    const text = formData.get('text') as string;
    const newMessage = { id: crypto.randomUUID(), text };

    addOptimisticMessage(newMessage);
    await deliverMessage(newMessage);
  }

  return (
    <>
      {optimisticMessages.map((message) => (
        <div key={message.id} style={{ opacity: message.sending ? 0.5 : 1 }}>
          {message.text}
        </div>
      ))}
      <form action={sendMessage}>
        <input name="text" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

**useFormStatus Hook:**
```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### React 19 Codemod

```bash
# Install and run the official codemod
npx codemod@latest react/19/migration-recipe

# Or run individual transforms
npx codemod@latest react/19/replace-reactdom-render
npx codemod@latest react/19/replace-string-ref
npx codemod@latest react/19/replace-act-import
npx codemod@latest react/19/replace-use-form-state
```

---

## Vue 2 to 3 Migration

### Overview

Vue 3 introduces the Composition API, improved TypeScript support, better performance, and a new reactivity system based on Proxies.

### Breaking Changes Table

| Feature | Vue 2 | Vue 3 | Migration Action |
|---------|-------|-------|------------------|
| Global API | `Vue.use()`, `Vue.component()` | `app.use()`, `app.component()` | Refactor to app instance |
| v-model | `.sync` modifier | Multiple v-model bindings | Update v-model usage |
| Filters | `{{ value \| filter }}` | Removed | Use computed or methods |
| Event Bus | `$on`, `$off`, `$emit` | Removed | Use mitt or provide/inject |
| `$children` | Accessible | Removed | Use template refs |
| `$listeners` | Accessible | Merged into `$attrs` | Update listener access |
| Functional components | `functional: true` | Plain functions | Rewrite as functions |
| Async components | `() => import()` | `defineAsyncComponent` | Wrap imports |
| Transition classes | `v-enter`, `v-leave` | `v-enter-from`, `v-leave-from` | Update class names |
| Reactivity | `Vue.set()`, `Vue.delete()` | Not needed with Proxy | Remove calls |
| `data` option | Object or function | Must be function | Convert to function |

### Step-by-Step Upgrade Process

#### Step 1: Install Vue 3 and Migration Build

```bash
# Install Vue 3 with migration build for gradual migration
npm install vue@3
npm install @vue/compat@3

# Update build tools
npm install -D @vitejs/plugin-vue@latest
# OR for webpack
npm install -D vue-loader@17
```

#### Step 2: Configure Migration Build

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2, // Enable Vue 2 compat mode
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      vue: '@vue/compat',
    },
  },
});
```

#### Step 3: Update Application Entry Point

**Before (Vue 2):**
```typescript
// main.ts
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import MyPlugin from './plugins/my-plugin';

Vue.config.productionTip = false;
Vue.use(MyPlugin);

Vue.component('GlobalComponent', GlobalComponent);

Vue.filter('capitalize', (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
```

**After (Vue 3):**
```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import MyPlugin from './plugins/my-plugin';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(MyPlugin);

app.component('GlobalComponent', GlobalComponent);

// Filters are removed - use global properties or computed
app.config.globalProperties.$filters = {
  capitalize: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
};

app.mount('#app');
```

#### Step 4: Convert Options API to Composition API

**Before (Vue 2 Options API):**
```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="fetchData">Fetch Data</button>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Counter',

  props: {
    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      count: 0,
      items: [],
      loading: false,
    };
  },

  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },

  watch: {
    count(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
    },
  },

  created() {
    this.fetchData();
  },

  mounted() {
    console.log('Component mounted');
  },

  methods: {
    increment() {
      this.count++;
    },

    async fetchData() {
      this.loading = true;
      try {
        const response = await fetch('/api/items');
        this.items = await response.json();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

**After (Vue 3 Composition API with script setup):**
```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="fetchData">Fetch Data</button>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Item {
  id: number;
  name: string;
}

// Props
const props = defineProps<{
  title: string;
}>();

// Reactive state
const count = ref(0);
const items = ref<Item[]>([]);
const loading = ref(false);

// Computed
const doubleCount = computed(() => count.value * 2);

// Watch
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// Methods
function increment() {
  count.value++;
}

async function fetchData() {
  loading.value = true;
  try {
    const response = await fetch('/api/items');
    items.value = await response.json();
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
});

// Call on component creation (replaces created hook)
fetchData();
</script>
```

#### Step 5: Update v-model Usage

**Before (Vue 2):**
```vue
<!-- Parent component -->
<template>
  <CustomInput
    v-model="value"
    :title.sync="title"
  />
</template>

<!-- CustomInput.vue -->
<template>
  <div>
    <input :value="value" @input="$emit('input', $event.target.value)" />
    <input :value="title" @input="$emit('update:title', $event.target.value)" />
  </div>
</template>

<script>
export default {
  props: ['value', 'title'],
};
</script>
```

**After (Vue 3):**
```vue
<!-- Parent component -->
<template>
  <CustomInput
    v-model="value"
    v-model:title="title"
  />
</template>

<!-- CustomInput.vue -->
<template>
  <div>
    <input :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />
    <input :value="title" @input="emit('update:title', $event.target.value)" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  title: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:title': [value: string];
}>();
</script>
```

#### Step 6: Replace Event Bus with Mitt

**Before (Vue 2):**
```typescript
// event-bus.ts
import Vue from 'vue';
export const EventBus = new Vue();

// Component A
EventBus.$emit('user-logged-in', user);

// Component B
EventBus.$on('user-logged-in', (user) => {
  this.currentUser = user;
});
```

**After (Vue 3):**
```typescript
// event-bus.ts
import mitt from 'mitt';

type Events = {
  'user-logged-in': User;
  'notification': { message: string; type: 'success' | 'error' };
};

export const emitter = mitt<Events>();

// Component A
import { emitter } from './event-bus';
emitter.emit('user-logged-in', user);

// Component B
import { emitter } from './event-bus';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  emitter.on('user-logged-in', (user) => {
    currentUser.value = user;
  });
});

onUnmounted(() => {
  emitter.off('user-logged-in');
});
```

#### Step 7: Update Vuex to Pinia

**Before (Vuex):**
```typescript
// store/modules/user.ts
export default {
  namespaced: true,

  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    fullName: (state) => `${state.user?.firstName} ${state.user?.lastName}`,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
  },

  actions: {
    async login({ commit }, credentials) {
      const user = await authService.login(credentials);
      commit('SET_USER', user);
      return user;
    },
  },
};

// Usage in component
this.$store.dispatch('user/login', credentials);
this.$store.getters['user/fullName'];
```

**After (Pinia):**
```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  );

  // Actions
  async function login(credentials: { email: string; password: string }) {
    const response = await authService.login(credentials);
    user.value = response;
    return response;
  }

  function logout() {
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    fullName,
    login,
    logout,
  };
});

// Usage in component
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
await userStore.login(credentials);
console.log(userStore.fullName);
```

### Vue Migration Codemod

```bash
# Install Vue migration helper
npm install -g @vue/compat

# Run migration helper
npx vue-codemod src --transformation vue-composition-api-migration

# Check specific deprecations
npx vue-codemod src --transformation remove-contextual-h
npx vue-codemod src --transformation new-global-api
```

---

## Angular Version Upgrades

### Overview

Angular follows semantic versioning with major releases approximately every 6 months. Each version includes migration schematics to automate common changes.

### Breaking Changes by Version

| Version | Key Changes | Migration Impact |
|---------|-------------|------------------|
| 14 → 15 | Standalone components default, `NgOptimizedImage` | Medium |
| 15 → 16 | Signals (preview), required inputs, `DestroyRef` | Medium |
| 16 → 17 | Signals stable, control flow syntax, deferrable views | High |
| 17 → 18 | Zoneless (experimental), signal-based inputs/outputs | High |

### Step-by-Step Upgrade Process

#### Step 1: Update Angular CLI and Core

```bash
# Always update Angular CLI first
npm install -g @angular/cli@latest

# Update Angular core packages
ng update @angular/core@17 @angular/cli@17

# Update Angular Material (if used)
ng update @angular/material@17

# Check for additional updates
ng update
```

#### Step 2: Migrate to Standalone Components

**Before (NgModule-based):**
```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**After (Standalone):**
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
  ],
});

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}

// user-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul>
      @for (user of users(); track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `,
})
export class UserListComponent {
  private userService = inject(UserService);
  users = this.userService.users;
}
```

#### Step 3: Migrate to Signals

**Before (RxJS with async pipe):**
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-counter',
  template: `
    <div>Count: {{ count }}</div>
    <div>Double: {{ doubleCount }}</div>
    <button (click)="increment()">Increment</button>
  `,
})
export class CounterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  count = 0;
  doubleCount = 0;

  ngOnInit() {
    // Manually sync derived state
  }

  increment() {
    this.count++;
    this.doubleCount = this.count * 2;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**After (Signals):**
```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>Count: {{ count() }}</div>
    <div>Double: {{ doubleCount() }}</div>
    <button (click)="increment()">Increment</button>
  `,
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(c => c + 1);
  }
}
```

#### Step 4: Migrate to New Control Flow Syntax

**Before (NgIf, NgFor, NgSwitch):**
```html
<div *ngIf="isLoading; else content">
  <app-spinner></app-spinner>
</div>

<ng-template #content>
  <ul>
    <li *ngFor="let item of items; trackBy: trackById">
      {{ item.name }}
    </li>
  </ul>

  <div *ngIf="items.length === 0">
    No items found.
  </div>
</ng-template>

<div [ngSwitch]="status">
  <span *ngSwitchCase="'active'">Active</span>
  <span *ngSwitchCase="'inactive'">Inactive</span>
  <span *ngSwitchDefault>Unknown</span>
</div>
```

**After (Built-in Control Flow):**
```html
@if (isLoading) {
  <app-spinner />
} @else {
  <ul>
    @for (item of items; track item.id) {
      <li>{{ item.name }}</li>
    } @empty {
      <li>No items found.</li>
    }
  </ul>
}

@switch (status) {
  @case ('active') {
    <span>Active</span>
  }
  @case ('inactive') {
    <span>Inactive</span>
  }
  @default {
    <span>Unknown</span>
  }
}
```

#### Step 5: Migrate to Signal-Based Inputs and Outputs

**Before (Decorator-based):**
```typescript
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ user?.name }}</h3>
      <button (click)="onSelect()">Select</button>
    </div>
  `,
})
export class UserCardComponent implements OnChanges {
  @Input() user: User | null = null;
  @Input() highlighted = false;
  @Output() selected = new EventEmitter<User>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      console.log('User changed:', changes['user'].currentValue);
    }
  }

  onSelect() {
    if (this.user) {
      this.selected.emit(this.user);
    }
  }
}
```

**After (Signal-based):**
```typescript
import { Component, input, output, effect } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="card" [class.highlighted]="highlighted()">
      <h3>{{ user()?.name }}</h3>
      <button (click)="onSelect()">Select</button>
    </div>
  `,
})
export class UserCardComponent {
  // Required input
  user = input.required<User>();

  // Optional input with default
  highlighted = input(false);

  // Output
  selected = output<User>();

  constructor() {
    // React to input changes with effect
    effect(() => {
      console.log('User changed:', this.user());
    });
  }

  onSelect() {
    this.selected.emit(this.user());
  }
}
```

#### Step 6: Implement Deferrable Views

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeavyChartComponent, DataTableComponent],
  template: `
    <h1>Dashboard</h1>

    <!-- Defer loading until viewport -->
    @defer (on viewport) {
      <app-heavy-chart [data]="chartData()" />
    } @placeholder {
      <div class="chart-placeholder">Chart loading...</div>
    } @loading (minimum 500ms) {
      <app-spinner />
    } @error {
      <p>Failed to load chart</p>
    }

    <!-- Defer with interaction trigger -->
    @defer (on interaction) {
      <app-data-table [data]="tableData()" />
    } @placeholder {
      <button>Click to load table</button>
    }

    <!-- Defer with timer -->
    @defer (on timer(2s)) {
      <app-recommendations />
    } @placeholder {
      <p>Recommendations loading in 2 seconds...</p>
    }
  `,
})
export class DashboardComponent {
  chartData = signal<ChartData[]>([]);
  tableData = signal<TableRow[]>([]);
}
```

### Angular Migration Schematics

```bash
# Run automatic migrations
ng update @angular/core@17 --migrate-only

# Specific migrations
ng generate @angular/core:standalone
ng generate @angular/core:control-flow
ng generate @angular/core:route-lazy-loading

# Material migrations
ng generate @angular/material:mdc-migration
```

---

## Tailwind CSS 3 to 4 Migration

### Overview

Tailwind CSS 4 introduces a new engine with significant performance improvements, CSS-first configuration, and automatic content detection.

### Breaking Changes Table

| Feature | Tailwind 3 | Tailwind 4 | Migration Action |
|---------|------------|------------|------------------|
| Configuration | `tailwind.config.js` | CSS `@theme` directive | Convert config to CSS |
| Content detection | Manual `content` array | Automatic | Remove content config |
| `@tailwind` directives | Required | `@import "tailwindcss"` | Update imports |
| Color opacity | `bg-red-500/50` | Same (kept) | None |
| Arbitrary values | `w-[100px]` | Same (kept) | None |
| `theme()` function | In config | In CSS | Update references |
| JIT mode | Opt-in | Default only | Remove `mode: 'jit'` |
| Purge config | `purge` key | Removed | Remove purge config |
| Dark mode | `darkMode: 'class'` | CSS-based | Update config |

### Step-by-Step Upgrade Process

#### Step 1: Install Tailwind CSS 4

```bash
# Remove old packages
npm uninstall tailwindcss postcss autoprefixer

# Install Tailwind 4
npm install tailwindcss@next @tailwindcss/vite

# For PostCSS projects (non-Vite)
npm install tailwindcss@next @tailwindcss/postcss
```

#### Step 2: Update Build Configuration

**Vite (vite.config.ts):**
```typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});
```

**PostCSS (postcss.config.js):**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

#### Step 3: Convert Configuration to CSS

**Before (tailwind.config.js):**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

**After (styles/app.css):**
```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

@theme {
  /* Colors */
  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;
  --color-brand-900: #0c4a6e;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Fonts */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Border Radius */
  --radius-4xl: 2rem;

  /* Animations */
  --animate-spin-slow: spin 3s linear infinite;
  --animate-bounce-gentle: bounce 2s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

/* Dark mode is now handled automatically via CSS */
@media (prefers-color-scheme: dark) {
  :root {
    --color-brand-500: #38bdf8;
  }
}

/* Or use class-based dark mode */
.dark {
  --color-brand-500: #38bdf8;
}
```

#### Step 4: Update CSS Imports

**Before (Tailwind 3):**
```css
/* styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600;
  }
}
```

**After (Tailwind 4):**
```css
/* styles/global.css */
@import "tailwindcss";

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600;
  }
}
```

#### Step 5: Update Renamed Utilities

**Renamed Classes:**
```html
<!-- Before (Tailwind 3) -->
<div class="flex-grow flex-shrink-0">...</div>
<div class="overflow-clip">...</div>
<div class="decoration-clone">...</div>
<div class="shadow-sm shadow-inner">...</div>

<!-- After (Tailwind 4) -->
<div class="grow shrink-0">...</div>
<div class="overflow-clip">...</div>
<div class="box-decoration-clone">...</div>
<div class="shadow-xs shadow-inner">...</div>
```

**Updated Gradient Syntax:**
```html
<!-- Before (Tailwind 3) -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500">...</div>

<!-- After (Tailwind 4) - same syntax works, plus new options -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500">...</div>
<div class="bg-linear-to-r from-blue-500 to-purple-500">...</div>
<div class="bg-linear-[45deg] from-blue-500 to-purple-500">...</div>
```

#### Step 6: Update Container Configuration

**Before (tailwind.config.js):**
```javascript
module.exports = {
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
  },
};
```

**After (CSS):**
```css
@import "tailwindcss";

@utility container {
  margin-inline: auto;
  padding-inline: 1rem;

  @media (min-width: 640px) {
    padding-inline: 2rem;
  }

  @media (min-width: 1024px) {
    padding-inline: 4rem;
  }

  @media (min-width: 1280px) {
    padding-inline: 5rem;
  }
}
```

### Tailwind 4 Migration Tool

```bash
# Run the official upgrade tool
npx @tailwindcss/upgrade

# This will:
# - Convert tailwind.config.js to CSS @theme
# - Update imports
# - Update renamed classes
# - Remove content configuration
```

---

## Node.js LTS Upgrades

### LTS Release Schedule

| Version | Release Date | Active LTS Start | Maintenance End |
|---------|--------------|------------------|-----------------|
| Node 18 | Apr 2022 | Oct 2022 | Apr 2025 |
| Node 20 | Apr 2023 | Oct 2023 | Apr 2026 |
| Node 22 | Apr 2024 | Oct 2024 | Apr 2027 |

### Breaking Changes by Version

#### Node 18 to 20

| Feature | Node 18 | Node 20 | Migration Action |
|---------|---------|---------|------------------|
| V8 version | 10.2 | 11.3 | Check V8 deprecations |
| Permission model | N/A | Experimental | Review if using |
| Test runner | Experimental | Stable | Update test imports |
| `url.parse()` | Works | Deprecated | Use `URL` constructor |
| Custom ESM loaders | `--loader` | `--import` | Update loader flags |

#### Node 20 to 22

| Feature | Node 20 | Node 22 | Migration Action |
|---------|---------|---------|------------------|
| V8 version | 11.3 | 12.4 | Check V8 deprecations |
| `require(esm)` | Error | Works (experimental) | Consider adoption |
| `fetch` | Global | Global (improved) | None |
| WebSocket | N/A | Global | Consider adoption |
| `glob` | N/A | Built-in | Consider adoption |

### Step-by-Step Upgrade Process

#### Step 1: Check Node.js Version Compatibility

```bash
# Check current version
node -v

# Check engines in package.json
cat package.json | grep -A2 '"engines"'

# Check for deprecated APIs
npx depcheck
npx npm-check-updates
```

#### Step 2: Update Node.js

```bash
# Using nvm (recommended)
nvm install 22
nvm use 22
nvm alias default 22

# Using fnm
fnm install 22
fnm use 22
fnm default 22

# Verify installation
node -v
npm -v
```

#### Step 3: Update package.json Engines

```json
{
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  }
}
```

#### Step 4: Update Deprecated APIs

**URL Parsing:**
```javascript
// Before (deprecated)
const url = require('url');
const parsed = url.parse('https://example.com/path?query=value');
console.log(parsed.hostname); // 'example.com'

// After
const parsed = new URL('https://example.com/path?query=value');
console.log(parsed.hostname); // 'example.com'
```

**Custom ESM Loaders:**
```bash
# Before (Node 18)
node --loader ./loader.mjs app.mjs

# After (Node 20+)
node --import ./register.mjs app.mjs
```

```javascript
// register.mjs
import { register } from 'node:module';
register('./loader.mjs', import.meta.url);
```

**Using Built-in Test Runner:**
```javascript
// Before (Jest or Mocha)
describe('math', () => {
  it('should add numbers', () => {
    expect(1 + 1).toBe(2);
  });
});

// After (Node.js built-in)
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('math', () => {
  it('should add numbers', () => {
    assert.strictEqual(1 + 1, 2);
  });
});
```

```bash
# Run tests
node --test
node --test --watch  # Watch mode
node --test --coverage  # With coverage
```

#### Step 5: Update CI/CD Configuration

**GitHub Actions:**
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - run: npm ci
      - run: npm test
```

#### Step 6: Update Dockerfile

```dockerfile
# Before
FROM node:18-alpine

# After
FROM node:22-alpine

WORKDIR /app

# Use npm ci for reproducible builds
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Use non-root user
USER node

CMD ["node", "server.js"]
```

---

## TypeScript Major Version Upgrades

### Version History and Key Changes

| Version | Release | Key Features |
|---------|---------|--------------|
| 4.9 | Nov 2022 | `satisfies` operator, auto-accessors |
| 5.0 | Mar 2023 | Decorators, `const` type parameters, enums |
| 5.1 | Jun 2023 | Linked cursors, easier implicit returns |
| 5.2 | Aug 2023 | `using` declarations, decorator metadata |
| 5.3 | Nov 2023 | Import attributes, `resolution-mode` |
| 5.4 | Mar 2024 | `NoInfer` utility type, improved narrowing |
| 5.5 | Jun 2024 | Inferred type predicates, regex checking |
| 5.6 | Sep 2024 | Disallowed nullish/truthy checks |

### Breaking Changes Table

| Feature | TS 4.x | TS 5.x | Migration Action |
|---------|--------|--------|------------------|
| Module resolution | `node` | `node16`/`bundler` | Update tsconfig |
| Target | ES2020 default | ES2022 default | Review target |
| `export =` | Allowed | Warning in ESM | Use `export default` |
| Enums | Loose | Stricter | Fix enum comparisons |
| Decorators | Experimental | TC39 standard | Update decorator syntax |
| `importsNotUsedAsValues` | Option | Removed | Use `verbatimModuleSyntax` |

### Step-by-Step Upgrade Process

#### Step 1: Update TypeScript

```bash
# Update TypeScript
npm install -D typescript@latest

# Update related tooling
npm install -D @types/node@latest
npm install -D ts-node@latest
```

#### Step 2: Update tsconfig.json

**Before (TypeScript 4.x):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "importsNotUsedAsValues": "error",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**After (TypeScript 5.x):**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

#### Step 3: Update Import Syntax

**Type-only imports:**
```typescript
// Before (mixed imports)
import { User, UserService } from './user';

// After (explicit type imports with verbatimModuleSyntax)
import type { User } from './user';
import { UserService } from './user';

// Or combined
import { UserService, type User } from './user';
```

#### Step 4: Update Decorators to TC39 Standard

**Before (Experimental Decorators):**
```typescript
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
```

**After (TC39 Decorators):**
```typescript
function log<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name);

  return function (this: This, ...args: Args): Return {
    console.log(`Calling ${methodName} with`, args);
    return target.call(this, ...args);
  };
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
```

#### Step 5: Use New Type Features

**satisfies operator:**
```typescript
// Before - type assertion loses type info
const config = {
  width: 100,
  height: 200,
} as const as Record<string, number>;

// After - satisfies keeps literal types
const config = {
  width: 100,
  height: 200,
} satisfies Record<string, number>;

// config.width is still type 100, not number
```

**const type parameters:**
```typescript
// Before - had to use as const at call site
function createTuple<T extends readonly unknown[]>(items: T): T {
  return items;
}
const tuple = createTuple([1, 2, 3] as const); // readonly [1, 2, 3]

// After - const modifier on type parameter
function createTuple<const T extends readonly unknown[]>(items: T): T {
  return items;
}
const tuple = createTuple([1, 2, 3]); // readonly [1, 2, 3]
```

**using declarations:**
```typescript
// Resource cleanup with Disposable
class FileHandle implements Disposable {
  #handle: number;

  constructor(path: string) {
    this.#handle = openFile(path);
  }

  read(): string {
    return readFile(this.#handle);
  }

  [Symbol.dispose]() {
    closeFile(this.#handle);
    console.log('File handle closed');
  }
}

// Automatically disposed when block exits
function processFile(path: string) {
  using file = new FileHandle(path);
  const content = file.read();
  // file is automatically closed here
  return content;
}
```

**NoInfer utility type:**
```typescript
// Before - T is inferred from both parameters
function createStore<T>(initial: T, serialize: (value: T) => string): T {
  return initial;
}
// This incorrectly infers T as string | number
createStore(42, (v: string) => v);

// After - NoInfer prevents inference from serialize
function createStore<T>(initial: T, serialize: (value: NoInfer<T>) => string): T {
  return initial;
}
// Error: number is not assignable to string
createStore(42, (v: string) => v);
```

---

## Testing Library Migrations

### Jest to Vitest Migration

#### Why Migrate?

| Aspect | Jest | Vitest |
|--------|------|--------|
| Performance | Slower | 2-10x faster |
| Configuration | Complex | Minimal |
| ESM Support | Limited | Native |
| Watch Mode | Works | Faster |
| Vite Integration | None | Native |
| API Compatibility | N/A | Jest-compatible |

#### Step-by-Step Migration

**Step 1: Install Vitest**

```bash
# Remove Jest
npm uninstall jest @types/jest ts-jest jest-environment-jsdom

# Install Vitest
npm install -D vitest @vitest/coverage-v8 @vitest/ui
npm install -D jsdom  # For DOM testing
npm install -D @testing-library/react @testing-library/jest-dom
```

**Step 2: Configure Vitest**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
});
```

**Step 3: Update Setup File**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

**Step 4: Update Test Files**

**Before (Jest):**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  it('increments count on click', () => {
    render(<Counter initialCount={0} />);
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('calls onChange when count changes', () => {
    const onChange = jest.fn();
    render(<Counter initialCount={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('handles async operations', async () => {
    jest.useFakeTimers();
    render(<Counter initialCount={0} />);

    fireEvent.click(screen.getByRole('button', { name: /async/i }));

    jest.advanceTimersByTime(1000);

    await screen.findByText('Count: 1');
    jest.useRealTimers();
  });
});
```

**After (Vitest):**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  it('increments count on click', () => {
    render(<Counter initialCount={0} />);
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('calls onChange when count changes', () => {
    const onChange = vi.fn();
    render(<Counter initialCount={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('handles async operations', async () => {
    vi.useFakeTimers();
    render(<Counter initialCount={0} />);

    fireEvent.click(screen.getByRole('button', { name: /async/i }));

    vi.advanceTimersByTime(1000);

    await screen.findByText('Count: 1');
    vi.useRealTimers();
  });
});
```

**Step 5: Update package.json Scripts**

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### API Mapping Table: Jest to Vitest

| Jest | Vitest |
|------|--------|
| `jest.fn()` | `vi.fn()` |
| `jest.mock()` | `vi.mock()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` |
| `jest.resetAllMocks()` | `vi.resetAllMocks()` |
| `jest.restoreAllMocks()` | `vi.restoreAllMocks()` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `jest.useRealTimers()` | `vi.useRealTimers()` |
| `jest.advanceTimersByTime()` | `vi.advanceTimersByTime()` |
| `jest.runAllTimers()` | `vi.runAllTimers()` |
| `jest.setSystemTime()` | `vi.setSystemTime()` |
| `jest.requireActual()` | `vi.importActual()` |

### Enzyme to React Testing Library Migration

**Before (Enzyme):**
```typescript
import { shallow, mount } from 'enzyme';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  it('renders user name', () => {
    const wrapper = shallow(<UserProfile user={{ name: 'John', email: 'john@example.com' }} />);
    expect(wrapper.find('.user-name').text()).toBe('John');
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    const wrapper = mount(
      <UserProfile user={{ name: 'John', email: 'john@example.com' }} onEdit={onEdit} />
    );
    wrapper.find('button.edit-btn').simulate('click');
    expect(onEdit).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const wrapper = shallow(<UserProfile user={null} loading={true} />);
    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('updates when props change', () => {
    const wrapper = shallow(<UserProfile user={{ name: 'John', email: 'john@example.com' }} />);
    wrapper.setProps({ user: { name: 'Jane', email: 'jane@example.com' } });
    expect(wrapper.find('.user-name').text()).toBe('Jane');
  });
});
```

**After (React Testing Library):**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  it('renders user name', () => {
    render(<UserProfile user={{ name: 'John', email: 'john@example.com' }} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <UserProfile user={{ name: 'John', email: 'john@example.com' }} onEdit={onEdit} />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<UserProfile user={null} loading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Or use aria-label: expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it('updates when props change', () => {
    const { rerender } = render(
      <UserProfile user={{ name: 'John', email: 'john@example.com' }} />
    );
    expect(screen.getByText('John')).toBeInTheDocument();

    rerender(<UserProfile user={{ name: 'Jane', email: 'jane@example.com' }} />);
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });
});
```

---

## Dependency Conflict Resolution

### Identifying Conflicts

```bash
# Check for peer dependency issues
npm ls 2>&1 | grep "peer dep"

# Check for duplicate packages
npm ls --all | grep -E "^\s*[├└]"

# Use npm-check for detailed analysis
npx npm-check -u

# Check for security vulnerabilities
npm audit
```

### Resolution Strategies

#### Strategy 1: Use npm overrides

```json
{
  "overrides": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.6.0"
  }
}
```

#### Strategy 2: Use resolutions (Yarn)

```json
{
  "resolutions": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@types/react": "^19.0.0"
  }
}
```

#### Strategy 3: Use pnpm overrides

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'

# package.json
{
  "pnpm": {
    "overrides": {
      "react": "19.0.0",
      "react-dom": "19.0.0"
    }
  }
}
```

#### Strategy 4: Patch packages with patch-package

```bash
# Install patch-package
npm install -D patch-package postinstall-postinstall

# Make changes to node_modules/package-name
# Then create patch
npx patch-package package-name
```

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

### Common Conflict Patterns

| Conflict Type | Symptoms | Resolution |
|---------------|----------|------------|
| React version mismatch | Invalid hook call | Use overrides |
| TypeScript version | Type errors | Update @types packages |
| Peer dependency | npm WARN | Update or override |
| Duplicate packages | Large bundle | Dedupe or alias |
| ESM/CJS mismatch | Cannot find module | Update imports |

---

## Rollback Procedures

### Immediate Rollback

```bash
# If on migration branch, switch back
git checkout main

# If already merged, revert commit
git revert HEAD
git push origin main

# Reset to pre-migration tag
git reset --hard v-pre-migration
git push --force origin main  # Use with caution!
```

### Dependency Rollback

```bash
# Restore package-lock.json from backup
git checkout backup/pre-migration -- package-lock.json

# Reinstall old dependencies
rm -rf node_modules
npm ci

# Verify rollback
npm test
```

### Feature Flag Rollback

```typescript
// Use feature flags for gradual rollout
import { featureFlags } from './config';

function App() {
  if (featureFlags.useNewFramework) {
    return <NewAppV2 />;
  }
  return <LegacyApp />;
}

// Toggle in config to rollback
export const featureFlags = {
  useNewFramework: false, // Set to false to rollback
};
```

### Database Rollback (if applicable)

```bash
# Run down migrations
npm run migrate:down

# Or reset to specific migration
npm run migrate:to -- 20240101000000
```

---

## Testing Strategy

### Pre-Migration Testing

```bash
# Run full test suite
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Generate baseline metrics
npm run build
npx bundlesize

# Performance baseline
npm run lighthouse
```

### During Migration Testing

```bash
# Test incrementally
npm test -- --changed

# Run only affected tests
npm test -- --findRelatedTests src/migrated-component.tsx

# Test with verbose output
npm test -- --verbose
```

### Post-Migration Testing

```bash
# Full regression test
npm test -- --coverage --watchAll=false

# Compare bundle size
npx bundlesize

# E2E regression
npm run test:e2e

# Visual regression (if using)
npm run test:visual
```

### Testing Checklist

- [ ] Unit tests pass (aim for same or better coverage)
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size within acceptable range
- [ ] Performance metrics maintained
- [ ] Accessibility tests pass
- [ ] Manual QA on critical paths

---

## Common Issues & Troubleshooting

### React 19 Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid hook call" | Version mismatch | Check all React packages are v19 |
| Context returns undefined | Provider missing | Add provider higher in tree |
| forwardRef warnings | Using old pattern | Remove forwardRef wrapper |
| useFormState not found | Wrong import | Import from react-dom |

### Vue 3 Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot read property of undefined" | Reactivity change | Use `.value` for refs |
| Computed not updating | Wrong syntax | Return value from computed |
| Event bus not working | API removed | Use mitt library |
| Template refs not working | Timing issue | Use `onMounted` hook |

### TypeScript Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Module not found | Module resolution | Update moduleResolution |
| Decorator errors | Wrong syntax | Use TC39 decorators |
| Import errors | verbatimModuleSyntax | Add `type` keyword |
| Generic inference wrong | Breaking change | Use explicit types |

### Node.js Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| url.parse deprecated | API change | Use URL constructor |
| ESM/CJS conflicts | Module system | Check package.json type |
| Native addon failures | Node version | Rebuild native modules |
| Crypto changes | API updates | Use updated APIs |

### Build/Bundle Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Bundle too large | Tree shaking broken | Check imports |
| Missing dependencies | Peer deps | Add to dependencies |
| Sourcemaps broken | Config change | Update sourcemap config |
| CSS not loading | Loader change | Update CSS config |

### Debugging Commands

```bash
# Clear all caches
rm -rf node_modules/.cache
rm -rf .next .nuxt dist build
npm cache clean --force

# Reinstall fresh
rm -rf node_modules package-lock.json
npm install

# Debug module resolution
node --trace-deprecation app.js
DEBUG=* npm run dev

# Check for circular dependencies
npx madge --circular src/

# Analyze bundle
npx webpack-bundle-analyzer stats.json
npx vite-bundle-visualizer
```

---

## Automation Tools Summary

| Framework | Tool | Command |
|-----------|------|---------|
| React 19 | codemod | `npx codemod@latest react/19/migration-recipe` |
| Vue 3 | vue-codemod | `npx vue-codemod src --transformation vue-composition-api-migration` |
| Angular | ng update | `ng update @angular/core@latest` |
| Tailwind 4 | upgrade | `npx @tailwindcss/upgrade` |
| TypeScript | ts-migrate | `npx ts-migrate-full .` |
| Jest → Vitest | vitest-codemod | Manual migration (API compatible) |

---

## Quick Reference Card

### Migration Priority Order

1. **Lock dependencies** - Create backup branch and version snapshot
2. **Update Node.js** - Foundation for other updates
3. **Update TypeScript** - Type checking for migrations
4. **Update build tools** - Vite, webpack, etc.
5. **Update framework** - React, Vue, Angular
6. **Update CSS framework** - Tailwind, etc.
7. **Update testing** - Jest to Vitest, etc.
8. **Update auxiliary packages** - Router, state management, etc.

### Emergency Contacts

- React: [react.dev/learn/upgrade](https://react.dev)
- Vue: [vuejs.org/guide/migration](https://vuejs.org)
- Angular: [angular.dev/update](https://angular.dev)
- Tailwind: [tailwindcss.com/docs/upgrade](https://tailwindcss.com)
- Node.js: [nodejs.org/en/about/releases](https://nodejs.org)
- TypeScript: [typescriptlang.org/docs/handbook/release-notes](https://www.typescriptlang.org)

---

*Document maintained by ProjectX Team. For contributions, submit PRs to the docs repository.*
