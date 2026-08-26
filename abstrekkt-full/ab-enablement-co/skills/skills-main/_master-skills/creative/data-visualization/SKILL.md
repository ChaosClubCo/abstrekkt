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

### 4. Scatter Plot (Relationship)

**When to use:**
- Show correlation between two variables
- Identify outliers
- Cluster detection

**Enhancements:**
- Add trend line (linear regression)
- Size bubbles by third variable (bubble chart)
- Color by category

**D3.js implementation with trend line:**
```javascript
const data = [
  { adSpend: 10, sales: 28 },
  { adSpend: 15, sales: 35 },
  { adSpend: 20, sales: 42 },
  { adSpend: 25, sales: 48 },
  { adSpend: 30, sales: 55 }
];

// Linear regression
const xMean = d3.mean(data, d => d.adSpend);
const yMean = d3.mean(data, d => d.sales);
const slope = data.reduce((acc, d) => acc + (d.adSpend - xMean) * (d.sales - yMean), 0) /
               data.reduce((acc, d) => acc + (d.adSpend - xMean) ** 2, 0);
const intercept = yMean - slope * xMean;

const trendLine = [
  { x: d3.min(data, d => d.adSpend), y: intercept + slope * d3.min(data, d => d.adSpend) },
  { x: d3.max(data, d => d.adSpend), y: intercept + slope * d3.max(data, d => d.adSpend) }
];

// Scatter plot
svg.selectAll('.dot')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('cx', d => x(d.adSpend))
  .attr('cy', d => y(d.sales))
  .attr('r', 5)
  .attr('fill', '#4E79A7');

// Trend line
svg.append('line')
  .attr('x1', x(trendLine[0].x))
  .attr('y1', y(trendLine[0].y))
  .attr('x2', x(trendLine[1].x))
  .attr('y2', y(trendLine[1].y))
  .attr('stroke', '#E15759')
  .attr('stroke-width', 2)
  .attr('stroke-dasharray', '5,5');
```

---

### 5. Heatmap (2D Density)

**When to use:**
- Show patterns in 2D data (e.g., website traffic by hour/day)
- Correlation matrices
- Geographic density

**D3.js implementation:**
```javascript
const data = [
  { day: 'Mon', hour: 9, value: 120 },
  { day: 'Mon', hour: 12, value: 200 },
  // ... more data
];

const colorScale = d3.scaleSequential(d3.interpolateBlues)
  .domain([0, d3.max(data, d => d.value)]);

svg.selectAll('.cell')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'cell')
  .attr('x', d => x(d.hour))
  .attr('y', d => y(d.day))
  .attr('width', x.bandwidth())
  .attr('height', y.bandwidth())
  .attr('fill', d => colorScale(d.value))
  .on('mouseover', (event, d) => {
    tooltip.style('visibility', 'visible')
      .text(`${d.day} ${d.hour}:00 - ${d.value} visits`);
  });
```

---

## Dashboard Design Patterns

### 1. KPI Cards (Key Performance Indicators)

**Anatomy:**
```
┌─────────────────────────┐
│ Revenue                 │
│ $1.2M         ▲ 15%    │ ← Metric + Change
│ vs last month           │ ← Context
└─────────────────────────┘
```

**Implementation:**
```jsx
function KPICard({ title, value, change, trend }) {
  const isPositive = change >= 0;
  
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className={`change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '▲' : '▼'} {Math.abs(change)}%
      </div>
      <div className="context">vs last month</div>
    </div>
  );
}
```

---

### 2. Small Multiples (Trellis Charts)

**When to use:**
- Compare trends across multiple categories
- Reduce cognitive load (easier than multi-line chart)

**Example:**
```
Sales Trend by Region

North           South           East            West
───────         ───────         ───────         ───────
  ▄▄▄             ▄▄▄▄            ▄▄              ▄▄▄▄▄
 ▀   ▀          ▀    ▀          ▀  ▀            ▀     ▀
```

**Implementation (Recharts):**
```jsx
const regions = ['North', 'South', 'East', 'West'];

