# No-Code/Low-Code Platform Migration Guide

> **Version**: 1.0.0
> **Last Updated**: 2026-01-20
> **Audience**: Development teams migrating from no-code platforms to custom codebases

---

## Table of Contents

1. [Why Migrate from No-Code Platforms](#why-migrate-from-no-code-platforms)
2. [Migration Overview](#migration-overview)
3. [Platform-Specific Migration Guides](#platform-specific-migration-guides)
   - [Base44 Migration](#base44-appbase44com)
   - [Loveable.dev Migration](#loveabledev)
   - [Replit Migration](#replitcom)
   - [Bubble.io Migration](#bubbleio)
   - [Webflow Migration](#webflow)
   - [Retool Migration](#retool)
4. [Data Export Strategies](#data-export-strategies)
5. [Database Migration](#database-migration)
6. [Authentication Migration](#authentication-migration)
7. [API Endpoint Recreation](#api-endpoint-recreation)
8. [Frontend Component Conversion](#frontend-component-conversion)
9. [File and Asset Migration](#file-and-asset-migration)
10. [Environment Variables and Secrets](#environment-variables-and-secrets)
11. [DNS and Domain Transfer](#dns-and-domain-transfer)
12. [Code Organization](#code-organization)
13. [Testing Migrated Functionality](#testing-migrated-functionality)
14. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
15. [Migration Checklists](#migration-checklists)

---

## Why Migrate from No-Code Platforms

### The Breaking Point Indicators

You should consider migration when you encounter:

| Indicator | Description | Impact Level |
|-----------|-------------|--------------|
| **Performance Ceiling** | Platform cannot handle your traffic/data volume | Critical |
| **Feature Limitations** | Cannot implement required business logic | High |
| **Cost Escalation** | Pricing grows faster than revenue | High |
| **Vendor Lock-in** | Data/logic trapped in proprietary formats | Critical |
| **Compliance Requirements** | Cannot meet SOC2, HIPAA, GDPR requirements | Critical |
| **Integration Barriers** | Cannot connect to required third-party services | Medium |
| **Team Scalability** | Platform limits collaborative development | Medium |

### Cost Comparison Analysis

```
No-Code Platform Costs (Typical at Scale):
- Base44 Pro: $99-299/month + usage fees
- Loveable.dev: $20-100/month + AI credits
- Replit: $25-50/month per developer
- Bubble.io: $119-529/month + capacity units
- Webflow: $29-212/month + CMS items
- Retool: $10-50/user/month

Self-Hosted Equivalent (Monthly):
- Vercel/Railway/Render: $20-100
- Supabase/PlanetScale: $25-100
- Domain/SSL: $1-5
- Total: $46-205/month (unlimited users)
```

### Technical Debt Assessment

Before migrating, audit your no-code app:

```markdown
## Technical Debt Audit Checklist

- [ ] How many workflows/automations exist?
- [ ] What external integrations are configured?
- [ ] How much data is stored (records/GB)?
- [ ] What file storage is used (images, documents)?
- [ ] How many users/authentication records?
- [ ] What custom code/plugins are installed?
- [ ] Document all API endpoints and webhooks
- [ ] List all third-party service connections
```

---

## Migration Overview

### The 7-Phase Migration Process

```
Phase 1: AUDIT (1-2 weeks)
    |
    v
Phase 2: EXPORT (1 week)
    |
    v
Phase 3: SETUP (1 week)
    |
    v
Phase 4: DATABASE (2-3 weeks)
    |
    v
Phase 5: APPLICATION (3-4 weeks)
    |
    v
Phase 6: TESTING (1-2 weeks)
    |
    v
Phase 7: CUTOVER (1 day)
```

### Resource Requirements

| Phase | Skills Needed | Time Estimate | Team Size |
|-------|--------------|---------------|-----------|
| Audit | Business Analyst, Developer | 1-2 weeks | 2 |
| Export | Platform Expert, DBA | 1 week | 1-2 |
| Setup | DevOps, Backend Dev | 1 week | 1-2 |
| Database | DBA, Backend Dev | 2-3 weeks | 2-3 |
| Application | Full-stack Devs | 3-4 weeks | 2-4 |
| Testing | QA, All stakeholders | 1-2 weeks | 2-3 |
| Cutover | DevOps, All hands | 1 day | All |

---

## Platform-Specific Migration Guides

### Base44 (app.base44.com)

Base44 is an AI-powered app builder that creates React applications with Supabase backends.

#### Data Export from Base44

```bash
# Base44 typically stores data in Supabase
# Access your Supabase project directly if available

# 1. Export database via Supabase CLI
supabase db dump -f base44_export.sql

# 2. Export storage buckets
supabase storage ls
supabase storage cp -r supabase://bucket-name ./local-backup/

# 3. Export Edge Functions
supabase functions list
# Download each function source
```

#### Base44-Specific Considerations

```javascript
// Base44 generates React components with specific patterns
// Original Base44 component structure:
/*
src/
  components/
    generated/
      EntityList.jsx
      EntityForm.jsx
  api/
    entities.js
  lib/
    supabase.js
*/

// Migration target structure:
/*
src/
  components/
    entities/
      EntityList.tsx
      EntityForm.tsx
      EntityCard.tsx
  services/
    entityService.ts
  lib/
    supabase.ts
  types/
    entity.ts
*/
```

#### Converting Base44 API Patterns

```typescript
// Base44 generated API (typical pattern)
// BEFORE: base44 auto-generated
const getEntities = async () => {
  const { data, error } = await supabase
    .from('entities')
    .select('*');
  return data;
};

// AFTER: Proper service layer with error handling
// src/services/entityService.ts
import { supabase } from '@/lib/supabase';
import { Entity, EntityCreateInput, EntityUpdateInput } from '@/types/entity';

export class EntityService {
  static async getAll(): Promise<Entity[]> {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch entities: ${error.message}`);
    }

    return data ?? [];
  }

  static async getById(id: string): Promise<Entity | null> {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch entity: ${error.message}`);
    }

    return data;
  }

  static async create(input: EntityCreateInput): Promise<Entity> {
    const { data, error } = await supabase
      .from('entities')
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create entity: ${error.message}`);
    }

    return data;
  }

  static async update(id: string, input: EntityUpdateInput): Promise<Entity> {
    const { data, error } = await supabase
      .from('entities')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update entity: ${error.message}`);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('entities')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete entity: ${error.message}`);
    }
  }
}
```

---

### Loveable.dev

Loveable.dev generates full-stack applications from prompts, typically outputting React + Node.js code.

#### Extracting Code from Loveable

```bash
# Loveable provides direct code download
# 1. From the Loveable dashboard, click "Export" or "Download Code"
# 2. Alternatively, connect to GitHub and clone

git clone https://github.com/your-org/loveable-project.git
cd loveable-project

# 3. Audit the generated structure
tree -I node_modules
```

#### Loveable Code Cleanup Patterns

```typescript
// Loveable generates functional but often repetitive code
// Common patterns to refactor:

// BEFORE: Loveable inline styles and repeated logic
function UserCard({ user }) {
  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3 style={{ margin: 0, fontSize: '18px' }}>{user.name}</h3>
      <p style={{ color: '#666' }}>{user.email}</p>
      <button
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px'
        }}
        onClick={() => handleEdit(user.id)}
      >
        Edit
      </button>
    </div>
  );
}

// AFTER: Proper component with Tailwind/CSS modules
// src/components/users/UserCard.tsx
import { User } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{user.name}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{user.email}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit(user.id)}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### Loveable Database Migration

```sql
-- Loveable often uses SQLite or simple PostgreSQL schemas
-- Export and enhance with proper constraints

-- BEFORE: Loveable generated schema
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TEXT
);

-- AFTER: Production-ready schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at TIMESTAMPTZ,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### Replit.com

Replit provides a full development environment with deployment. Migration involves extracting code and reconfiguring deployment.

#### Replit Export Process

```bash
# Method 1: Git-based export (if connected)
git clone https://replit.com/@username/project-name.git

# Method 2: Download as ZIP
# Click the three dots menu -> Download as ZIP

# Method 3: Use Replit's API (for programmatic access)
curl -H "Authorization: Bearer $REPLIT_TOKEN" \
  "https://replit.com/data/repls/@username/project-name/zip" \
  -o replit-export.zip
```

#### Replit Environment Migration

```bash
# Replit stores secrets in environment
# Export from Replit Secrets tab

# Create .env.example for team reference
cat > .env.example << 'EOF'
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# Third-party APIs
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....

# App Configuration
NODE_ENV=development
PORT=3000
EOF

# Never commit actual .env file
echo ".env" >> .gitignore
```

#### Replit-Specific File Handling

```javascript
// Replit uses special files that need conversion

// .replit configuration -> package.json scripts
// BEFORE: .replit
/*
run = "npm start"
entrypoint = "index.js"

[nix]
channel = "stable-22_11"

[deployment]
run = ["sh", "-c", "npm start"]
*/

// AFTER: package.json with proper scripts
{
  "name": "migrated-app",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  }
}

// replit.nix -> Dockerfile or devcontainer.json
// BEFORE: replit.nix
/*
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.postgresql
  ];
}
*/

// AFTER: Dockerfile
/*
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
*/
```

---

### Bubble.io

Bubble.io is a visual programming platform with its own database and workflow system.

#### Bubble Data Export

```javascript
// Bubble provides CSV export for each data type
// Use Bubble's Data API for programmatic export

const BUBBLE_API_KEY = process.env.BUBBLE_API_KEY;
const BUBBLE_APP_NAME = 'your-app-name';

async function exportBubbleData(dataType) {
  const allRecords = [];
  let cursor = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `https://${BUBBLE_APP_NAME}.bubbleapps.io/api/1.1/obj/${dataType}?cursor=${cursor}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${BUBBLE_API_KEY}`
        }
      }
    );

    const data = await response.json();
    allRecords.push(...data.response.results);

    if (data.response.remaining === 0) break;
    cursor += limit;
  }

  return allRecords;
}

// Export all data types
async function exportAllBubbleData() {
  const dataTypes = ['User', 'Product', 'Order', 'Review'];
  const exportedData = {};

  for (const type of dataTypes) {
    console.log(`Exporting ${type}...`);
    exportedData[type] = await exportBubbleData(type);
  }

  // Save to files
  const fs = require('fs');
  for (const [type, records] of Object.entries(exportedData)) {
    fs.writeFileSync(
      `./exports/${type.toLowerCase()}.json`,
      JSON.stringify(records, null, 2)
    );
  }
}
```

#### Bubble Workflow to Code Conversion

```typescript
// Bubble workflows need manual conversion to code
// Document each workflow before converting

/*
BUBBLE WORKFLOW: "Create Order"
Trigger: Button click
Steps:
1. Create new Order
2. Set Order's user = Current User
3. Set Order's items = Shopping Cart's items
4. Set Order's total = Shopping Cart's total
5. Send email to Current User
6. Navigate to Order Confirmation
*/

// CONVERTED TO: TypeScript function
// src/services/orderService.ts
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { Order, CartItem } from '@/types';

interface CreateOrderInput {
  userId: string;
  items: CartItem[];
  total: number;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  // Step 1-4: Create order with relationships
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      total: input.total,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);

  // Create order items
  const orderItems = input.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);

  // Step 5: Send confirmation email
  await sendEmail({
    to: input.userId, // Will be resolved to email
    template: 'order-confirmation',
    data: { order }
  });

  return order;
}

// Usage in component (Step 6 handled by router)
// src/app/checkout/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/services/orderService';

export default function CheckoutPage() {
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const order = await createOrder({
        userId: user.id,
        items: cart.items,
        total: cart.total
      });
      router.push(`/orders/${order.id}/confirmation`);
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  return (
    <Button onClick={handleCheckout}>Complete Order</Button>
  );
}
```

#### Bubble Option Sets to TypeScript Enums

```typescript
// Bubble Option Sets become TypeScript enums or constants

// BUBBLE: Option Set "Order Status"
// - pending
// - processing
// - shipped
// - delivered
// - cancelled

// TYPESCRIPT: Type-safe enum
export const OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// With display labels
export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled'
};

