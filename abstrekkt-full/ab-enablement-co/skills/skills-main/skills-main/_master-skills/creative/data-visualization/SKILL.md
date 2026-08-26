---
name: data-visualization
description: Comprehensive guide to designing and building effective data visualizations, dashboards, and analytics interfaces using D3.js, Chart.js, Recharts, and modern charting best practices. Covers standards for accessible, performant, and insightful data displays. Use when designing, creating, or reviewing creative deliverables.
---

# Data Visualization Skill

## Overview
Comprehensive guide to designing and building effective data visualizations, dashboards, and analytics interfaces using D3.js, Chart.js, Recharts, and modern charting best practices. Covers 2025 standards for accessible, performant, and insightful data displays.

---

## When to Use This Skill
- Designing dashboards and analytics interfaces
- Building charts and graphs (bar, line, pie, scatter)
- Creating interactive data explorations
- Implementing real-time data visualizations
- Optimizing chart performance for large datasets
- Ensuring data viz accessibility (screen readers, color blindness)

---

## Data Visualization Principles

### 1. Choose the Right Chart Type

**Decision tree:**
```
What are you trying to show?

Comparison → Bar chart, Column chart
Trend over time → Line chart, Area chart
Part-to-whole → Pie chart, Donut chart, Stacked bar
Distribution → Histogram, Box plot, Violin plot
Relationship → Scatter plot, Bubble chart, Heatmap
Geospatial → Choropleth map, Symbol map, Flow map
Hierarchical → Treemap, Sunburst, Dendrogram
Network → Node-link diagram, Chord diagram
```

**Common mistakes:**
- ❌ Pie chart for >5 categories (use bar chart)
- ❌ 3D charts (distorts perception, use 2D)
- ❌ Dual-axis charts (confusing, use separate charts)
- ❌ Area charts for volatile data (line chart better)

---

### 2. Visual Encoding (Data → Visual)

**Accuracy ranking (most → least accurate):**
1. **Position** (x, y coordinates) - Best for precise comparisons
2. **Length** (bar height) - Good for comparisons
3. **Angle** (pie slices) - Okay for rough proportions
4. **Area** (bubble size) - Harder to compare
5. **Color saturation** (heatmaps) - Requires legend
6. **Color hue** (categorical) - For grouping only

**Examples:**
- **Bar chart:** Position (y-axis) + Length (bar height) = High accuracy
- **Pie chart:** Angle + Area = Lower accuracy (harder to compare slices)
- **Scatter plot:** Position (x, y) = High accuracy for relationships

**Claude action:** When recommending chart types, prefer position/length over angle/area for quantitative data.

---

### 3. Reduce Cognitive Load