<div className="small-multiples">
  {regions.map(region => (
    <div key={region} className="small-chart">
      <h4>{region}</h4>
      <LineChart width={200} height={100} data={data.filter(d => d.region === region)}>
        <Line type="monotone" dataKey="sales" stroke="#4E79A7" strokeWidth={2} dot={false} />
      </LineChart>
    </div>
  ))}
</div>
```

---

### 3. Drill-Down / Hierarchy

**Pattern:** Overview → Details on demand

**Example:**
1. Top level: Total sales by quarter
2. Click Q3 → Breakdown by month (July, Aug, Sept)
3. Click August → Breakdown by product category

**Implementation (state-based):**
```jsx
const [selectedQuarter, setSelectedQuarter] = useState(null);
const [selectedMonth, setSelectedMonth] = useState(null);

return (
  <>
    {!selectedQuarter && (
      <BarChart data={quarterlyData} onBarClick={(q) => setSelectedQuarter(q)} />
    )}
    
    {selectedQuarter && !selectedMonth && (
      <BarChart 
        data={monthlyData.filter(d => d.quarter === selectedQuarter)} 
        onBarClick={(m) => setSelectedMonth(m)}
        onBack={() => setSelectedQuarter(null)}
      />
    )}
    
    {selectedMonth && (
      <BarChart 
        data={productData.filter(d => d.month === selectedMonth)}
        onBack={() => setSelectedMonth(null)}
      />
    )}
  </>
);
```

---

### 4. Filter Controls

**Best practices:**
- Place filters above or left of chart (not below)
- Show selected state clearly
- Provide "Clear all" option
- Preserve filters across sessions (localStorage)

**Implementation:**
```jsx
function Dashboard() {
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
  const [region, setRegion] = useState('all');
  
  const filteredData = useMemo(() => {
    return data.filter(d => {
      const inDateRange = d.date >= dateRange.start && d.date <= dateRange.end;
      const matchesRegion = region === 'all' || d.region === region;
      return inDateRange && matchesRegion;
    });
  }, [data, dateRange, region]);
  
  return (
    <>
      <div className="filters">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <Select value={region} onChange={setRegion} options={['all', 'North', 'South', 'East', 'West']} />
      </div>
      
      <LineChart data={filteredData} />
    </>
  );
}
```

---

## Interactivity Patterns

### 1. Tooltips (Hover Details)

**Best practices:**
- Show on hover, not click (click for drill-down)
- Position near cursor (but not under it)
- Include: Label, Value, Context (e.g., % of total)
- Timeout: Appear after 300ms (avoid flickering)

**Implementation (D3.js):**
```javascript
const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('visibility', 'hidden');

svg.selectAll('.bar')
  .on('mouseover', (event, d) => {
    tooltip.style('visibility', 'visible')
      .html(`
        <strong>${d.region}</strong><br>
        Sales: $${d.sales}M<br>
        ${((d.sales / totalSales) * 100).toFixed(1)}% of total
      `);
  })
  .on('mousemove', (event) => {
    tooltip.style('top', (event.pageY - 30) + 'px')
      .style('left', (event.pageX + 10) + 'px');
  })
  .on('mouseout', () => {
    tooltip.style('visibility', 'hidden');
  });
```

---

### 2. Zoom & Pan (Large Datasets)

**Use cases:**
- Time series with 1000s of points
- Geographic maps
- Network diagrams

**D3.js zoom:**
```javascript
const zoom = d3.zoom()
  .scaleExtent([1, 10]) // Min 1x, max 10x zoom
  .on('zoom', (event) => {
    svg.attr('transform', event.transform);
  });

svg.call(zoom);
```

**Alternative: Brush selection (highlight range):**
```javascript
const brush = d3.brushX()
  .extent([[0, 0], [width, height]])
  .on('end', (event) => {
    if (event.selection) {
      const [x0, x1] = event.selection.map(x.invert);
      // Update chart to show only data between x0 and x1
    }
  });

svg.append('g')
  .attr('class', 'brush')
  .call(brush);
```

---

### 3. Highlighting & Selection

**Pattern:** Click to select, dim others

**Implementation:**
```jsx
const [selectedRegion, setSelectedRegion] = useState(null);