// With allowed transitions
export const OrderStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: []
};
```

---

### Webflow

Webflow excels at marketing sites but struggles with dynamic applications.

#### Webflow Export Options

```bash
# Webflow code export (requires paid plan)
# 1. Site Settings -> Code Export -> Prepare ZIP
# 2. Download and extract

unzip webflow-export.zip -d ./webflow-source

# Webflow exports static HTML/CSS/JS
# Structure:
# webflow-source/
#   ├── index.html
#   ├── css/
#   │   └── webflow.css (custom styles)
#   │   └── normalize.css
#   ├── js/
#   │   └── webflow.js
#   └── images/
```

#### Converting Webflow to React/Next.js

```typescript
// Step 1: Extract Webflow design tokens
// webflow.css -> tailwind.config.ts

// BEFORE: Webflow CSS variables
/*
:root {
  --brand-primary: #007bff;
  --brand-secondary: #6c757d;
  --font-main: 'Inter', sans-serif;
  --font-heading: 'Poppins', sans-serif;
}
*/

// AFTER: Tailwind config
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#007bff',
          secondary: '#6c757d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

```tsx
// Step 2: Convert Webflow sections to React components
// BEFORE: Webflow HTML
/*
<section class="hero-section">
  <div class="container">
    <h1 class="hero-heading">Welcome to Our Platform</h1>
    <p class="hero-subtext">Build something amazing</p>
    <a href="/signup" class="button primary">Get Started</a>
  </div>
</section>
*/

// AFTER: React component
// src/components/marketing/HeroSection.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  heading: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
}

export function HeroSection({
  heading,
  subtext,
  ctaText,
  ctaHref
}: HeroSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {heading}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {subtext}
        </p>
        <Button asChild size="lg">
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      </div>
    </section>
  );
}
```

#### Webflow CMS to Headless CMS

