# AffordableStore — Complete Codebase Documentation

Generated from live Base44 schema pull · 45 entities · May 2026

> App ID: `69d600b633fe9356fc676f72` · URL: https://thrift-smart-hub.base44.app

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Frontend Patterns](#2-frontend-patterns)
3. [Component Design](#3-component-design)
4. [State & Data Fetching](#4-state--data-fetching)
5. [Backend Functions](#5-backend-functions)
6. [Entity Schema Reference](#6-entity-schema-reference)
   - [6A. Commerce Layer](#6a-commerce-layer)
   - [6B. Product & Inventory Layer](#6b-product--inventory-layer)
   - [6C. AI & Content Layer](#6c-ai--content-layer)
   - [6D. Marketplace & Listings Layer](#6d-marketplace--listings-layer)
   - [6E. Social Layer](#6e-social-layer)
   - [6F. POD / Print Layer](#6f-pod--print-layer)
   - [6G. Digital Products Layer](#6g-digital-products-layer)
   - [6H. Customer & Loyalty Layer](#6h-customer--loyalty-layer)
   - [6I. Teams & Subscriptions Layer](#6i-teams--subscriptions-layer)
   - [6J. Operations Layer](#6j-operations-layer)
   - [6K. Build / Migration Artifacts](#6k-build--migration-artifacts)
7. [Entity Relationship Map](#7-entity-relationship-map)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Publishing Pipeline](#9-publishing-pipeline)
10. [AI Subsystem](#10-ai-subsystem)
11. [Onboarding Flow](#11-onboarding-flow)
12. [Automations](#12-automations)
13. [Styling & Theming](#13-styling--theming)
14. [Security Rules & Token Handling](#14-security-rules--token-handling)
15. [Known Issues & Tech Debt](#15-known-issues--tech-debt)
16. [Adding New Features — Checklist](#16-adding-new-features--checklist)

---

## 1. Project Architecture

### Stack
- **Frontend**: React 18, React Router v6, Tailwind CSS, shadcn/ui, Lucide icons, Recharts
- **Backend**: Base44 platform — Deno-based serverless functions (`functions/`) + entity database
- **SDK**: `@base44/sdk` — provides `base44.entities`, `base44.auth`, `base44.integrations`, `base44.functions`
- **Auth**: Handled entirely by Base44 platform via `AuthContext` + `useAuth()` hook
- **Payments**: Stripe (webhook-driven subscription updates into the `Subscription` entity)
- **Email**: Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL` env vars)
- **POD**: Printify (`PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID`)
- **AI**: OpenAI GPT-4o primary (`OPENAI_API_KEY`), Google Gemini optional (`GOOGLE_GEMINI_API_KEY`)

### Directory Layout

```
src/
├── pages/           # One file per route — thin orchestrators
├── components/      # Reusable UI — grouped by domain
│   ├── layout/      # Sidebar, Layout wrapper
│   ├── ui/          # shadcn/ui primitives (DO NOT modify)
│   └── <domain>/    # Domain-specific components
├── functions/       # Backend functions (Deno) — one file per function
├── entities/        # JSON schema definitions for database entities
├── agents/          # AI agent config files
├── lib/             # Shared utilities: AuthContext, utils, query-client
├── hooks/           # Custom React hooks
├── docs/            # Documentation (this file)
├── App.jsx          # Router — all routes defined here
└── index.css        # Design tokens (CSS variables)
```

### Routing Convention
- All routes registered in `App.jsx` — never add a page without updating it
- Home page: `<Route path="/" ...>`
- Admin-only routes: hidden in Sidebar via `item.adminOnly`, route itself always accessible
- Public pages (e.g. supplier portal, return portal, consumer-facing store): placed **outside** `<Layout>`

### User Roles
Three roles exist in the `User` entity: `admin`, `seller`, `consumer`. Most authenticated app screens are scoped to `seller`; admin screens gate on `user?.role === 'admin'`; consumer-facing pages are public or use consumer sessions.

---

## 2. Frontend Patterns

### Page Structure
Pages are thin orchestrators. They fetch data, own top-level state, compute derived views with `useMemo`, and delegate rendering to child components.

```jsx
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => products.filter(...), [products, filters]);

  return (
    <>
      <ProductFilters ... />
      <PricingInsightsPanel />
      <ProductsTable products={filtered} ... />
    </>
  );
}
```

### Navigation
- Always use `<Link to="/path">` — never `<a href>` for internal links
- Never use `window.location.href =` for navigation — use `useNavigate()` or `<Link>`

### Loading States
Always show skeleton or pulse placeholders:
```jsx
{loading ? (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
    ))}
  </div>
) : <ActualContent />}
```

### Empty States
Every data list needs an empty state with an icon, title, and hint:
```jsx
{items.length === 0 && (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
      <Package className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-muted-foreground font-medium">No items yet</p>
    </CardContent>
  </Card>
)}
```

### Toasts
Use `useToast()` (shadcn) only — no `alert()` or `console.log()`:
```jsx
const { toast } = useToast();
toast({ title: 'Published!', description: 'Listing is live on Etsy.' });
toast({ title: 'Error', description: err.message, variant: 'destructive' });
```

---

## 3. Component Design

### One Component Per File
Every component in its own file. Keep under ~150 lines; extract sub-components when they grow.

### Domain Grouping
```
components/
  products/       ProductsTable, ProductCard, ProductForm, StockAlertPanel, PricingInsightCard
  listings/       ListingEditor, ListingCard, PublishButton, AIGenerateDialog
  orders/         OrdersTable, ShippingLabelDialog, BulkActionBar, ComplianceViolationsPanel
  returns/        ReturnRequestForm, AdminReturnQueue, ReturnStatusTracker
  social/         SocialCalendar, SocialContentCard, SocialPlatformBadge, AnalyticsChart
  pod/            PODProductCard, PrintDesignEditor, PrintifySync
  digital/        DigitalProductCard, DigitalUploadForm
  ai/             AIGenerateButton, BrandVoiceSelector, ConceptDraftCard, AIUsageBar
  brand/          BrandProfileForm, BrandVoiceProfileForm, ColorPicker
  team/           TeamMemberTable, InviteDialog, RoleBadge
  billing/        PlanCard, SubscriptionStatus, AICreditsGauge
  onboarding/     OnboardingWizard, OnboardingStep, PersonaSelector
  loyalty/        LoyaltyCard, PointsHistory, RedeemDialog
  supplier/       SupplierCard, PurchaseOrderForm, POHistoryTable
  dashboard/      AIRecommendations, SalesProjectionChart, PriceCompetitiveness
  portal/         OrderTrackingCard, LoyaltyCard, AddressManager
  layout/         Sidebar, Layout
```

### Props Pattern
- Pass data down, actions up
- Self-contained widgets (e.g. `PricingInsightsPanel`, `AIUsageBar`, `StockAlertPanel`) own their own fetch and drop into pages without configuration

### Icon Usage
Only import icons verified to exist in `lucide-react`. Wrong imports **break the build**. Verify at https://lucide.dev before adding.

---

## 4. State & Data Fetching

### Standard Fetch Pattern
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

const fetchData = useCallback(async () => {
  setLoading(true);
  const result = await base44.entities.Product.list('-updated_at', 500);
  setData(result);
  setLoading(false);
}, []);

useEffect(() => { fetchData(); }, [fetchData]);
```

### Parallel Fetches
```jsx
const [orders, products, suppliers] = await Promise.all([
  base44.entities.Order.list('-order_date', 100),
  base44.entities.Product.list('-updated_at', 50),
  base44.entities.Supplier.list('name', 100),
]);
```

### Filtering
Compute filtered views with `useMemo` — never filter inside render:
```jsx
const filtered = useMemo(() => data.filter(item => {
  const matchStatus = filter === 'all' || item.status === filter;
  const matchSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase());
  return matchStatus && matchSearch;
}), [data, filter, search]);
```

### Calling Backend Functions
```jsx
const res = await base44.functions.invoke('myFunction', { param: 'value' });
const data = res?.data ?? res; // handle both wrapped and unwrapped responses
```

### Real-Time Subscriptions
```jsx
useEffect(() => {
  const unsub = base44.entities.Order.subscribe((event) => {
    if (event.type === 'update') {
      setOrders(prev => prev.map(o => o.id === event.id ? event.data : o));
    }
  });
  return unsub;
}, []);
```

---

## 5. Backend Functions

### Template
```js
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { param1, param2 } = await req.json();
    if (!param1) return Response.json({ error: 'param1 required' }, { status: 400 });

    // ... business logic ...

    return Response.json({ success: true, result });
  } catch (error) {
    console.error('functionName error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
```

### SDK Version
Always use `npm:@base44/sdk@0.8.25`. Never use older versions.

### `asServiceRole` vs User-Scoped
| Use case | Method |
|---|---|
| User-triggered action | `base44.entities.Order.list()` |
| Automation, webhook, scheduled job | `base44.asServiceRole.entities.Order.list()` |
| Sending email from automation | `base44.asServiceRole.integrations.Core.SendEmail(...)` |

**Never** use `asServiceRole` without first verifying auth context or webhook authenticity.

### Secrets in Env Vars
```js
const openaiKey   = Deno.env.get('OPENAI_API_KEY');
const stripeKey   = Deno.env.get('STRIPE_SECRET_KEY');
const printifyKey = Deno.env.get('PRINTIFY_API_KEY');
const resendKey   = Deno.env.get('RESEND_API_KEY');
```

| Key | Source |
|---|---|
| `OPENAI_API_KEY` | OpenAI dashboard |
| `AI_MODEL` | Set to `gpt-4o` |
| `GOOGLE_GEMINI_API_KEY` | Google AI Studio |
| `STRIPE_SECRET_KEY` | Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks |
| `PRINTIFY_API_KEY` | Printify settings |
| `PRINTIFY_SHOP_ID` | Printify settings |
| `PRINTIFY_WEBHOOK_SECRET` | Printify → Webhooks (HMAC-SHA256) |
| `RESEND_API_KEY` | Resend dashboard |
| `RESEND_FROM_EMAIL` | Verified domain |
| `ETSY_API_KEY` | Etsy developer console |
| `SHOPIFY_ADMIN_API_TOKEN` | Shopify partner dashboard |
| `TIKTOK_APP_KEY` | TikTok developer console |

### No Local Imports
Each function file deploys independently. No cross-file imports. Inline shared logic or call another function via `base44.functions.invoke()`.

### External Package Imports
```js
// Correct — use npm: prefix with pinned version
import { jsPDF } from 'npm:jspdf@4.0.0';

// Wrong — bare specifiers fail
import jsPDF from 'jspdf';
```

---

## 6. Entity Schema Reference

45 entities total. Built-in fields on every entity (do not define in schema): `id`, `created_date`, `updated_date`, `created_by`.

---

### 6A. Commerce Layer

#### `Order`
Core transactional record. Supports multi-marketplace orders with full compliance and shipping tracking.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `customer_id` | string | Required |
| `customer_name` | string | Denormalized at order time |
| `total_amount` | number | Required |
| `status` | enum | `pending` → `processing` → `shipped` → `delivered` / `cancelled`. Default: `pending` |
| `order_date` | date-time | |
| `shipping_address` | string | |
| `marketplace` | string | Platform the order came from (Etsy, TikTok, Shopify, etc.) |
| `external_order_id` | string | Platform-side reference |
| `product_id` | string | FK to Product |
| `product_title` | string | Denormalized at order time |
| `quantity` | integer | Default: 1 |
| `tracking_carrier` | string | `usps`, `ups`, `fedex`, `dhl` |
| `tracking_number` | string | |
| `compliance_status` | enum | `pending` / `passed` / `flagged` / `blocked`. Default: `pending` |
| `compliance_violations` | string[] | Messages for admin review |
| `compliance_checked_at` | date-time | Timestamp of last compliance run |

**Required**: `customer_id`, `total_amount`, `status`

#### `OrderItem`
Line-item detail for multi-item orders.

| Field | Type | Notes |
|---|---|---|
| `order_id` | string | Required — FK to Order |
| `product_id` | string | Required — FK to Product |
| `quantity` | integer | Required |
| `price` | number | Required — unit price at order time |
| `user_id` | string | Tenant isolation |
| `product_name` | string | Denormalized at order time |
| `product_image` | uri | Snapshot image |

**Required**: `order_id`, `product_id`, `quantity`, `price`

#### `Return`
Return request lifecycle with inventory reconciliation flag.

| Field | Type | Notes |
|---|---|---|
| `order_id` | string | FK to Order |
| `product_id` | string | FK to Product |
| `product_title` | string | Denormalized |
| `customer_name` | string | |
| `quantity` | integer | Default: 1 |
| `reason` | enum | `damaged` / `wrong_size` / `wrong_item` / `not_as_described` / `changed_mind` / `defective` / `other` |
| `reason_notes` | string | Additional customer detail |
| `status` | enum | `requested` → `received` → `restocked` / `refunded` / `rejected`. Default: `requested` |
| `restock_applied` | boolean | Whether inventory was incremented. Default: false |
| `refund_amount` | number | |
| `received_at` | date-time | |
| `user_id` | string | Tenant isolation |

**Required**: `order_id`, `product_id`, `quantity`, `reason`

#### `Cart`
Consumer-side cart state. One record per product per consumer session.

| Field | Type | Notes |
|---|---|---|
| `consumer_id` | string | Required |
| `product_id` | string | Required |
| `quantity` | integer | Required |

**Note**: No `user_id` — consumer-scoped, not seller-scoped.

#### `Document`
Generated documents (invoices, receipts, packing slips) attached to orders.

| Field | Type | Notes |
|---|---|---|
| `order_id` | string | FK to Order |
| `document_type` | enum | `invoice` / `receipt` / `packing_slip` / `other`. Default: `invoice` |
| `file_uri` | string | Private file storage URI |
| `file_name` | string | e.g. `invoice-ORD123.pdf` |
| `customer_email` | email | Recipient |
| `user_id` | string | Tenant isolation |

**Required**: `order_id`, `document_type`, `file_uri`, `file_name`, `customer_email`

---

### 6B. Product & Inventory Layer

#### `Product`
Core product record. Source of truth for inventory and pricing.

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required (renamed from `name`) |
| `description` | string | |
| `price` | number | Required |
| `images` | uri[] | |
| `category` | string | Plain text label — not a FK to Category |
| `inventory_count` | integer | (renamed from `stock`) |
| `sku` | string | |
| `user_id` | string | Tenant isolation |
| `tags` | string[] | Marketplace tags |
| `status` | enum | `draft` / `active` / `archived`. Default: `draft` |
| `updated_at` | date-time | |

**Required**: `title`, `price`

> ⚠ `category` is a plain string, not a FK. Category entity exists for hierarchical nav/display but `Product.category` is denormalized.

#### `Category`
Navigation taxonomy — supports nested categories via `parent_id`.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `slug` | string | Required — URL-safe unique identifier |
| `description` | string | |
| `image` | uri | Hero image |
| `parent_id` | string | Self-reference for nested categories |

**Required**: `name`, `slug`

#### `StockAlert`
Per-product alert rules. Triggers email when `inventory_count` falls below `threshold`.

| Field | Type | Notes |
|---|---|---|
| `product_id` | string | FK to Product |
| `product_title` | string | Denormalized |
| `threshold` | integer | Alert trigger level. Default: 10 |
| `notify_email` | string | Alert recipient |
| `is_active` | boolean | Default: true |
| `last_alerted_at` | date-time | When the last email fired |
| `last_stock_level` | integer | Stock at last check |
| `user_id` | string | |

**Required**: `product_id`, `threshold`, `notify_email`

#### `PricingInsight`
LLM-powered competitor pricing snapshot per product. Written by a backend scan function.

| Field | Type | Notes |
|---|---|---|
| `product_id` | string | FK to Product |
| `product_title` | string | Denormalized |
| `product_sku` | string | |
| `our_price` | number | Required |
| `competitor_prices` | object[] | `{ marketplace, price, url }[]` — sampled from LLM research |
| `avg_competitor_price` | number | |
| `min_competitor_price` | number | |
| `max_competitor_price` | number | |
| `competitiveness_score` | number | 0–100. Higher = more competitive |
| `verdict` | enum | `underpriced` / `competitive` / `overpriced` |
| `recommendation` | string | LLM-generated pricing action |
| `scanned_at` | date-time | |

**Required**: `product_id`, `our_price`

#### `Supplier`
Supplier contact records linked to products.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `name` | string | Required |
| `contact_name` | string | |
| `email` | email | Required |
| `phone` | string | |
| `website` | string | |
| `address` | string | |
| `country` | string | |
| `product_ids` | string[] | Linked product IDs |
| `notes` | string | |
| `status` | enum | `active` / `inactive`. Default: `active` |

**Required**: `name`, `email`

#### `PurchaseOrder`
Supplier restock requests with lifecycle tracking.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `supplier_id` | string | FK to Supplier |
| `supplier_name` | string | Denormalized |
| `supplier_email` | string | Denormalized |
| `product_id` | string | FK to Product |
| `product_title` | string | Denormalized |
| `quantity_ordered` | integer | |
| `supplier_cost` | number | Cost per unit |
| `current_stock` | integer | |
| `threshold` | integer | |
| `status` | enum | `draft` → `sent` → `acknowledged` → `shipped` → `received` / `cancelled`. Default: `draft` |
| `notes` | string | |
| `sent_at` | date-time | |
| `expected_ship_date` | date | Supplier-provided |
| `acknowledged_at` | date-time | |
| `tracking_number` | string | |
| `manifest_url` | string | Shipping manifest URL |
| `shipped_at` | date-time | |

**Required**: `supplier_id`, `product_id`, `quantity_ordered`

---

### 6C. AI & Content Layer

#### `AiGeneration`
Audit log for every LLM call. Every AI feature should write here.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | |
| `type` | string | Required — `listing`, `image`, `description`, `tags`, etc. |
| `prompt` | string | Required — input sent to model |
| `output` | string | Required — full model response |
| `model` | string | Default: `gpt-4o` |
| `tokens_used` | integer | Default: 0 |

**Required**: `user_id`, `type`, `prompt`, `output`

#### `AIUsage`
Credit consumption tracking per seller per feature.

| Field | Type | Notes |
|---|---|---|
| `seller_id` | string | Required |
| `feature` | string | Required |
| `credits_used` | integer | Required |

> ⚠ Uses `seller_id` not `user_id` — inconsistent with other entities. Normalize if refactoring.

#### `ProductConcept`
AI-generated product concepts before approval and promotion to `Product`. Staging entity.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `brand_voice_id` | string | FK to BrandVoiceProfile |
| `prompt` | string | Required — generation prompt |
| `marketplace` | string | Default: `general` |
| `target_platforms` | string[] | |
| `price_range` | string | |
| `generated_title` | string | |
| `generated_description` | string | |
| `generated_tags` | string[] | |
| `generated_features` | string[] | |
| `generated_images` | uri[] | |
| `hero_image_url` | uri | |
| `seo_title` | string | |
| `seo_description` | string | |
| `seo_keywords` | string[] | |
| `status` | enum | `draft` / `approved` / `published` / `rejected`. Default: `draft` |
| `quality_score` | number | 0–100 |
| `ai_provider` | string | |
| `generation_cost` | number | |
| `published_to_products` | boolean | Default: false |
| `linked_product_id` | string | Set when promoted to Product |

**Required**: `user_id`, `prompt`

#### `BrandVoiceProfile`
Rich brand voice definition used to guide AI generation tone, vocabulary, and style.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `name` | string | Required |
| `description` | string | |
| `tone` | enum | `professional` / `casual` / `playful` / `authoritative` / `friendly` / `luxury`. Default: `professional` |
| `vocabulary_level` | enum | `simple` / `intermediate` / `advanced`. Default: `intermediate` |
| `writing_style` | enum | `conversational` / `formal` / `technical` / `storytelling`. Default: `conversational` |
| `personality` | string[] | Personality trait tags |
| `brand_values` | string[] | |
| `target_audience` | string | |
| `industry` | string | |
| `preferred_phrases` | string[] | |
| `avoid_words` | string[] | |
| `example_content` | object | Sample content demonstrating the voice |
| `color_palette` | string[] | Hex colors |
| `logo_url` | uri | |
| `is_default` | boolean | Default: false |

> Supersedes `BrandProfile`. New AI features should use `BrandVoiceProfile`. `BrandProfile` retained for backwards compatibility.

#### `BrandProfile`
Simpler brand config. Legacy — prefer `BrandVoiceProfile` for new AI features.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `user_id` | string | Required |
| `description` | string | |
| `tone` | enum | `professional` / `casual` / `playful` / `authoritative` / `friendly` / `luxury`. Default: `professional` |
| `target_audience` | string | |
| `keywords` | string[] | SEO keywords |
| `colors` | string[] | Hex colors |
| `is_default` | boolean | Default: false |

#### `ContentLibrary`
Saved AI-generated and manually created content blobs.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `title` | string | |
| `type` | string | Required — content type |
| `content` | string | Inline text/copy blob |
| `platform` | string | Target platform context |
| `product_id` | string | Optional product link |
| `is_favorite` | boolean | Default: false |
| `tags` | string[] | |

**Required**: `user_id`, `type`

#### `AISetupGuide`
Per-user AI configuration. Controls defaults for model selection, image style, SEO behavior, and publishing targets.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `ai_listing_model` | string | Default: `gpt-4o` |
| `ai_image_provider` | enum | `auto` / `openai_dalle3` / `stability` / `replicate` / `google_imagen`. Default: `auto` |
| `brand_voice_id` | string | FK to BrandVoiceProfile |
| `default_listing_platforms` | string[] | Default publish targets |
| `default_price_strategy` | enum | `budget` / `competitive` / `premium` / `custom`. Default: `competitive` |
| `image_style_preference` | enum | `lifestyle` / `white_background` / `mockup` / `video` / `platform_optimized`. Default: `lifestyle` |
| `etsy_seo_enabled` | boolean | Default: true |
| `social_auto_caption` | boolean | Default: true |
| `tiktok_video_enabled` | boolean | Default: false |
| `watermark_enabled` | boolean | Default: false |
| `content_language` | string | Default: `en` |

**Required**: `user_id`
> One record per user. Always `filter({ user_id })` before upsert.

---

### 6D. Marketplace & Listings Layer

#### `Listing`
Per-platform listing record. Each `Product` can have multiple `Listing` records across platforms.

| Field | Type | Notes |
|---|---|---|
| `product_id` | string | FK to Product |
| `user_id` | string | Tenant isolation |
| `platform` | string | Marketplace name — plain string, no enum lock |
| `custom_title` | string | Per-listing title override |
| `custom_description` | string | |
| `custom_price` | number | Per-listing price override |
| `status` | enum | `draft` / `active` / `sold_out` / `inactive` |
| `external_id` | string | Platform listing ID after publish |
| `url` | uri | Live listing URL |
| `listing_data` | object | Full AI-generated payload: `bulletPoints`, `seoTitle`, `metaDescription`, `searchTerms`, `platformSpecific` |
| `generated_images` | uri[] | AI-generated listing images |
| `published_at` | date-time | |

**Required**: `product_id`, `platform`

#### `PlatformConnection`
OAuth connection state per seller per marketplace.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | |
| `platform` | enum | `etsy` / `shopify` / `tiktok_shop` / `amazon` / `amazon_kdp` / `ebay` / `gumroad` / `printify` / `instagram` / `pinterest` / `depop` / `poshmark` / `mercari` |
| `display_name` | string | |
| `shop_id` | string | |
| `shop_name` | string | |
| `shop_url` | uri | |
| `access_token` | string | ⚠ See security section |
| `refresh_token` | string | ⚠ See security section |
| `token_expires_at` | date-time | |
| `scopes` | string[] | OAuth scopes granted |
| `connected` | boolean | Default: true |
| `sync_enabled` | boolean | Default: true |
| `last_synced_at` | date-time | |
| `connection_status` | enum | `active` / `expired` / `error` / `disconnected`. Default: `active` |
| `error_message` | string | |
| `platform_metadata` | object | Platform-specific config (e.g. Printify `print_provider_id`, KDP `author_name`) |

**Required**: `user_id`, `platform`
> ⚠ `access_token` and `refresh_token` must have field-level RLS set to owner-only. See Section 14.

#### `PublishingQueue`
Single queue for all outbound publish jobs (listings + social content).

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `product_id` | string | Direct product reference |
| `listing_id` | string | FK to Listing |
| `social_content_id` | string | FK to SocialContent |
| `platform` | string | Required |
| `scheduled_at` | date-time | Required |
| `status` | enum | `pending` / `processing` / `published` / `failed` / `cancelled`. Default: `pending` |
| `safeguards_passed` | boolean | **BLOCKING** — pipeline gate in `publishPipeline.ts`. Default: false |
| `trademark_cleared` | boolean | **BLOCKING** — compliance gate. Default: false |
| `priority` | integer | 1–10. Default: 5 |
| `quality_score` | number | AI quality assessment 0–100 |
| `error_message` | string | |
| `retry_count` | integer | Default: 0 |
| `external_id` | string | |
| `external_url` | uri | Live URL after publish |
| `published_at` | date-time | |

**Required**: `platform`, `scheduled_at`
> Both `safeguards_passed` and `trademark_cleared` must be `true` before a publishing function proceeds. Treat them as hard gates.

#### `PublishingAutomation`
Rules for automated publish pipelines triggered by product events or schedules.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `name` | string | Required |
| `trigger_type` | enum | `on_product_create` / `on_product_update` / `scheduled` / `manual` |
| `product_type` | enum | `pod` / `digital` / `social_content` |
| `target_platforms` | string[] | Required — `etsy` / `tiktok_shop` / `gumroad` / etc. |
| `ai_generate` | boolean | Use AI for titles/descriptions. Default: false |
| `ai_settings` | object | `{ style, tone, include_seo_keywords }` |
| `schedule` | object | `{ enabled, interval, day_of_week, time }` |
| `status` | enum | `active` / `paused` / `disabled`. Default: `active` |
| `last_run_at` | date-time | |
| `error_log` | object[] | `{ timestamp, platform, error }[]` |

**Required**: `user_id`, `name`, `trigger_type`, `target_platforms`

---

### 6E. Social Layer

#### `SocialPlatform`
Connected social account. One record per platform per seller.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `platform_name` | string | Required — `Instagram` / `Facebook` / `Twitter` / `Pinterest` / `TikTok` / `LinkedIn` |
| `username` | string | Required |
| `display_name` | string | |
| `avatar` | uri | |
| `follower_count` | integer | Default: 0 |
| `connected` | boolean | Default: true |
| `connected_at` | date-time | |
| `access_token` | string | ⚠ Field-level RLS: owner-only |
| `refresh_token` | string | ⚠ Field-level RLS: owner-only, server-side only |
| `token_expires_at` | date-time | |

**Required**: `user_id`, `platform_name`, `username`

#### `SocialContent`
Scheduled or published social post records.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `title` | string | |
| `caption` | string | Post text |
| `platforms` | string[] | Multi-platform targets |
| `media_uri` | string | Canonical single media URI (first asset) |
| `media_type` | enum | `image` / `video` / `reel` / `story` / `carousel` |
| `status` | enum | `draft` / `scheduled` / `published` / `failed`. Default: `draft` |
| `scheduled_at` | date-time | |
| `published_at` | date-time | |
| `failed_reason` | string | |
| `tags` | string[] | Hashtag list |

**Required**: `user_id`

#### `SocialAnalytics`
Point-in-time analytics snapshots per platform (or per post if `social_content_id` is set).

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `platform` | string | Required |
| `social_content_id` | string | Optional — for per-post detail |
| `total_likes` | integer | |
| `total_comments` | integer | |
| `total_shares` | integer | |
| `total_views` | integer | |
| `follower_count` | integer | At snapshot time |
| `engagement_rate` | number | |
| `posts_count` | integer | |
| `snapshot_date` | date-time | |

**Required**: `user_id`, `platform`

#### `SocialContentAutomation`
Rules for automated social content generation triggered by product events or schedules.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `name` | string | Required |
| `trigger_type` | enum | `on_product_publish` / `on_schedule` / `manual` |
| `product_id` | string | Product to auto-promote |
| `content_types` | string[] | Required — `instagram_post` / `tiktok_video_script` / `twitter_thread` / `pinterest_pin_script` / `facebook_post` / `email_campaign` |
| `ai_voice` | enum | `professional` / `casual` / `playful` / `authoritative` / `luxury` |
| `hashtag_strategy` | enum | `trending` / `niche` / `mixed` |
| `schedule` | object | `{ enabled, frequency, preferred_time, post_immediately }` |
| `connected_accounts` | object[] | `{ platform, social_platform_id }[]` |
| `status` | enum | `active` / `paused`. Default: `active` |

**Required**: `user_id`, `name`, `trigger_type`, `content_types`

---

### 6F. POD / Print Layer

#### `PODProduct`
Print-on-demand product synced with Printify.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `title` | string | Required |
| `description` | string | |
| `images` | uri[] | |
| `product_type` | enum | `t_shirt` / `hoodie` / `mug` / `tote` / `notebook` / `poster` / `sticker` / `hat`. Required |
| `printify_id` | string | Printify product ID |
| `printify_variant_ids` | object | Map of variant names → Printify variant IDs |
| `base_price` | number | Cost from Printify |
| `selling_price` | number | Required — your markup |
| `margin_percent` | number | Calculated margin % |
| `status` | enum | `draft` / `active` / `delisted`. Default: `draft` |
| `connected_listings` | object[] | `{ listing_id, platform, external_id }[]` |

**Required**: `title`, `product_type`, `selling_price`, `user_id`

#### `PrintDesign`
Design files for POD and Amazon KDP, including print area placements.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `title` | string | Required |
| `print_type` | enum | `tshirt` / `hoodie` / `mug` / `poster` / `phone_case` / `tote` / `sticker` / `book_cover` / `ebook_cover` / `paperback` / `hardcover` / `journal` / `other`. Required |
| `design_url` | uri | |
| `source_image_url` | uri | |
| `print_areas` | object | Printify print area placements |
| `printify_blueprint_id` | string | |
| `printify_product_id` | string | |
| `print_provider_id` | string | Printify print provider |
| `mockup_urls` | uri[] | |
| `ai_generated` | boolean | Default: false |
| `product_id` | string | FK to Product |
| `kdp_interior_url` | string | KDP manuscript file |
| `kdp_asin` | string | Amazon KDP ASIN after publish |
| `subtitle` | string | For KDP books |
| `status` | enum | `draft` / `synced` / `published` / `error`. Default: `draft` |

**Required**: `user_id`, `title`, `print_type`

---

### 6G. Digital Products Layer

#### `DigitalProduct`
Downloadable digital goods (PDFs, Notion templates, prompt packs, spreadsheets).

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Tenant isolation |
| `title` | string | Required |
| `description` | string | |
| `file_url` | uri | Required — uploaded file |
| `file_type` | enum | `pdf` / `notion` / `spreadsheet` / `template` / `prompt_pack` / `other` |
| `category` | enum | `etsy_seo` / `notion_template` / `ai_prompts` / `planner` / `spreadsheet` / `other` |
| `price` | number | Required |
| `is_curated` | boolean | True if reselling from marketplace. Default: false |
| `original_creator` | string | Curated source creator name |
| `commission_rate` | number | Revenue share % if reselling |
| `status` | enum | `draft` / `published` / `archived`. Default: `draft` |
| `connected_listings` | object[] | `{ listing_id, platform, external_id }[]` |
| `tags` | string[] | |

**Required**: `title`, `file_url`, `price`, `user_id`

---

### 6H. Customer & Loyalty Layer

#### `CustomerAddress`
Saved shipping addresses for consumer accounts.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required — owner email |
| `label` | string | e.g. `Home`, `Work` |
| `first_name` | string | |
| `last_name` | string | |
| `address1` | string | Required |
| `address2` | string | |
| `city` | string | Required |
| `state` | string | Required |
| `zip` | string | Required |
| `country` | string | Default: `US` |
| `is_default` | boolean | Default: false |

**Required**: `user_id`, `address1`, `city`, `state`, `zip`

#### `Review`
Product reviews from consumers.

| Field | Type | Notes |
|---|---|---|
| `product_id` | string | Required |
| `product_title` | string | Denormalized |
| `order_id` | string | Required |
| `user_id` | string | Required — reviewer email |
| `user_name` | string | |
| `rating` | integer | Required — 1–5 |
| `comment` | string | |
| `status` | enum | `published` / `hidden`. Default: `published` |

**Required**: `product_id`, `order_id`, `user_id`, `rating`

#### `Feedback`
Post-order feedback, categorized by aspect.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required — customer email |
| `user_name` | string | |
| `order_id` | string | Required |
| `product_id` | string | |
| `product_title` | string | Denormalized |
| `rating` | integer | Required — 1–5 |
| `comment` | string | |
| `category` | enum | `product_quality` / `shipping_speed` / `packaging` / `overall`. Default: `overall` |

**Required**: `user_id`, `order_id`, `rating`

> `Review` is product-centric (shown on product pages). `Feedback` is order-centric (aspect-tagged, used for operational reporting). Both are needed.

#### `LoyaltyAccount`
Running balance for a consumer's loyalty points.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required — customer email |
| `points_balance` | integer | Default: 0 |
| `total_earned` | integer | Default: 0 |
| `total_redeemed` | integer | Default: 0 |

**Required**: `user_id`
> One record per consumer. Always filter by `user_id`. Update via atomic operations — never read-modify-write in race-prone flows.

#### `LoyaltyTransaction`
Immutable ledger of earn/redeem events.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required — customer email |
| `type` | enum | `earn` / `redeem`. Required |
| `points` | integer | Required — always positive. Subtract from balance when `type = redeem` |
| `order_id` | string | Related order ID when earning |
| `description` | string | |
| `discount_code` | string | Generated code on redeem |

**Required**: `user_id`, `type`, `points`
> Treat this as an append-only ledger. Never update or delete records. Derive `LoyaltyAccount.points_balance` by summing this table if the balance ever diverges.

---

### 6I. Teams & Subscriptions Layer

#### `Team`
Multi-seller team workspace.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `owner_id` | string | Required — ID of the owning seller |
| `plan` | enum | `free` / `pro` / `business`. Default: `free` |

**Required**: `name`, `owner_id`

#### `TeamMember`
Membership record per user per team with RBAC role.

| Field | Type | Notes |
|---|---|---|
| `team_id` | string | Required |
| `user_id` | string | Required |
| `role` | enum | `admin` / `editor` / `viewer`. Default: `viewer` |
| `email` | string | Required — for invite flow |
| `name` | string | Display name |
| `status` | enum | `pending` / `active` / `disabled`. Default: `pending` |
| `invited_at` | date-time | |
| `joined_at` | date-time | |

**Required**: `team_id`, `user_id`, `email`

#### `Subscription`
Active subscription state per seller, Stripe-linked.

| Field | Type | Notes |
|---|---|---|
| `seller_id` | string | Required |
| `plan` | enum | `Free` / `Pro` / `Business`. Required |
| `status` | enum | `active` / `cancelled` / `past_due`. Required |
| `stripe_subscription_id` | string | |
| `start_date` | date-time | |
| `end_date` | date-time | |

**Required**: `seller_id`, `plan`, `status`
> Updated exclusively by the `stripe-webhook` function. Never write to this from the frontend.

#### `SubscriptionPlan`
Plan configuration and feature flags.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required — `Free` / `Pro` / `Business` |
| `price` | number | Required — USD |
| `interval` | enum | `month` / `year`. Required. Default: `month` |
| `stripe_price_id` | string | Stripe Price ID for checkout |
| `product_limit` | integer | Max products per seller |
| `team_members_limit` | integer | |
| `ai_credits_limit` | integer | AI credits per billing period |
| `storage_limit` | integer | MB |
| `features` | object | Feature flag map |
| `is_active` | boolean | Default: true |

**Required**: `name`, `price`, `interval`
> Seed data — managed by admin. Do not let sellers write to this entity.

#### `Campaign`
Marketing campaign records.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `start_date` | date | |
| `end_date` | date | |
| `budget` | number | |
| `status` | enum | `planning` / `active` / `completed` / `archived`. Required |

**Required**: `name`, `status`

---

### 6J. Operations Layer

#### `OnboardingState`
Per-user onboarding wizard progress. One record per user; updated as steps complete.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `current_step` | integer | Active step 1–7. Default: 1 |
| `is_complete` | boolean | Default: false |
| `completed_at` | date-time | |
| `persona` | enum | `creator_seller` / `reseller` / `pod_maker` / `digital_creator` / `brand_builder` / `multi_channel_merchant` |
| `step_1_done` through `step_7_done` | boolean | Per-step completion flags. Default: false |
| `skipped_steps` | integer[] | Steps explicitly skipped |
| `brand_voice_complete` | boolean | Default: false |
| `social_connected` | boolean | Default: false |
| `pricing_activated` | boolean | Default: false |
| `first_product_uploaded_at` | date-time | |
| `first_product_published_at` | date-time | |
| `first_platform_connected` | string | |
| `ai_first_generation_at` | date-time | |
| `first_social_post_at` | date-time | |

**Required**: `user_id`
> One record per user. Always upsert, never insert a second record.

#### `PasswordResetToken`
Short-lived reset tokens for custom auth reset flows.

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Required |
| `token` | string | Required — hashed |
| `expires_at` | date-time | Required |
| `used_at` | date-time | Null = unused |

**Required**: `user_id`, `token`, `expires_at`
> Check `expires_at > now` AND `used_at == null` before accepting a token. Mark `used_at` on consumption — never delete.

---

### 6K. Build / Migration Artifacts

These three entities exist to support the Base44 migration process and can be decommissioned or archived once migration is complete.

| Entity | Purpose |
|---|---|
| `MigrationDoc` | Generated migration docs with `pending` / `applied` / `verified` status tracking |
| `ProjectFile` | Full file contents for generated code with `ready` / `needs_review` / `deployed` status |
| `MigrationFile` | Migration-specific files with phase labeling |

> None of these should be used in production runtime flows. Archive when migration is verified complete.

---

## 7. Entity Relationship Map

```
User (role: admin | seller | consumer)
 ├── BrandProfile (user_id)
 ├── BrandVoiceProfile (user_id) ──→ ProductConcept.brand_voice_id
 ├── AISetupGuide (user_id) ──→ BrandVoiceProfile
 ├── OnboardingState (user_id)
 ├── Subscription (seller_id) ──→ SubscriptionPlan
 ├── AIUsage (seller_id)
 ├── AiGeneration (user_id)
 ├── ContentLibrary (user_id)
 │
 ├── Product (user_id)
 │    ├── Listing (product_id) ──→ PublishingQueue
 │    ├── StockAlert (product_id)
 │    ├── PricingInsight (product_id)
 │    ├── OrderItem (product_id)
 │    ├── Review (product_id)
 │    └── Feedback (product_id)
 │
 ├── PODProduct (user_id) ──→ PrintDesign
 ├── DigitalProduct (user_id) ──→ Listing
 ├── ProductConcept (user_id) ──→ Product (on approval)
 │
 ├── Order (user_id)
 │    ├── OrderItem (order_id)
 │    ├── Return (order_id)
 │    ├── Document (order_id)
 │    ├── Review (order_id)
 │    ├── Feedback (order_id)
 │    └── LoyaltyTransaction (order_id, type: earn)
 │
 ├── Supplier (user_id)
 │    └── PurchaseOrder (supplier_id)
 │
 ├── PlatformConnection (user_id)   ← OAuth tokens, marketplace access
 ├── SocialPlatform (user_id)       ← OAuth tokens, social access
 ├── SocialContent (user_id) ──→ PublishingQueue
 ├── SocialAnalytics (user_id, social_content_id?)
 ├── SocialContentAutomation (user_id)
 ├── PublishingAutomation (user_id)
 ├── PublishingQueue (user_id)
 │
 ├── Team (owner_id)
 │    └── TeamMember (team_id, user_id)
 │
 ├── Campaign (no user_id — shared)
 └── Cart (consumer_id) ──→ Product

Consumer-specific:
 ├── CustomerAddress (user_id = consumer email)
 ├── LoyaltyAccount (user_id = consumer email)
 └── LoyaltyTransaction (user_id = consumer email)
```

---

## 8. Authentication & Authorization

### Getting the Current User
```jsx
// In React components
import { useAuth } from '@/lib/AuthContext';
const { user, isAuthenticated } = useAuth();

// In backend functions
const user = await base44.auth.me();
```

### Role Matrix
| Role | Access |
|---|---|
| `admin` | All data, all functions, admin UI sections |
| `seller` | Own data only (enforced via `user_id` filter + RLS), seller UI |
| `consumer` | Consumer-facing portal only — Cart, Orders (own), CustomerAddress, LoyaltyAccount, Reviews |

### Frontend Role Gates
```jsx
const { user } = useAuth();
const isAdmin = user?.role === 'admin';
const isSeller = user?.role === 'seller' || user?.role === 'admin';
```

### Backend Role Checks
```js
const user = await base44.auth.me();
if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
```

### Redirecting to Login
```jsx
base44.auth.redirectToLogin(window.location.href);
```

### Public Pages
Pages outside `<Layout>` handle their own auth state and do not require a Base44 session (e.g. consumer store, supplier portal, return portal).

---

## 9. Publishing Pipeline

The publishing system routes both marketplace listings and social content through a unified queue with compliance gates.

### Flow
```
Product / PODProduct / DigitalProduct / SocialContent
  └─→ PublishingQueue record created
        ├── safeguards_passed = false  (GATE 1 — quality/content check)
        └── trademark_cleared = false  (GATE 2 — compliance check)

publishPipeline function:
  1. Check both gates — abort if either is false
  2. Set status = 'processing'
  3. Call platform OAuth API via PlatformConnection.access_token
  4. On success: set status = 'published', set external_id + external_url + published_at
  5. On failure: set status = 'failed', set error_message, increment retry_count
```

### Compliance Gates
Both `safeguards_passed` and `trademark_cleared` must be `true` before any publish function proceeds. These are written by separate validation functions — never skip them or set them in the frontend.

### Retry Logic
`retry_count` is incremented on each failure. After 3 retries, set `status = 'cancelled'` and alert the seller.

### Automation-Triggered Publishing
`PublishingAutomation` records define rules that create `PublishingQueue` entries automatically on product create/update or schedule. The automation function should write the queue record then let the pipeline function handle the actual publish.

---

## 10. AI Subsystem

### Generation Flow
```
User configures AISetupGuide (model, image provider, brand voice, price strategy)
  └─→ ProductConcept created with prompt + marketplace + brand_voice_id
        └─→ AI generation function called
              ├── Writes generated_title, generated_description, generated_tags, etc.
              ├── Sets quality_score
              ├── Logs to AiGeneration (tokens, model, cost)
              ├── Increments AIUsage.credits_used
              └─→ On approval: creates Product record, sets published_to_products = true
```

### AiGeneration Logging
Every AI call must write to `AiGeneration`:
```js
await base44.asServiceRole.entities.AiGeneration.create({
  user_id: user.id,
  type: 'listing',
  prompt: promptText,
  output: responseText,
  model: 'gpt-4o',
  tokens_used: usage.total_tokens,
});
```

### Credit Deduction
After any AI call, increment `AIUsage.credits_used`:
```js
await base44.asServiceRole.entities.AIUsage.create({
  seller_id: user.id,
  feature: 'listing_generation',
  credits_used: creditsConsumed,
});
```
Check `SubscriptionPlan.ai_credits_limit` before allowing generation. Sum `AIUsage` records in the current billing period.

### Brand Voice Injection
When `AISetupGuide.brand_voice_id` is set, the generation function should pull the `BrandVoiceProfile` and inject `tone`, `vocabulary_level`, `writing_style`, `preferred_phrases`, `avoid_words`, and `example_content` into the system prompt.

### Image Generation
Provider is determined by `AISetupGuide.ai_image_provider`. `auto` defaults to `openai_dalle3`. Generated images are stored as URIs in `ProductConcept.generated_images` and `Listing.generated_images`.

---

## 11. Onboarding Flow

7-step wizard. One `OnboardingState` record per user created on first login.

| Step | Name | Completion trigger |
|---|---|---|
| 1 | Persona selection | `persona` field set |
| 2 | Brand voice setup | `brand_voice_complete = true` |
| 3 | First product upload | `first_product_uploaded_at` set |
| 4 | Platform connection | `first_platform_connected` set |
| 5 | AI first generation | `ai_first_generation_at` set |
| 6 | First publish | `first_product_published_at` set |
| 7 | Social connection | `social_connected = true` |

Steps can be skipped — `skipped_steps[]` tracks which. `pricing_activated` and `is_complete` / `completed_at` are set independently.

**Pattern**: Always upsert `OnboardingState`, never create a second record:
```js
const existing = await base44.entities.OnboardingState.filter({ user_id: user.id });
if (existing.length) {
  await base44.entities.OnboardingState.update(existing[0].id, { step_2_done: true, ... });
} else {
  await base44.entities.OnboardingState.create({ user_id: user.id, step_2_done: true, ... });
}
```

---

## 12. Automations

### Existing Automations
| Name | Type | Trigger | Function |
|---|---|---|---|
| Order Compliance Check | Entity | Order create/update (`status: pending/processing`) | `checkOrderCompliance` |

### Creating New Automations
1. Write and test the backend function first
2. Create the automation with `automation_type`, `entity_name`, `event_types`
3. Use `trigger_conditions` to avoid running on every event unnecessarily

### Entity Automation Payload
```js
const entityId = payload.event?.entity_id;
const data     = payload.data;           // current entity data
const oldData  = payload.old_data;       // previous data (updates only)
const changed  = payload.changed_fields; // array of changed field names
```

### Suggested Future Automations
| Trigger | Function | Purpose |
|---|---|---|
| Product create | `checkStockAlert` | Initialize StockAlert baseline |
| Product update (`inventory_count`) | `fireStockAlert` | Email if below threshold |
| Order create | `earnLoyaltyPoints` | Credit buyer after order placed |
| Return status → `refunded` | `deductLoyaltyPoints` | Reverse points on refund |
| PublishingQueue create | `runPublishPipeline` | Kick off publish on queue entry |
| PlatformConnection `token_expires_at` < 24h | `refreshOAuthToken` | Proactive token refresh |

---

## 13. Styling & Theming

### Design Tokens
Always use token-based classes — never raw hex or hardcoded Tailwind palette:
```jsx
// Good
<div className="bg-background text-foreground border-border" />
<div className="bg-primary text-primary-foreground" />

// Avoid
<div style={{ backgroundColor: '#14b8a6' }} />
```

### Dark Mode
Toggled via `document.documentElement.classList` (`light` / `dark`), stored in `localStorage`. Always include `dark:` variants:
```jsx
className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
```

### Status Badge Pattern
Define const maps at file top — Tailwind scans literal strings at build time. Never construct class names dynamically:
```jsx
const ORDER_STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  shipped:    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  delivered:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const COMPLIANCE_STATUS_STYLES = {
  pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  passed:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  flagged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const LISTING_STATUS_STYLES = {
  draft:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  active:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  sold_out: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};
```

### Responsive Design
Always mobile-first:
```jsx
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3" />
<aside className="w-64 hidden md:flex" />
```

### Spacing Conventions
- Between major page sections: `space-y-6`
- Card internals: `p-6`
- Compact row items: `p-3` or `p-4`
- Inline gaps: `gap-2` or `gap-3`

---

## 14. Security Rules & Token Handling

### OAuth Token Storage
`PlatformConnection` and `SocialPlatform` both store `access_token` and `refresh_token` in entity fields. These **must** have field-level RLS configured:

```
PlatformConnection.access_token  → read: owner only
PlatformConnection.refresh_token → read: owner only, server-side only
SocialPlatform.access_token      → read: owner only
SocialPlatform.refresh_token     → read: owner only, server-side only
```

**Never return token fields from backend functions to the frontend.** Functions that call platform APIs should read tokens server-side via `base44.asServiceRole` and never echo them in responses.

### Webhook Verification
Stripe webhooks must verify the `stripe-signature` header using `STRIPE_WEBHOOK_SECRET` before processing.
Printify webhooks must verify the HMAC-SHA256 signature using `PRINTIFY_WEBHOOK_SECRET`.

### Subscription Writes
`Subscription` entity must only be written by the `stripe-webhook` function. No frontend writes, no other functions.

### SubscriptionPlan Writes
Admin-only. Gate with `if (user?.role !== 'admin')` before any create/update.

### LoyaltyTransaction Ledger
Append-only. Never update or delete records. Balance inconsistencies are resolved by re-summing the ledger.

### PasswordResetToken
Always hash tokens before storing. Never return the raw token from a list query. Mark `used_at` on consumption.

---

## 15. Known Issues & Tech Debt

| # | File(s) | Issue | Suggested Fix |
|---|---|---|---|
| 1 | `functions/processReturn`, `functions/syncOrderStatus` | Uses `npm:@base44/sdk@0.8.23` (outdated) | Update to `0.8.25` when next touching those files |
| 2 | `functions/submitReturnRequest`, `functions/checkOrderCompliance` | Admin email hardcoded as `admin@example.com` | Read from a `Settings` entity or `Deno.env.get('ADMIN_EMAIL')` |
| 3 | `components/layout/Sidebar` | "Returns" and "Return Portal" share the same `RotateCcw` icon | Use `Inbox` or `PackageOpen` for Return Portal |
| 4 | `components/layout/Sidebar` | "Teams" and "Customers" both use `Users` icon | Differentiate with distinct icons |
| 5 | `components/layout/Sidebar` | Mixed 2-space / 4-space indentation | Standardize to 2-space |
| 6 | `pages/Orders` | `OrdersTable` accepts `onReturnLogged` prop but `Orders.jsx` never passes it | Wire up `fetchOrders` callback or remove the prop |
| 7 | `functions/syncOrderStatus` | Auth check uses try/catch to detect scheduled calls — fragile | Use `base44.asServiceRole` unconditionally for scheduled/webhook paths |
| 8 | `functions/checkOrderCompliance` | `UK` substring match false-positives on city names | Use stricter state/country parser or address normalization utility |
| 9 | Multiple pages | No error boundary — failing entity fetch silently shows empty state | Add top-level `ErrorBoundary` or per-page error UI |
| 10 | Multiple backend functions | No pagination guard on `filter()` calls on large entity sets | Add `limit` param and paginate where needed |
| 11 | `AIUsage` entity | Uses `seller_id` instead of `user_id` — inconsistent with all other entities | Migrate field name on next major refactor |
| 12 | `BrandProfile` + `BrandVoiceProfile` | Two overlapping brand entities with similar fields | Deprecate `BrandProfile`; migrate consumers to `BrandVoiceProfile` |
| 13 | `SocialPlatform.access_token` | Field-level RLS may not be configured — token visible in list queries | Verify and enforce field-level RLS in Base44 editor |
| 14 | `PlatformConnection.access_token` | Same as above | Verify and enforce field-level RLS |
| 15 | `LoyaltyAccount` | No atomic increment guards — race condition possible on concurrent orders | Use server-side function for all balance mutations; never frontend direct writes |
| 16 | `MigrationDoc`, `ProjectFile`, `MigrationFile` | Build-time scaffolding entities polluting production schema | Archive/delete once migration is verified complete |
| 17 | `PublishingQueue` | No dead-letter behavior for items stuck in `processing` state | Add TTL check — items processing for >10min should revert to `pending` or `failed` |
| 18 | `Subscription` | `seller_id` field (not `user_id`) — inconsistent | Normalize on next subscription refactor |

---

## 16. Adding New Features — Checklist

### New Page
- [ ] Create `pages/NewPage.jsx`
- [ ] Add import to `App.jsx`
- [ ] Add `<Route path="/new-page" element={<NewPage />} />` inside `<Layout>` (or outside if public)
- [ ] Add nav item to `navItems` in `Sidebar.jsx` with correct icon and `adminOnly` flag
- [ ] Include loading skeleton, empty state, and error feedback

### New Entity
- [ ] Create `entities/EntityName.json` with full JSON schema
- [ ] Include `user_id` for tenant isolation
- [ ] Add `status` enum with `default` if record has lifecycle states
- [ ] Add denormalized title/name fields for foreign references
- [ ] Do NOT define `id`, `created_date`, `updated_date`, `created_by` — auto-provided
- [ ] Set field-level RLS on any token, secret, or sensitive field

### New Backend Function
- [ ] Create `functions/functionName.js` (camelCase, no hyphens)
- [ ] Use `npm:@base44/sdk@0.8.25`
- [ ] Wrap handler in `Deno.serve(async (req) => { try { ... } catch(e) { ... } })`
- [ ] Authenticate with `base44.auth.me()` and return 401 if not authenticated
- [ ] Validate required params and return 400 if missing
- [ ] Use `base44.asServiceRole` only for automation/webhook/scheduled paths
- [ ] Return `Response.json(...)` — never a plain object
- [ ] Log to `AiGeneration` if function calls an LLM
- [ ] Increment `AIUsage` if function consumes credits
- [ ] Test with `test_backend_function` before wiring to UI

### New Automation
- [ ] Write and test the backend function first
- [ ] Confirm entity or schedule trigger type
- [ ] Add `trigger_conditions` to narrow invocation scope
- [ ] Document in the Automations table (Section 12)

### New Component
- [ ] One component per file in correct `components/<domain>/` subfolder
- [ ] Use design token classes — no raw colors
- [ ] Add `dark:` variants wherever color is applied
- [ ] Import only verified Lucide icons

### New AI Feature
- [ ] Read `AISetupGuide` for the current user before generation
- [ ] Inject `BrandVoiceProfile` if `brand_voice_id` is set
- [ ] Log every LLM call to `AiGeneration`
- [ ] Deduct credits via `AIUsage`
- [ ] Check `SubscriptionPlan.ai_credits_limit` before allowing generation
- [ ] Store generated output in the appropriate entity (e.g. `ProductConcept`, `Listing`, `SocialContent`)

### New Marketplace Integration
- [ ] Add platform slug to `PlatformConnection.platform` enum
- [ ] Create OAuth callback serverless function
- [ ] Store tokens in `PlatformConnection` — never in frontend state or unguarded entity fields
- [ ] Set field-level RLS on token fields immediately
- [ ] Update OAuth redirect URIs in the platform's developer console
- [ ] Add platform to `PublishingAutomation.target_platforms` enum if publishable

---

*Update this document whenever new entities are added, patterns change, or tech debt items are resolved.*
*Last regenerated from live Base44 schema: May 2026 · 45 entities*