**Principles:**
- **Data-ink ratio (Edward Tufte):** Maximize data, minimize non-data ink
- **Remove chart junk:** Drop shadows, 3D effects, unnecessary gridlines
- **Direct labeling:** Label lines directly (don't rely on legend)
- **Meaningful defaults:** Start y-axis at 0 for bar charts (unless there's a reason)

**Example (high data-ink ratio):**
```
✅ Good:
┌────────────────────┐
│                    │
│     ▄▄▄▄           │ Sales: ─
│    ▀    ▄▄▄▄       │ Profit: ─ ─ ─
│   ▀    ▀    ▄▄     │
│  ▀           ▀     │
└────────────────────┘
  Q1  Q2  Q3  Q4

❌ Bad:
┌────────────────────┐
│ ╔══════════════╗   │ [Legend box]
│ ║  ███████     ║   │ ■ Sales
│ ║ █ ▒▒▒▒▒▒▒    ║   │ ▒ Profit
│ ║█ ▒  ███████  ║   │
│ ║  ▒ █        █║   │ [3D, shadows,
│ ╚══════════════╝   │  grid, borders]
└────────────────────┘
```

---

### 4. Color Strategy

#### Categorical Data (Distinct Groups)
**Use qualitative color palettes:**
- **Colorblind-safe:** ColorBrewer, Tableau10, Okabe-Ito
- **Max 8 colors:** Beyond 8, colors become indistinguishable

**Example (Tableau10):**
```
#4E79A7 (blue)
#F28E2B (orange)
#E15759 (red)
#76B7B2 (teal)
#59A14F (green)
#EDC948 (yellow)
#B07AA1 (purple)
#FF9DA7 (pink)
#9C755F (brown)
#BAB0AC (gray)
```

---

#### Sequential Data (Low → High)
**Use single-hue gradients:**
- Light → Dark (e.g., light blue → dark blue)
- Good for: Heatmaps, choropleths, density plots

**Example:**
```
Low  ───────────────→  High
#E3F2FD → #2196F3 → #0D47A1
```

---

#### Diverging Data (Negative ↔ Positive)
**Use two-hue gradients:**
- Red ← White → Blue (e.g., loss ← neutral → profit)
- Good for: Sentiment, change from baseline

**Example:**
```
Negative  ←─ Neutral ─→  Positive
#D32F2F   ←  #FFFFFF  →  #1976D2
```

---

#### Accessibility:
- **Contrast ratio:** Text on colored background needs 4.5:1 (WCAG 2.2 AA)
- **Don't rely on color alone:** Add patterns, labels, or icons
- **Test with simulators:** [Coblis Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)

**Colorblind-safe palette (Okabe-Ito):**
```
#E69F00 (orange)
#56B4E9 (sky blue)
#009E73 (bluish green)
#F0E442 (yellow)
#0072B2 (blue)
#D55E00 (vermillion)
#CC79A7 (reddish purple)
#000000 (black)
```

---

### 5. Typography in Charts

**Hierarchy:**
- **Chart title:** 18-24px, bold (what is this chart about?)
- **Axis labels:** 12-14px, regular (what do axes represent?)
- **Axis values:** 10-12px, regular (tick mark labels)
- **Data labels:** 10-12px, regular (values on bars/points)
- **Annotations:** 11-13px, italic or different color (explanatory notes)

**Best practices:**
- Use sans-serif fonts (easier to read at small sizes)
- Rotate axis labels 45° if needed (avoid vertical text)
- Abbreviate large numbers (1,200,000 → 1.2M)

---

## Chart Types & Implementation

### 1. Bar Chart (Comparison)

**When to use:**
- Compare quantities across categories
- Ranking (highest to lowest)
- Time series with discrete intervals (monthly, quarterly)

**Anatomy:**
```
        Sales by Region
        
50M ┤                     ╔════╗
    │                     ║    ║
40M ┤           ╔════╗    ║ 48M║
    │           ║    ║    ╚════╝
30M ┤  ╔════╗   ║ 35M║      West
    │  ║    ║   ╚════╝
20M ┤  ║ 28M║     South
    │  ╚════╝
10M ┤   North
    │
  0 └────────────────────────────
```

**D3.js implementation:**
```javascript
import * as d3 from 'd3';

const data = [
  { region: 'North', sales: 28 },
  { region: 'South', sales: 35 },
  { region: 'West', sales: 48 }
];

const margin = { top: 20, right: 20, bottom: 40, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Scales
const x = d3.scaleBand()
  .domain(data.map(d => d.region))
  .range([0, width])
  .padding(0.2);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.sales)])
  .range([height, 0]);

// Axes
svg.append('g')
  .attr('transform', `translate(0,${height})`)
  .call(d3.axisBottom(x));

svg.append('g')
  .call(d3.axisLeft(y).tickFormat(d => `${d}M`));

// Bars
svg.selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => x(d.region))
  .attr('y', d => y(d.sales))
  .attr('width', x.bandwidth())
  .attr('height', d => height - y(d.sales))
  .attr('fill', '#4E79A7');

// Data labels
svg.selectAll('.label')
  .data(data)
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('x', d => x(d.region) + x.bandwidth() / 2)
  .attr('y', d => y(d.sales) - 5)
  .attr('text-anchor', 'middle')
  .text(d => `${d.sales}M`);
```

**Chart.js implementation (simpler):**
```javascript
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['North', 'South', 'West'],
  datasets: [{
    label: 'Sales',
    data: [28, 35, 48],
    backgroundColor: '#4E79A7'
  }]
};

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Sales by Region'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value}M`
      }
    }
  }
};

<Bar data={data} options={options} />
```

---

### 2. Line Chart (Trend Over Time)

**When to use:**
- Show trends over time
- Continuous data (temperature, stock price)
- Multiple series comparison

**Best practices:**
- Start y-axis at 0 (unless data is bounded, e.g., percentage)
- Use direct labels on lines (not just legend)
- Max 5 lines (beyond that, use small multiples)

**Recharts implementation (React):**
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { month: 'Jan', sales: 28, profit: 15 },
  { month: 'Feb', sales: 32, profit: 18 },
  { month: 'Mar', sales: 35, profit: 20 },
  { month: 'Apr', sales: 38, profit: 22 },
  { month: 'May', sales: 42, profit: 25 },
  { month: 'Jun', sales: 48, profit: 28 }
];

<LineChart width={600} height={400} data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
  <XAxis dataKey="month" />
  <YAxis tickFormatter={(value) => `$${value}M`} />
  <Tooltip formatter={(value) => `$${value}M`} />
  <Legend />
  <Line 
    type="monotone" 
    dataKey="sales" 
    stroke="#4E79A7" 
    strokeWidth={2}
    dot={{ r: 4 }}
    activeDot={{ r: 6 }}
  />
  <Line 
    type="monotone" 
    dataKey="profit" 
    stroke="#F28E2B" 
    strokeWidth={2}
    strokeDasharray="5 5"
    dot={{ r: 4 }}
  />
</LineChart>
```

---

### 3. Pie Chart (Part-to-Whole)

**When to use:**
- Show proportions (parts of a whole)
- Max 5 slices (beyond that, use bar chart)
- Total adds to 100%

**Better alternative:** Donut chart (easier to compare slices)

**Chart.js implementation:**
```javascript
import { Doughnut } from 'react-chartjs-2';

const data = {
  labels: ['North', 'South', 'East', 'West'],
  datasets: [{
    data: [28, 35, 22, 48],
    backgroundColor: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2'],
    borderWidth: 2,
    borderColor: '#ffffff'
  }]
};

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Sales Distribution by Region'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: ${percentage}%`;
        }
      }
    }
  }
};

<Doughnut data={data} options={options} />
```

---


## References
- `references/4-scatter-plot-relationship.md` — 4. Scatter Plot (Relationship)
- `references/dashboard-design-patterns.md` — Dashboard Design Patterns
- `references/references.md` — References