```typescript
// Webflow CMS items -> Contentful/Sanity/Strapi

// Export Webflow CMS via API
async function exportWebflowCMS() {
  const WEBFLOW_TOKEN = process.env.WEBFLOW_API_TOKEN;
  const SITE_ID = process.env.WEBFLOW_SITE_ID;

  // Get all collections
  const collectionsRes = await fetch(
    `https://api.webflow.com/sites/${SITE_ID}/collections`,
    { headers: { 'Authorization': `Bearer ${WEBFLOW_TOKEN}` } }
  );
  const collections = await collectionsRes.json();

  // Export each collection's items
  for (const collection of collections) {
    const itemsRes = await fetch(
      `https://api.webflow.com/collections/${collection._id}/items`,
      { headers: { 'Authorization': `Bearer ${WEBFLOW_TOKEN}` } }
    );
    const items = await itemsRes.json();

    // Save to file
    fs.writeFileSync(
      `./exports/cms/${collection.slug}.json`,
      JSON.stringify(items, null, 2)
    );
  }
}

// Import to new CMS (example: Sanity)
// sanity/schemas/blogPost.ts
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
  ],
};
```

---

### Retool

Retool is an internal tool builder with SQL/API integration.

#### Retool Query Export

```javascript
// Retool queries need manual extraction
// Document each query and its purpose

/*
RETOOL QUERY: "getUsers"
Type: PostgreSQL
Database: main_db
Query:
  SELECT
    u.id,
    u.email,
    u.name,
    u.created_at,
    COUNT(o.id) as order_count
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  WHERE u.deleted_at IS NULL
  GROUP BY u.id
  ORDER BY u.created_at DESC
  LIMIT {{ limit.value }}
  OFFSET {{ (page.value - 1) * limit.value }}
*/

// CONVERTED TO: Proper API endpoint
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders } from '@/lib/db/schema';
import { eq, isNull, sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      orderCount: sql<number>`count(${orders.id})`.as('order_count'),
    })
    .from(users)
    .leftJoin(orders, eq(orders.userId, users.id))
    .where(isNull(users.deletedAt))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(isNull(users.deletedAt));

  return NextResponse.json({
    data: result,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  });
}
```

#### Retool Component to React Conversion

```tsx
// Retool table -> React table with TanStack
// BEFORE: Retool table configuration
/*
Component: Table1
Data: {{ getUsers.data }}
Columns:
  - id (hidden)
  - email (text)
  - name (text)
  - created_at (date)
  - order_count (number)
Actions:
  - Edit (opens modal)
  - Delete (confirmation)
*/