<BarChart data={data}>
  {data.map(d => (
    <Bar
      key={d.region}
      data={d}
      opacity={selectedRegion && selectedRegion !== d.region ? 0.3 : 1}
      onClick={() => setSelectedRegion(d.region)}
    />
  ))}
</BarChart>
```

---

## Performance Optimization

### 1. Large Datasets (>1000 points)

**Strategies:**

#### Aggregation (Server-side)
```javascript
// Instead of sending 10,000 hourly data points:
// Send 365 daily aggregates (mean, min, max)

const dailyAggregates = hourlyData.reduce((acc, d) => {
  const day = d.timestamp.slice(0, 10); // YYYY-MM-DD
  if (!acc[day]) {
    acc[day] = { values: [], day };
  }
  acc[day].values.push(d.value);
  return acc;
}, {});

const chartData = Object.values(dailyAggregates).map(d => ({
  day: d.day,
  mean: d3.mean(d.values),
  min: d3.min(d.values),
  max: d3.max(d.values)
}));
```

---

#### Downsampling (Client-side)
```javascript
// Largest-Triangle-Three-Buckets (LTTB) algorithm
// Reduces 10,000 points to 500 while preserving shape

import { LTTB } from 'downsample';

const downsampledData = LTTB(data, 500);
```

---

#### Virtualization (Only render visible)
```javascript
// For tables with 10,000+ rows
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={data.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      {data[index].region}: ${data[index].sales}M
    </div>
  )}
</FixedSizeList>
```

---

### 2. Real-Time Updates

**Strategies:**

#### Incremental Updates (Append, don't replace)
```javascript
// ❌ Bad: Re-render entire chart on each data point
useEffect(() => {
  setData([...data, newPoint]); // Causes full re-render
}, [newPoint]);

// ✅ Good: Update only new data
useEffect(() => {
  svg.selectAll('.new-point')
    .data([newPoint])
    .enter()
    .append('circle')
    .attr('cx', d => x(d.time))
    .attr('cy', d => y(d.value));
}, [newPoint]);
```

---

#### Debounce Updates (Batch changes)
```javascript
import { debounce } from 'lodash';

const updateChart = debounce((newData) => {
  setChartData(newData);
}, 500); // Update at most every 500ms