// AFTER: React component with TanStack Table
// src/components/admin/UsersTable.tsx
'use client';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/Table';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  orderCount: number;
}

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const columnHelper = createColumnHelper<User>();

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const columns = [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: (info) => format(new Date(info.getValue()), 'MMM d, yyyy'),
    }),
    columnHelper.accessor('orderCount', {
      header: 'Orders',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

---

## Data Export Strategies

### Universal Export Approach

```bash
#!/bin/bash
# export-data.sh - Universal data export script

set -e

EXPORT_DIR="./data-exports/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$EXPORT_DIR"

echo "Starting data export..."

# 1. Database export
echo "Exporting database..."
if command -v pg_dump &> /dev/null; then
  pg_dump "$DATABASE_URL" > "$EXPORT_DIR/database.sql"
  echo "Database exported to $EXPORT_DIR/database.sql"
fi

# 2. API data export (for platforms with APIs)
echo "Exporting via API..."
node scripts/export-api-data.js --output "$EXPORT_DIR/api-data"

# 3. File/asset export
echo "Exporting files..."
if [ -n "$S3_BUCKET" ]; then
  aws s3 sync "s3://$S3_BUCKET" "$EXPORT_DIR/files"
fi

# 4. Create manifest
cat > "$EXPORT_DIR/manifest.json" << EOF
{
  "exportDate": "$(date -Iseconds)",
  "platform": "${PLATFORM_NAME:-unknown}",
  "version": "${APP_VERSION:-unknown}",
  "files": $(find "$EXPORT_DIR" -type f -name "*.json" -o -name "*.sql" | jq -R -s -c 'split("\n")[:-1]')
}
EOF

echo "Export complete: $EXPORT_DIR"
```

### Data Validation Script

```typescript
// scripts/validate-export.ts
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  table: string;
  recordCount: number;
  issues: string[];
  valid: boolean;
}

async function validateExport(exportDir: string): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  const dataDir = path.join(exportDir, 'api-data');

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const tableName = path.basename(file, '.json');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    const issues: string[] = [];

    // Validation checks
    if (!Array.isArray(data)) {
      issues.push('Data is not an array');
    } else {
      // Check for required fields
      const requiredFields = ['id', 'created_at'];
      for (const record of data) {
        for (const field of requiredFields) {
          if (!(field in record)) {
            issues.push(`Record missing required field: ${field}`);
            break;
          }
        }
      }

      // Check for duplicate IDs
      const ids = data.map((r: any) => r.id);
      const duplicates = ids.filter((id: string, i: number) => ids.indexOf(id) !== i);
      if (duplicates.length > 0) {
        issues.push(`Duplicate IDs found: ${duplicates.slice(0, 5).join(', ')}`);
      }
    }

    results.push({
      table: tableName,
      recordCount: Array.isArray(data) ? data.length : 0,
      issues,
      valid: issues.length === 0,
    });
  }

  return results;
}

// Run validation
const exportDir = process.argv[2];
if (!exportDir) {
  console.error('Usage: npx ts-node validate-export.ts <export-dir>');
  process.exit(1);
}

validateExport(exportDir).then(results => {
  console.table(results.map(r => ({
    Table: r.table,
    Records: r.recordCount,
    Valid: r.valid ? 'Yes' : 'No',
    Issues: r.issues.length,
  })));

  const hasErrors = results.some(r => !r.valid);
  if (hasErrors) {
    console.log('\nValidation Issues:');
    for (const result of results.filter(r => !r.valid)) {
      console.log(`\n${result.table}:`);
      result.issues.forEach(i => console.log(`  - ${i}`));
    }
    process.exit(1);
  }

  console.log('\nAll exports validated successfully!');
});
```

---

## Database Migration

### Schema Conversion

```sql
-- Generic no-code platform schema -> PostgreSQL

-- Step 1: Create base types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Step 2: Create tables with proper constraints
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  inventory_count INTEGER DEFAULT 0 CHECK (inventory_count >= 0),
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status order_status DEFAULT 'pending',
  subtotal_cents INTEGER NOT NULL,
  tax_cents INTEGER DEFAULT 0,
  shipping_cents INTEGER DEFAULT 0,
  total_cents INTEGER GENERATED ALWAYS AS (subtotal_cents + tax_cents + shipping_cents) STORED,
  shipping_address JSONB,
  billing_address JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_cents INTEGER GENERATED ALWAYS AS (quantity * unit_price_cents) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Step 4: Create updated_at triggers
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
```

### Data Import Script

```typescript
// scripts/import-data.ts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface ImportConfig {
  sourceFile: string;
  targetTable: string;
  transform?: (record: any) => any;
  batchSize?: number;
}

const importConfigs: ImportConfig[] = [
  {
    sourceFile: 'users.json',
    targetTable: 'users',
    transform: (record) => ({
      id: record._id || record.id,
      email: record.email?.toLowerCase(),
      name: record.name || record.full_name,
      role: record.role || 'user',
      avatar_url: record.avatar || record.profile_image,
      metadata: {
        original_id: record._id,
        imported_at: new Date().toISOString(),
        source: 'nocode_platform',
      },
      created_at: record.created_at || record.Created || new Date().toISOString(),
    }),
  },
  {
    sourceFile: 'products.json',
    targetTable: 'products',
    transform: (record) => ({
      id: record._id || record.id,
      name: record.name || record.title,
      slug: record.slug || record.name?.toLowerCase().replace(/\s+/g, '-'),
      description: record.description,
      price_cents: Math.round((record.price || 0) * 100),
      currency: record.currency || 'USD',
      inventory_count: record.inventory || record.stock || 0,
      images: Array.isArray(record.images) ? record.images : [record.image].filter(Boolean),
      is_active: record.is_active ?? record.published ?? true,
      created_at: record.created_at || new Date().toISOString(),
    }),
  },
  {
    sourceFile: 'orders.json',
    targetTable: 'orders',
    transform: (record) => ({
      id: record._id || record.id,
      user_id: record.user_id || record.user,
      status: record.status?.toLowerCase() || 'pending',
      subtotal_cents: Math.round((record.subtotal || record.total || 0) * 100),
      tax_cents: Math.round((record.tax || 0) * 100),
      shipping_cents: Math.round((record.shipping || 0) * 100),
      shipping_address: record.shipping_address,
      billing_address: record.billing_address,
      created_at: record.created_at || new Date().toISOString(),
    }),
  },
];

async function importData(config: ImportConfig) {
  const { sourceFile, targetTable, transform, batchSize = 100 } = config;

  console.log(`\nImporting ${targetTable}...`);

  const filePath = path.join('./data-exports/api-data', sourceFile);
  if (!fs.existsSync(filePath)) {
    console.log(`  Skipping: ${sourceFile} not found`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const records = transform ? rawData.map(transform) : rawData;

  let imported = 0;
  let errors = 0;

  // Import in batches
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    const { error } = await supabase
      .from(targetTable)
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`  Batch error: ${error.message}`);
      errors += batch.length;
    } else {
      imported += batch.length;
    }

    // Progress indicator
    process.stdout.write(`\r  Progress: ${imported + errors}/${records.length}`);
  }

  console.log(`\n  Completed: ${imported} imported, ${errors} errors`);
}

async function main() {
  console.log('Starting data import...');

  // Import in order (respecting foreign keys)
  for (const config of importConfigs) {
    await importData(config);
  }

  console.log('\nImport complete!');
}

main().catch(console.error);
```

---

## Authentication Migration

### Platform Auth to Custom Auth

```typescript
// src/lib/auth/migration.ts
// Migrate users from no-code platform auth to custom auth

import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

interface LegacyUser {
  id: string;
  email: string;
  password_hash?: string;  // Some platforms store this
  oauth_provider?: string;
  oauth_id?: string;
}

export async function migrateUsers(legacyUsers: LegacyUser[]) {
  const results = {
    migrated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  for (const user of legacyUsers) {
    try {
      // Check if user already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existing) {
        results.skipped++;
        continue;
      }

      if (user.oauth_provider && user.oauth_id) {
        // OAuth user - create without password
        await supabase.auth.admin.createUser({
          email: user.email,
          email_confirm: true,
          user_metadata: {
            provider: user.oauth_provider,
            legacy_id: user.id,
          },
        });
      } else if (user.password_hash) {
        // Password user - need to reset password
        await supabase.auth.admin.createUser({
          email: user.email,
          email_confirm: true,
          user_metadata: {
            legacy_id: user.id,
            needs_password_reset: true,
          },
        });

        // Send password reset email
        await supabase.auth.resetPasswordForEmail(user.email);
      } else {
        // No auth info - create and require password setup
        await supabase.auth.admin.createUser({
          email: user.email,
          email_confirm: true,
          user_metadata: {
            legacy_id: user.id,
            needs_password_setup: true,
          },
        });

        await supabase.auth.resetPasswordForEmail(user.email);
      }

      results.migrated++;
    } catch (error) {
      results.errors.push(`${user.email}: ${error}`);
    }
  }

  return results;
}
```

### Auth Provider Migration Matrix

```typescript
// src/lib/auth/providers.ts
// Configure auth providers based on migration source

export const authConfig = {
  providers: {
    // Supabase Auth (from Base44, Loveable)
    supabase: {
      email: true,
      google: true,
      github: true,
      magic_link: true,
    },

    // NextAuth.js configuration
    nextauth: {
      providers: [
        // Google OAuth
        {
          id: 'google',
          name: 'Google',
          type: 'oauth',
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        // GitHub OAuth
        {
          id: 'github',
          name: 'GitHub',
          type: 'oauth',
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        // Email/Password
        {
          id: 'credentials',
          name: 'Email',
          type: 'credentials',
          credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
          },
        },
      ],
    },
  },

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
  },
};
```

---

## API Endpoint Recreation

### REST API Template

```typescript
// src/app/api/[resource]/route.ts
// Generic REST API pattern for migrated endpoints

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { getServerSession } from '@/lib/auth';

// Validation schemas
const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  // Add other fields
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

// GET - List/Search
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(params);

    let dbQuery = supabase
      .from('resources')
      .select('*', { count: 'exact' })
      .order(query.sort, { ascending: query.order === 'asc' })
      .range((query.page - 1) * query.limit, query.page * query.limit - 1);

    if (query.search) {
      dbQuery = dbQuery.ilike('name', `%${query.search}%`);
    }

    const { data, error, count } = await dbQuery;

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / query.limit),
      },
    });
  } catch (error) {
    console.error('GET /api/resources error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST - Create
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createSchema.parse(body);

    const { data, error } = await supabase
      .from('resources')
      .insert({
        ...validated,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/resources error:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/[resource]/[id]/route.ts
// Individual resource endpoints

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { getServerSession } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

// GET - Single resource
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(`GET /api/resources/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

// PATCH - Update
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateSchema = z.object({
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
    });
    const validated = updateSchema.parse(body);

    const { data, error } = await supabase
      .from('resources')
      .update(validated)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error(`PATCH /api/resources/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/resources/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
```

---

## Frontend Component Conversion

### Component Library Setup

```bash
# Install component libraries
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install lucide-react

# Install form handling
npm install react-hook-form @hookform/resolvers zod

# Install data fetching
npm install @tanstack/react-query
```

### Base Component Templates

```typescript
// src/components/ui/Button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

```typescript
// src/components/ui/Card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

### Form Component Pattern

```typescript
// src/components/forms/EntityForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form';
import { toast } from '@/components/ui/Toast';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(1000).optional(),
  email: z.string().email('Invalid email address'),
  price: z.coerce.number().min(0, 'Price must be positive'),
});

type FormValues = z.infer<typeof formSchema>;

interface EntityFormProps {
  entity?: Partial<FormValues> & { id?: string };
  onSuccess?: () => void;
}

export function EntityForm({ entity, onSuccess }: EntityFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!entity?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: entity?.name ?? '',
      description: entity?.description ?? '',
      email: entity?.email ?? '',
      price: entity?.price ?? 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const url = isEditing
        ? `/api/entities/${entity.id}`
        : '/api/entities';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? 'Failed to save entity');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      toast.success(isEditing ? 'Entity updated' : 'Entity created');
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description (optional)"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## File and Asset Migration

### Asset Export Script

```typescript
// scripts/export-assets.ts
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

interface Asset {
  url: string;
  filename: string;
  type: string;
}

async function downloadAsset(asset: Asset, outputDir: string): Promise<void> {
  const response = await fetch(asset.url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${asset.url}`);
  }

  const buffer = await response.buffer();
  const outputPath = path.join(outputDir, asset.type, asset.filename);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
}

async function exportAssets(assets: Asset[], outputDir: string) {
  console.log(`Exporting ${assets.length} assets...`);

  let success = 0;
  let failed = 0;

  for (const asset of assets) {
    try {
      await downloadAsset(asset, outputDir);
      success++;
      process.stdout.write(`\rProgress: ${success + failed}/${assets.length}`);
    } catch (error) {
      console.error(`\nFailed: ${asset.filename} - ${error}`);
      failed++;
    }
  }

  console.log(`\n\nExport complete: ${success} success, ${failed} failed`);
}

// Parse exported data for asset URLs
function extractAssets(data: any[], assetFields: string[]): Asset[] {
  const assets: Asset[] = [];

  for (const record of data) {
    for (const field of assetFields) {
      const value = record[field];
      if (!value) continue;

      if (typeof value === 'string' && value.startsWith('http')) {
        assets.push({
          url: value,
          filename: `${record.id}_${field}${path.extname(value) || '.jpg'}`,
          type: field,
        });
      } else if (Array.isArray(value)) {
        value.forEach((url, i) => {
          if (typeof url === 'string' && url.startsWith('http')) {
            assets.push({
              url,
              filename: `${record.id}_${field}_${i}${path.extname(url) || '.jpg'}`,
              type: field,
            });
          }
        });
      }
    }
  }

  return assets;
}

// Main execution
async function main() {
  const dataDir = './data-exports/api-data';
  const outputDir = './data-exports/assets';

  // Load exported data
  const products = JSON.parse(fs.readFileSync(`${dataDir}/products.json`, 'utf-8'));
  const users = JSON.parse(fs.readFileSync(`${dataDir}/users.json`, 'utf-8'));

  // Extract asset URLs
  const productAssets = extractAssets(products, ['image', 'images', 'thumbnail']);
  const userAssets = extractAssets(users, ['avatar', 'profile_image']);

  // Export all assets
  await exportAssets([...productAssets, ...userAssets], outputDir);
}

main().catch(console.error);
```

### Upload to New Storage

```typescript
// scripts/upload-assets.ts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface UploadResult {
  oldUrl: string;
  newUrl: string;
  success: boolean;
  error?: string;
}

async function uploadToStorage(
  localPath: string,
  bucket: string,
  remotePath: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);
  const contentType = getContentType(localPath);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(remotePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(remotePath);

  return data.publicUrl;
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };
  return types[ext] || 'application/octet-stream';
}

async function uploadAllAssets(assetsDir: string, bucket: string) {
  const results: UploadResult[] = [];

  const types = fs.readdirSync(assetsDir);

  for (const type of types) {
    const typeDir = path.join(assetsDir, type);
    if (!fs.statSync(typeDir).isDirectory()) continue;

    const files = fs.readdirSync(typeDir);

    for (const file of files) {
      const localPath = path.join(typeDir, file);
      const remotePath = `${type}/${file}`;

      try {
        const newUrl = await uploadToStorage(localPath, bucket, remotePath);
        results.push({
          oldUrl: localPath,
          newUrl,
          success: true,
        });
      } catch (error) {
        results.push({
          oldUrl: localPath,
          newUrl: '',
          success: false,
          error: String(error),
        });
      }
    }
  }

  // Save URL mapping for database updates
  const mapping = results
    .filter(r => r.success)
    .reduce((acc, r) => {
      acc[r.oldUrl] = r.newUrl;
      return acc;
    }, {} as Record<string, string>);

  fs.writeFileSync(
    './data-exports/url-mapping.json',
    JSON.stringify(mapping, null, 2)
  );

  console.log(`Uploaded: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
}

uploadAllAssets('./data-exports/assets', 'public-assets');
```

---

## Environment Variables and Secrets

### Environment Setup

```bash
# .env.example - Document all required variables

# ===================
# Application
# ===================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="My App"

# ===================
# Database
# ===================
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
# Direct connection for migrations
DATABASE_URL_DIRECT=postgresql://user:password@localhost:5432/myapp

# ===================
# Supabase
# ===================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# ===================
# Authentication
# ===================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ===================
# Email
# ===================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=
EMAIL_FROM=noreply@myapp.com

# ===================
# Payments
# ===================
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ===================
# Storage
# ===================
S3_BUCKET=
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# ===================
# Monitoring
# ===================
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=

# ===================
# Analytics
# ===================
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_POSTHOG_KEY=
```

### Secrets Migration Script

```typescript
// scripts/migrate-secrets.ts
// Migrate secrets from no-code platform to new environment

import { execSync } from 'child_process';
import fs from 'fs';

interface SecretMapping {
  oldKey: string;
  newKey: string;
  transform?: (value: string) => string;
}

// Define mapping from old platform keys to new keys
const secretMappings: SecretMapping[] = [
  // Database
  { oldKey: 'DB_CONNECTION_STRING', newKey: 'DATABASE_URL' },
  { oldKey: 'SUPABASE_URL', newKey: 'NEXT_PUBLIC_SUPABASE_URL' },
  { oldKey: 'SUPABASE_ANON_KEY', newKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY' },
  { oldKey: 'SUPABASE_SERVICE_ROLE_KEY', newKey: 'SUPABASE_SERVICE_KEY' },

  // Auth
  { oldKey: 'JWT_SECRET', newKey: 'NEXTAUTH_SECRET' },
  { oldKey: 'GOOGLE_OAUTH_CLIENT_ID', newKey: 'GOOGLE_CLIENT_ID' },
  { oldKey: 'GOOGLE_OAUTH_CLIENT_SECRET', newKey: 'GOOGLE_CLIENT_SECRET' },

  // Payments
  { oldKey: 'STRIPE_KEY', newKey: 'STRIPE_SECRET_KEY' },
  { oldKey: 'STRIPE_PUBLIC_KEY', newKey: 'STRIPE_PUBLISHABLE_KEY' },

  // Email
  { oldKey: 'SENDGRID_API_KEY', newKey: 'SMTP_PASSWORD' },
];

function generateEnvFile(oldEnv: Record<string, string>): string {
  const lines: string[] = ['# Auto-generated from migration', ''];

  for (const mapping of secretMappings) {
    const value = oldEnv[mapping.oldKey];
    if (value) {
      const transformedValue = mapping.transform ? mapping.transform(value) : value;
      lines.push(`${mapping.newKey}=${transformedValue}`);
    } else {
      lines.push(`# ${mapping.newKey}= # Missing: was ${mapping.oldKey}`);
    }
  }

  return lines.join('\n');
}

// Load old environment (from export or manual input)
function loadOldEnv(source: string): Record<string, string> {
  if (fs.existsSync(source)) {
    const content = fs.readFileSync(source, 'utf-8');
    const env: Record<string, string> = {};

    for (const line of content.split('\n')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2];
      }
    }

    return env;
  }

  throw new Error(`Source file not found: ${source}`);
}

// Main
const oldEnv = loadOldEnv('./exports/old-env.txt');
const newEnvContent = generateEnvFile(oldEnv);

fs.writeFileSync('.env.local', newEnvContent);
console.log('Generated .env.local');
console.log('\nReview the file and fill in any missing values.');
```

---

## DNS and Domain Transfer

### Domain Transfer Checklist

```markdown
## DNS Migration Checklist

### Pre-Migration (1 week before)
- [ ] Document current DNS records
- [ ] Reduce TTL to 300 seconds (5 minutes)
- [ ] Verify domain ownership
- [ ] Obtain transfer authorization code (if changing registrars)
- [ ] Disable domain lock

### DNS Records to Migrate

| Type | Host | Current Value | New Value | TTL |
|------|------|---------------|-----------|-----|
| A | @ | old.ip.addr | new.ip.addr | 300 |
| CNAME | www | old-host.com | new-host.com | 300 |
| CNAME | api | old-api.com | new-api.com | 300 |
| MX | @ | mail.provider.com | mail.provider.com | 3600 |
| TXT | @ | v=spf1... | v=spf1... | 3600 |
| TXT | _dmarc | v=DMARC1... | v=DMARC1... | 3600 |

### Migration Steps
1. [ ] Export current DNS zone file
2. [ ] Set up new hosting (Vercel/Railway/etc.)
3. [ ] Obtain new DNS values from hosting provider
4. [ ] Update DNS records at registrar
5. [ ] Verify propagation (use dnschecker.org)
6. [ ] Test all subdomains
7. [ ] Monitor for 24-48 hours
8. [ ] Increase TTL back to normal (3600)

### Post-Migration
- [ ] Update SSL certificates
- [ ] Verify email delivery
- [ ] Test all API endpoints
- [ ] Update any hardcoded URLs
- [ ] Monitor error logs
```

### DNS Update Script (Cloudflare)

```typescript
// scripts/update-dns.ts
// Automate DNS updates via Cloudflare API

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
}

async function cloudflareApi(
  endpoint: string,
  method: string = 'GET',
  body?: object
) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4${endpoint}`,
    {
      method,
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || 'API error');
  }

  return data.result;
}

async function listRecords(): Promise<any[]> {
  return cloudflareApi(`/zones/${ZONE_ID}/dns_records`);
}

async function createRecord(record: DnsRecord): Promise<void> {
  await cloudflareApi(`/zones/${ZONE_ID}/dns_records`, 'POST', {
    ...record,
    ttl: record.ttl || 1, // 1 = auto
  });
}

async function updateRecord(id: string, record: DnsRecord): Promise<void> {
  await cloudflareApi(`/zones/${ZONE_ID}/dns_records/${id}`, 'PUT', {
    ...record,
    ttl: record.ttl || 1,
  });
}

async function deleteRecord(id: string): Promise<void> {
  await cloudflareApi(`/zones/${ZONE_ID}/dns_records/${id}`, 'DELETE');
}

// Migration records
const newRecords: DnsRecord[] = [
  {
    type: 'A',
    name: '@',
    content: '76.76.21.21', // Vercel IP
    proxied: true,
  },
  {
    type: 'CNAME',
    name: 'www',
    content: 'cname.vercel-dns.com',
    proxied: false,
  },
  {
    type: 'CNAME',
    name: 'api',
    content: 'your-api.railway.app',
    proxied: true,
  },
];

async function migrate() {
  console.log('Fetching current records...');
  const existing = await listRecords();

  for (const record of newRecords) {
    const match = existing.find(
      (e: any) => e.type === record.type && e.name === record.name
    );

    if (match) {
      console.log(`Updating ${record.type} ${record.name}...`);
      await updateRecord(match.id, record);
    } else {
      console.log(`Creating ${record.type} ${record.name}...`);
      await createRecord(record);
    }
  }

  console.log('DNS migration complete!');
}

migrate().catch(console.error);
```

---

## Code Organization

### Recommended Project Structure

```
project-root/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── test.yml
│   └── CODEOWNERS
├── docs/
│   ├── architecture/
│   ├── api/
│   └── migration/
├── scripts/
│   ├── export-data.ts
│   ├── import-data.ts
│   ├── migrate-assets.ts
│   └── validate-migration.ts
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/       # Dashboard routes group
│   │   │   ├── dashboard/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── forms/             # Form components
│   │   │   ├── UserForm.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── layouts/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── features/          # Feature-specific components
│   │       ├── users/
│   │       ├── products/
│   │       └── orders/
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts       # Database client
│   │   │   ├── schema.ts      # Drizzle schema
│   │   │   └── migrations/
│   │   ├── auth/
│   │   │   ├── index.ts
│   │   │   └── config.ts
│   │   ├── email/
│   │   │   ├── index.ts
│   │   │   └── templates/
│   │   ├── storage/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── format.ts
│   │       └── validation.ts
│   ├── services/              # Business logic
│   │   ├── userService.ts
│   │   ├── productService.ts
│   │   └── orderService.ts
│   ├── hooks/                 # React hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   └── useProducts.ts
│   ├── types/                 # TypeScript types
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── index.ts
│   └── config/
│       ├── site.ts
│       └── navigation.ts
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── unit/
├── .env.example
├── .env.local
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Module Organization Pattern

```typescript
// src/features/products/index.ts
// Feature module barrel export

// Components
export { ProductList } from './components/ProductList';
export { ProductCard } from './components/ProductCard';
export { ProductForm } from './components/ProductForm';
export { ProductDetail } from './components/ProductDetail';

// Hooks
export { useProducts } from './hooks/useProducts';
export { useProduct } from './hooks/useProduct';
export { useCreateProduct } from './hooks/useCreateProduct';
export { useUpdateProduct } from './hooks/useUpdateProduct';

// Services
export { ProductService } from './services/productService';

// Types
export type { Product, ProductCreateInput, ProductUpdateInput } from './types';

// Utils
export { formatPrice, calculateDiscount } from './utils';
```

---

## Testing Migrated Functionality

### Migration Test Suite

```typescript
// tests/migration/data-integrity.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { supabase } from '@/lib/supabase';
import fs from 'fs';

describe('Data Migration Integrity', () => {
  let exportedUsers: any[];
  let exportedProducts: any[];

  beforeAll(() => {
    exportedUsers = JSON.parse(
      fs.readFileSync('./data-exports/api-data/users.json', 'utf-8')
    );
    exportedProducts = JSON.parse(
      fs.readFileSync('./data-exports/api-data/products.json', 'utf-8')
    );
  });

  describe('Users', () => {
    it('should have same count as export', async () => {
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      expect(count).toBe(exportedUsers.length);
    });

    it('should preserve all emails', async () => {
      const { data } = await supabase.from('users').select('email');
      const dbEmails = new Set(data?.map(u => u.email.toLowerCase()));

      for (const user of exportedUsers) {
        expect(dbEmails.has(user.email.toLowerCase())).toBe(true);
      }
    });

    it('should map legacy IDs correctly', async () => {
      const { data } = await supabase
        .from('users')
        .select('id, metadata')
        .not('metadata->legacy_id', 'is', null);

      expect(data?.length).toBeGreaterThan(0);

      for (const user of data ?? []) {
        const legacyId = user.metadata?.legacy_id;
        const original = exportedUsers.find(u => u._id === legacyId || u.id === legacyId);
        expect(original).toBeDefined();
      }
    });
  });

  describe('Products', () => {
    it('should have same count as export', async () => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      expect(count).toBe(exportedProducts.length);
    });

    it('should convert prices correctly', async () => {
      const { data } = await supabase.from('products').select('*');

      for (const product of data ?? []) {
        const original = exportedProducts.find(
          p => p.slug === product.slug || p.name === product.name
        );

        if (original) {
          const expectedCents = Math.round(original.price * 100);
          expect(product.price_cents).toBe(expectedCents);
        }
      }
    });
  });
});
```

### API Endpoint Tests

```typescript
// tests/api/endpoints.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

describe('API Endpoints', () => {
  let server: any;
  let baseUrl: string;

  beforeAll(async () => {
    const app = next({ dev: false });
    const handle = app.getRequestHandler();
    await app.prepare();

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    });

    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        baseUrl = `http://localhost:${server.address().port}`;
        resolve();
      });
    });
  });

  afterAll(() => {
    server?.close();
  });

  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      const response = await fetch(`${baseUrl}/api/products?page=1&limit=10`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.pagination).toMatchObject({
        page: 1,
        limit: 10,
      });
    });

    it('should support search', async () => {
      const response = await fetch(`${baseUrl}/api/products?search=test`);
      const data = await response.json();

      expect(response.status).toBe(200);
      for (const product of data.data) {
        expect(product.name.toLowerCase()).toContain('test');
      }
    });
  });

  describe('POST /api/products', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Product' }),
      });

      expect(response.status).toBe(401);
    });

    it('should validate input', async () => {
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ name: '' }), // Invalid: empty name
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });
  });
});
```

### E2E Migration Tests

```typescript
// tests/e2e/migration-flows.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Migrated User Flows', () => {
  test('user can login with migrated credentials', async ({ page }) => {
    await page.goto('/login');

    // Use a known migrated user
    await page.fill('[name="email"]', 'migrated-user@example.com');
    await page.click('[type="submit"]');

    // Should redirect to password reset for migrated users
    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.locator('text=Set your new password')).toBeVisible();
  });

  test('product listings match exported data', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]');

    const productCount = await page.locator('[data-testid="product-card"]').count();
    expect(productCount).toBeGreaterThan(0);

    // Check first product has expected fields
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible();
  });

  test('order history is preserved', async ({ page }) => {
    // Login as user with order history
    await page.goto('/login');
    await page.fill('[name="email"]', 'user-with-orders@example.com');
    await page.fill('[name="password"]', 'testpassword123');
    await page.click('[type="submit"]');

    await page.goto('/orders');
    await page.waitForSelector('[data-testid="order-row"]');

    const orderCount = await page.locator('[data-testid="order-row"]').count();
    expect(orderCount).toBeGreaterThan(0);

    // Verify order details are intact
    const firstOrder = page.locator('[data-testid="order-row"]').first();
    await expect(firstOrder.locator('[data-testid="order-total"]')).toBeVisible();
    await expect(firstOrder.locator('[data-testid="order-status"]')).toBeVisible();
  });
});
```

---

## Common Pitfalls and Solutions

### Pitfall 1: Data Type Mismatches

```typescript
// Problem: No-code platforms often store everything as strings

// WRONG: Assuming types from export
const price = product.price; // Could be "19.99" or 19.99

// SOLUTION: Always coerce and validate
function normalizeProduct(raw: any): Product {
  return {
    id: String(raw.id || raw._id),
    name: String(raw.name).trim(),
    price: typeof raw.price === 'string'
      ? parseFloat(raw.price)
      : Number(raw.price) || 0,
    quantity: parseInt(String(raw.quantity || raw.stock || 0), 10),
    isActive: raw.is_active === true ||
              raw.is_active === 'true' ||
              raw.published === true,
    createdAt: raw.created_at
      ? new Date(raw.created_at)
      : new Date(),
  };
}
```

### Pitfall 2: Missing Foreign Key References

```typescript
// Problem: No-code platforms may have orphaned references

// SOLUTION: Validate relationships before import
async function validateRelationships(
  orders: any[],
  users: any[],
  products: any[]
) {
  const userIds = new Set(users.map(u => u.id || u._id));
  const productIds = new Set(products.map(p => p.id || p._id));

  const issues: string[] = [];

  for (const order of orders) {
    if (!userIds.has(order.user_id)) {
      issues.push(`Order ${order.id} references missing user ${order.user_id}`);
    }

    for (const item of order.items || []) {
      if (!productIds.has(item.product_id)) {
        issues.push(`Order ${order.id} references missing product ${item.product_id}`);
      }
    }
  }

  if (issues.length > 0) {
    console.error('Relationship issues found:');
    issues.forEach(i => console.error(`  - ${i}`));
    throw new Error(`Found ${issues.length} relationship issues`);
  }
}
```

### Pitfall 3: Timezone Inconsistencies

```typescript
// Problem: Dates may be in different timezones or formats