useEffect(() => {
  const interval = setInterval(() => {
    const newPoint = fetchLatestData();
    updateChart([...chartData, newPoint]);
  }, 100); // New data every 100ms, but chart updates every 500ms
  
  return () => clearInterval(interval);
}, []);
```

---

### 3. Canvas vs SVG

**SVG:**
- ✅ Scalable (vector)
- ✅ CSS styling
- ✅ Accessibility (DOM nodes)
- ❌ Slow for >1000 elements

**Canvas:**
- ✅ Fast for >1000 elements
- ✅ Pixel-perfect control
- ❌ Not scalable (raster)
- ❌ No CSS styling
- ❌ Accessibility harder (no DOM)

**Rule of thumb:**
- <1000 points → SVG (D3.js, Recharts, Chart.js default)
- >1000 points → Canvas (Chart.js with canvas renderer)

**Chart.js canvas mode:**
```javascript
// Chart.js uses canvas by default (performant)
<Line data={largeDataset} options={{ animation: false }} />
```

---

## Accessibility

### 1. Screen Reader Support

**Requirements:**
- ARIA roles (`role="img"` for charts)
- ARIA labels (`aria-label` for chart description)
- Table fallback (data table for screen readers)

**Implementation:**
```jsx
<div role="img" aria-label="Bar chart showing sales by region. North: $28M, South: $35M, West: $48M.">
  <BarChart data={data} />
  
  {/* Hidden table for screen readers */}
  <table className="sr-only">
    <caption>Sales by Region</caption>
    <thead>
      <tr>
        <th>Region</th>
        <th>Sales (Millions)</th>
      </tr>
    </thead>
    <tbody>
      {data.map(d => (
        <tr key={d.region}>
          <td>{d.region}</td>
          <td>${d.sales}M</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

### 2. Keyboard Navigation

**Requirements:**
- Tab through interactive elements (bars, points, legend)
- Enter/Space to activate
- Arrow keys to navigate between data points

**Implementation (D3.js):**
```javascript
svg.selectAll('.bar')
  .attr('tabindex', 0) // Make focusable
  .on('keydown', (event, d) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Trigger click action
      handleBarClick(d);
    }
  })
  .on('focus', (event, d) => {
    // Show tooltip on focus
    showTooltip(d);
  });
```

---

### 3. Color Independence

**Don't rely on color alone:**
- Add patterns (stripes, dots) to distinguish bars
- Add labels directly on data (not just legend)
- Use shapes (circle, square, triangle) for scatter plots

**Example (patterned bars):**
```svg
<defs>
  <pattern id="stripe" patternUnits="userSpaceOnUse" width="4" height="4">
    <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000" stroke-width="1"/>
  </pattern>
</defs>

<rect fill="url(#stripe)" ... />
```

---

## Tools & Libraries

### Charting Libraries

#### Chart.js
**Pros:** Simple API, good defaults, canvas (performant)  
**Cons:** Less flexible, harder to customize  
**Use for:** Dashboards, standard charts (bar, line, pie)

---

#### D3.js
**Pros:** Most powerful, full control, SVG  
**Cons:** Steep learning curve, verbose  
**Use for:** Custom visualizations, interactive explorations

---

#### Recharts
**Pros:** React-first, declarative, responsive  
**Cons:** Limited chart types  
**Use for:** React apps, quick prototyping

---

#### Plotly
**Pros:** 3D charts, statistical plots, Python integration  
**Cons:** Large bundle size (>1MB)  
**Use for:** Scientific visualizations, 3D data

---

#### Observable Plot
**Pros:** Declarative, concise syntax, D3 ecosystem  
**Cons:** Newer, smaller community  
**Use for:** Exploratory data analysis, notebooks

---

### Dashboard Tools

- **Tableau:** Enterprise BI, drag-and-drop
- **Looker:** SQL-based, embedded analytics
- **Metabase:** Open-source, self-service BI
- **Grafana:** Time-series, monitoring dashboards
- **Superset:** Open-source, Python-based

---

## Common Pitfalls

### ❌ Anti-Patterns:
1. **3D charts** (distorts perception)
2. **Pie charts for >5 categories** (use bar chart)
3. **Dual-axis charts** (confusing, use separate charts)
4. **Not starting bar charts at 0** (misleading)
5. **Too many colors** (>8 in one chart)
6. **Relying on color alone** (accessibility failure)
7. **Unlabeled axes** (what am I looking at?)
8. **No context** (is 28M good? vs what?)

### ✅ Best Practices:
1. **Choose the right chart type** (follow decision tree)
2. **Start y-axis at 0 for bar charts** (unless bounded data)
3. **Use colorblind-safe palettes** (Okabe-Ito, ColorBrewer)
4. **Label directly on chart** (not just legend)
5. **Provide context** (vs last year, vs goal)
6. **Reduce chart junk** (high data-ink ratio)
7. **Test with screen readers** (ARIA labels, table fallback)
8. **Optimize for large datasets** (aggregate, downsample)

---

## Gaps & Blindspots

### Known Limitations:
- **Geographic visualizations:** Choropleth maps, projections (separate skillset)
- **Network diagrams:** Force-directed layouts, graph theory (D3 force simulation)
- **Real-time streaming:** WebSocket integration, live data feeds (complex)
- **3D visualizations:** Three.js, WebGL (performance-intensive)
- **Statistical plots:** Box plots, violin plots, regression (less common)

### Unknown Unknowns:
- **AI-generated insights:** Auto-generated chart recommendations (quality concerns)
- **Natural language queries:** "Show me sales in Q3" → Automatic chart generation
- **AR/VR data viz:** Immersive data exploration (Vision Pro)
- **Voice-controlled dashboards:** "Alexa, what's my conversion rate?"

---

**Next Steps After Using This Skill:**
1. Choose chart library → Chart.js (simple), D3.js (custom), Recharts (React)
2. Design dashboard layout → KPIs, filters, main charts, drill-downs
3. Implement accessibility → ARIA labels, keyboard nav, table fallback
4. Optimize performance → Aggregate large datasets, use canvas for >1000 points
5. Test with users → Can they understand the data? Find insights?