// SOLUTION: Normalize all dates to UTC
import { parseISO, isValid } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

function normalizeDate(
  dateValue: any,
  sourceTimezone: string = 'America/New_York'
): Date | null {
  if (!dateValue) return null;

  // Try parsing as ISO
  const isoDate = parseISO(String(dateValue));
  if (isValid(isoDate)) {
    return isoDate;
  }

  // Try as timestamp
  const timestamp = parseInt(String(dateValue), 10);
  if (!isNaN(timestamp)) {
    // Check if seconds or milliseconds
    const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
    return new Date(ms);
  }

  // Try with timezone conversion
  try {
    return zonedTimeToUtc(new Date(dateValue), sourceTimezone);
  } catch {
    console.warn(`Could not parse date: ${dateValue}`);
    return null;
  }
}
```

### Pitfall 4: Rate Limiting During Export

```typescript
// Problem: API rate limits cause incomplete exports

// SOLUTION: Implement retry with exponential backoff
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check for rate limit
      if (error.status === 429 || error.message?.includes('rate limit')) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Rate limited, waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // For other errors, fail fast
      throw error;
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Usage
const data = await fetchWithRetry(() =>
  fetch(url).then(r => r.json())
);
```

### Pitfall 5: Large File Handling

```typescript
// Problem: Large exports cause memory issues

// SOLUTION: Stream processing for large datasets
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';
import JSONStream from 'jsonstream-next';

async function processLargeExport(
  inputFile: string,
  outputFile: string,
  transform: (record: any) => any
) {
  const readStream = createReadStream(inputFile);
  const writeStream = createWriteStream(outputFile);

  const parser = JSONStream.parse('*');
  const stringifier = JSONStream.stringify('[\n', ',\n', '\n]\n');

  const transformer = new Transform({
    objectMode: true,
    transform(record, encoding, callback) {
      try {
        const transformed = transform(record);
        callback(null, transformed);
      } catch (error) {
        callback(error as Error);
      }
    }
  });

  await pipeline(
    readStream,
    parser,
    transformer,
    stringifier,
    writeStream
  );
}

// Usage
await processLargeExport(
  './exports/large-users.json',
  './imports/transformed-users.json',
  (user) => ({
    id: user._id,
    email: user.email.toLowerCase(),
    // ... transform
  })
);
```

### Pitfall 6: Asset URL Dependencies

```typescript
// Problem: Content references old asset URLs

// SOLUTION: Update URLs in content fields
function updateAssetUrls(
  content: string,
  urlMapping: Record<string, string>
): string {
  let updated = content;

  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    // Escape special regex characters in URL
    const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    updated = updated.replace(regex, newUrl);
  }

  return updated;
}

// Apply to all content fields
async function updateContentUrls(tableName: string, contentField: string) {
  const urlMapping = JSON.parse(
    fs.readFileSync('./data-exports/url-mapping.json', 'utf-8')
  );

  const { data: records } = await supabase
    .from(tableName)
    .select(`id, ${contentField}`);

  for (const record of records ?? []) {
    const updated = updateAssetUrls(record[contentField], urlMapping);

    if (updated !== record[contentField]) {
      await supabase
        .from(tableName)
        .update({ [contentField]: updated })
        .eq('id', record.id);
    }
  }
}
```

---

## Migration Checklists

### Pre-Migration Checklist

```markdown
## Pre-Migration Checklist

### Planning
- [ ] Document all current functionality
- [ ] Identify critical vs. nice-to-have features
- [ ] Set migration timeline and milestones
- [ ] Assign team roles and responsibilities
- [ ] Create rollback plan

### Technical Assessment
- [ ] Audit current data model
- [ ] Document all API endpoints
- [ ] List all integrations
- [ ] Identify authentication requirements
- [ ] Assess storage needs

### Data Preparation
- [ ] Reduce DNS TTL (if changing domains)
- [ ] Test data export procedures
- [ ] Validate data quality
- [ ] Plan data transformation rules
- [ ] Prepare user communication

### Infrastructure
- [ ] Set up new hosting environment
- [ ] Configure database
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring/logging
- [ ] Prepare SSL certificates
```

### During Migration Checklist

```markdown
## During Migration Checklist

### Data Migration
- [ ] Export all data from source platform
- [ ] Validate exported data integrity
- [ ] Transform data to new schema
- [ ] Import into new database
- [ ] Verify record counts match
- [ ] Test data relationships

### Asset Migration
- [ ] Export all files/images
- [ ] Upload to new storage
- [ ] Generate URL mapping
- [ ] Update content references
- [ ] Verify all assets accessible

### Authentication
- [ ] Migrate user accounts
- [ ] Configure auth providers
- [ ] Test login flows
- [ ] Send password reset emails
- [ ] Verify OAuth connections

### API Migration
- [ ] Recreate all endpoints
- [ ] Test each endpoint
- [ ] Document API changes
- [ ] Update client applications
- [ ] Verify webhooks working

### DNS/Domain
- [ ] Update DNS records
- [ ] Verify propagation
- [ ] Test all subdomains
- [ ] Verify SSL working
- [ ] Test email delivery
```

### Post-Migration Checklist

```markdown
## Post-Migration Checklist

### Verification
- [ ] All features working
- [ ] Performance acceptable
- [ ] No data loss
- [ ] All users can access
- [ ] Integrations functioning

### Monitoring
- [ ] Error tracking active
- [ ] Performance monitoring setup
- [ ] Alerts configured
- [ ] Logs accessible

### Documentation
- [ ] Update technical docs
- [ ] Document new architecture
- [ ] Update runbooks
- [ ] Archive old platform docs

### Cleanup
- [ ] Increase DNS TTL
- [ ] Remove old platform data (after grace period)
- [ ] Cancel old subscriptions
- [ ] Update bookmarks/links
- [ ] Notify stakeholders

### Review
- [ ] Conduct post-mortem
- [ ] Document lessons learned
- [ ] Update migration guide
- [ ] Plan future improvements
```

---

## Quick Reference Cards

### Platform Export Commands

```bash
# Base44 (via Supabase CLI)
supabase db dump > backup.sql
supabase storage ls
supabase functions list

# Loveable.dev
git clone <repo-url>
# or Download ZIP from dashboard

# Replit
git clone https://replit.com/@user/project.git
# or Download as ZIP

# Bubble.io
# Use Data API with pagination
curl "https://app.bubbleapps.io/api/1.1/obj/type?cursor=0" \
  -H "Authorization: Bearer $API_KEY"

# Webflow
# Site Settings -> Code Export -> Prepare ZIP
# Or use API for CMS content

# Retool
# Manual export via admin panel
# Document queries and components manually
```

### Database Connection Strings

```bash
# PostgreSQL (Supabase, Railway, etc.)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# PostgreSQL with connection pooling (Supabase)
DATABASE_URL=postgresql://user:pass@host:6543/db?pgbouncer=true

# PlanetScale (MySQL-compatible)
DATABASE_URL=mysql://user:pass@host/db?ssl={"rejectUnauthorized":true}

# MongoDB
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db

# SQLite (local development)
DATABASE_URL=file:./dev.db
```

### Common Migration Commands

```bash
# Generate TypeScript types from database
npx supabase gen types typescript --project-id $PROJECT_ID > types/database.ts

# Run database migrations
npx drizzle-kit push:pg

# Validate environment
npx ts-node scripts/validate-env.ts

# Import data
npx ts-node scripts/import-data.ts

# Run migration tests
npm run test:migration

# Check DNS propagation
dig +short example.com
nslookup example.com
```

---

## Support Resources

### Documentation Links
- [Supabase Migration Guide](https://supabase.com/docs/guides/migrations)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [TanStack Query](https://tanstack.com/query/latest)

### Community Resources
- GitHub Discussions for platform-specific questions
- Discord communities for real-time help
- Stack Overflow for technical issues

### Emergency Contacts
- Database emergencies: Contact hosting provider support
- DNS issues: Contact registrar support
- Auth problems: Review provider documentation

---

*Last updated: 2026-01-20 | Version 1.0.0*
