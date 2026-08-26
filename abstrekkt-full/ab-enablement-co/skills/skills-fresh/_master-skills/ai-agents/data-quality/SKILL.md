---
name: data-quality
description: Helps configure and build data quality processes. name: data-quality description: Validation rules, data cleansing, deduplication, and quality assurance. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Data Quality

---
name: data-quality
description: Validation rules, data cleansing, deduplication, and quality assurance
version: 1.0.0
category: data-management
tags: [data-quality, validation, cleansing, deduplication, testing, governance]
related_skills: [data-modeling, etl-pipelines, data-governance]
---

## Overview

Data Quality encompasses the processes and technologies used to ensure data accuracy, completeness, consistency, and reliability. This skill covers implementing validation rules, data cleansing procedures, deduplication algorithms, and quality monitoring systems.

High-quality data is essential for trustworthy analytics and reliable decision-making. Poor data quality leads to incorrect insights, failed processes, and eroded trust in data systems. Effective data quality management catches issues early and maintains data integrity throughout the data lifecycle.

### Key Principles

1. **Prevention Over Cure**: Validate at the source when possible
2. **Measure Continuously**: Quality must be monitored, not assumed
3. **Define Standards**: Clear definitions of what "good" data looks like
4. **Automate Checks**: Quality checks should run automatically
5. **Accountability**: Clear ownership of data quality

## When to Use This Skill

### Appropriate Scenarios

- Implementing data validation pipelines
- Building data quality dashboards
- Deduplicating master data records
- Cleansing historical data
- Setting up data quality monitoring
- Defining data quality SLAs
- Preparing data for migration
- Auditing data for compliance

### When to Consider Alternatives

- **Schema validation only**: Use database constraints
- **Real-time validation**: Consider stream processing
- **UI validation**: Frontend validation frameworks
- **Simple null checks**: Database NOT NULL constraints

## Core Processes

### 1. Data Quality Framework

```python
# quality_framework.py
from dataclasses import dataclass, field
from typing import List, Dict, Any, Callable, Optional
from enum import Enum
from datetime import datetime
import pandas as pd
import re

class QualityDimension(Enum):
    COMPLETENESS = "completeness"
    ACCURACY = "accuracy"
    CONSISTENCY = "consistency"
    TIMELINESS = "timeliness"
    UNIQUENESS = "uniqueness"
    VALIDITY = "validity"

@dataclass
class QualityRule:
    """Definition of a data quality rule."""
    name: str
    dimension: QualityDimension
    description: str
    check_function: Callable
    severity: str = "error"  # error, warning, info
    threshold: float = 1.0  # Minimum pass rate (0-1)
    columns: List[str] = field(default_factory=list)

@dataclass
class QualityResult:
    """Result of a quality check."""
    rule_name: str
    dimension: str
    passed: bool
    pass_rate: float
    total_records: int
    failed_records: int
    severity: str
    details: Optional[Dict[str, Any]] = None
    failed_examples: Optional[List[Dict]] = None

class DataQualityEngine:
    """Engine for running data quality checks."""

    def __init__(self, df: pd.DataFrame, dataset_name: str):
        self.df = df
        self.dataset_name = dataset_name
        self.rules: List[QualityRule] = []
        self.results: List[QualityResult] = []

    def add_completeness_check(
        self,
        column: str,
        threshold: float = 1.0,
        severity: str = "error"
    ) -> 'DataQualityEngine':
        """Check for null values in a column."""
        def check(df):
            non_null = df[column].notna()
            return non_null, ~non_null

        self.rules.append(QualityRule(
            name=f"completeness_{column}",
            dimension=QualityDimension.COMPLETENESS,
            description=f"Column {column} should not have null values",
            check_function=check,
            severity=severity,
            threshold=threshold,
            columns=[column]
        ))
        return self

    def add_uniqueness_check(
        self,
        columns: List[str],
        threshold: float = 1.0,
        severity: str = "error"
    ) -> 'DataQualityEngine':
        """Check for duplicate values."""
        def check(df):
            is_unique = ~df.duplicated(subset=columns, keep=False)
            return is_unique, ~is_unique

        col_str = "_".join(columns)
        self.rules.append(QualityRule(
            name=f"uniqueness_{col_str}",
            dimension=QualityDimension.UNIQUENESS,
            description=f"Columns {columns} should be unique",
            check_function=check,
            severity=severity,
            threshold=threshold,
            columns=columns
        ))
        return self

    def add_validity_check(
        self,
        column: str,
        pattern: str,
        description: str = None,
        severity: str = "error"
    ) -> 'DataQualityEngine':
        """Check values match a regex pattern."""
        def check(df):
            # Handle nulls gracefully
            valid = df[column].fillna('').astype(str).str.match(pattern)
            return valid, ~valid

        self.rules.append(QualityRule(
            name=f"validity_{column}",
            dimension=QualityDimension.VALIDITY,
            description=description or f"Column {column} should match pattern {pattern}",
            check_function=check,
            severity=severity,
            columns=[column]
        ))
        return self

    def add_range_check(
        self,
        column: str,
        min_value: float = None,
        max_value: float = None,
        severity: str = "error"
    ) -> 'DataQualityEngine':
        """Check values are within a range."""
        def check(df):
            valid = pd.Series([True] * len(df), index=df.index)
            if min_value is not None:
                valid &= df[column] >= min_value
            if max_value is not None:
                valid &= df[column] <= max_value
            return valid, ~valid

        self.rules.append(QualityRule(
            name=f"range_{column}",
            dimension=QualityDimension.ACCURACY,
            description=f"Column {column} should be between {min_value} and {max_value}",
            check_function=check,
            severity=severity,
            columns=[column]
        ))
        return self

    def add_referential_check(
        self,
        column: str,
        reference_df: pd.DataFrame,
        reference_column: str,
        severity: str = "error"
    ) -> 'DataQualityEngine':
        """Check referential integrity."""
        def check(df):
            valid = df[column].isin(reference_df[reference_column])
            return valid, ~valid

        self.rules.append(QualityRule(
            name=f"referential_{column}",
            dimension=QualityDimension.CONSISTENCY,
            description=f"Column {column} should reference valid {reference_column}",
            check_function=check,
            severity=severity,
            columns=[column]
        ))
        return self

    def add_custom_check(
        self,
        name: str,
        check_function: Callable,
        dimension: QualityDimension,
        description: str,
        severity: str = "error",
        columns: List[str] = None
    ) -> 'DataQualityEngine':
        """Add a custom quality check."""
        self.rules.append(QualityRule(
            name=name,
            dimension=dimension,
            description=description,
            check_function=check_function,
            severity=severity,
            columns=columns or []
        ))
        return self

    def run(self, sample_failed: int = 5) -> List[QualityResult]:
        """Execute all quality checks."""
        self.results = []

        for rule in self.rules:
            try:
                passed_mask, failed_mask = rule.check_function(self.df)
                total = len(self.df)
                passed_count = passed_mask.sum()
                failed_count = failed_mask.sum()
                pass_rate = passed_count / total if total > 0 else 1.0

                # Get sample of failed records
                failed_examples = None
                if failed_count > 0 and sample_failed > 0:
                    sample_df = self.df[failed_mask].head(sample_failed)
                    failed_examples = sample_df[rule.columns].to_dict('records') if rule.columns else None

                self.results.append(QualityResult(
                    rule_name=rule.name,
                    dimension=rule.dimension.value,
                    passed=pass_rate >= rule.threshold,
                    pass_rate=pass_rate,
                    total_records=total,
                    failed_records=failed_count,
                    severity=rule.severity,
                    details={
                        'threshold': rule.threshold,
                        'description': rule.description
                    },
                    failed_examples=failed_examples
                ))

            except Exception as e:
                self.results.append(QualityResult(
                    rule_name=rule.name,
                    dimension=rule.dimension.value,
                    passed=False,
                    pass_rate=0,
                    total_records=len(self.df),
                    failed_records=len(self.df),
                    severity="error",
                    details={'error': str(e)}
                ))

        return self.results

    def get_summary(self) -> Dict[str, Any]:
        """Get summary of quality check results."""
        if not self.results:
            self.run()

        passed = sum(1 for r in self.results if r.passed)
        failed = len(self.results) - passed

        return {
            'dataset': self.dataset_name,
            'timestamp': datetime.utcnow().isoformat(),
            'total_records': len(self.df),
            'total_checks': len(self.results),
            'passed_checks': passed,
            'failed_checks': failed,
            'pass_rate': passed / len(self.results) if self.results else 1.0,
            'by_dimension': self._group_by_dimension(),
            'by_severity': self._group_by_severity(),
            'all_passed': failed == 0
        }

    def _group_by_dimension(self) -> Dict[str, Dict]:
        """Group results by quality dimension."""
        dimensions = {}
        for result in self.results:
            dim = result.dimension
            if dim not in dimensions:
                dimensions[dim] = {'passed': 0, 'failed': 0}
            if result.passed:
                dimensions[dim]['passed'] += 1
            else:
                dimensions[dim]['failed'] += 1
        return dimensions

    def _group_by_severity(self) -> Dict[str, int]:
        """Count failures by severity."""
        severities = {'error': 0, 'warning': 0, 'info': 0}
        for result in self.results:
            if not result.passed:
                severities[result.severity] = severities.get(result.severity, 0) + 1
        return severities
```

### 2. Deduplication Algorithms

```python
# deduplication.py
import pandas as pd
import numpy as np
from typing import List, Tuple, Dict, Optional
from dataclasses import dataclass
import hashlib
from difflib import SequenceMatcher

@dataclass
class DedupeConfig:
    """Configuration for deduplication."""
    exact_match_columns: List[str]
    fuzzy_match_columns: List[str] = None
    fuzzy_threshold: float = 0.85
    blocking_columns: List[str] = None
    keep_strategy: str = 'first'  # first, last, most_complete

class Deduplicator:
    """Entity deduplication engine."""

    def __init__(self, df: pd.DataFrame, config: DedupeConfig):
        self.df = df.copy()
        self.config = config
        self.duplicate_groups: List[List[int]] = []

    def find_exact_duplicates(self) -> pd.DataFrame:
        """Find exact duplicates based on specified columns."""
        columns = self.config.exact_match_columns
        duplicates = self.df[self.df.duplicated(subset=columns, keep=False)]
        return duplicates

    def create_blocking_key(self, row: pd.Series) -> str:
        """Create blocking key for candidate pair generation."""
        if not self.config.blocking_columns:
            return "all"

        key_parts = []
        for col in self.config.blocking_columns:
            value = str(row[col]).lower().strip()
            if col.endswith('name'):
                # Use first 3 characters for names
                key_parts.append(value[:3] if len(value) >= 3 else value)
            elif col == 'email':
                # Use email domain
                if '@' in value:
                    key_parts.append(value.split('@')[1])
            else:
                key_parts.append(value[:5])

        return '|'.join(key_parts)

    def similarity_score(self, s1: str, s2: str) -> float:
        """Calculate string similarity using SequenceMatcher."""
        if pd.isna(s1) or pd.isna(s2):
            return 0.0
        return SequenceMatcher(None, str(s1).lower(), str(s2).lower()).ratio()

    def calculate_record_similarity(
        self,
        row1: pd.Series,
        row2: pd.Series
    ) -> float:
        """Calculate overall similarity between two records."""
        if not self.config.fuzzy_match_columns:
            return 0.0

        similarities = []
        for col in self.config.fuzzy_match_columns:
            sim = self.similarity_score(row1[col], row2[col])
            similarities.append(sim)

        return np.mean(similarities)

    def find_fuzzy_duplicates(self) -> List[Tuple[int, int, float]]:
        """Find fuzzy duplicates using blocking and similarity."""
        # Create blocking keys
        self.df['_blocking_key'] = self.df.apply(self.create_blocking_key, axis=1)

        duplicates = []
        blocks = self.df.groupby('_blocking_key')

        for block_key, block_df in blocks:
            if len(block_df) < 2:
                continue

            indices = block_df.index.tolist()

            # Compare all pairs within block
            for i in range(len(indices)):
                for j in range(i + 1, len(indices)):
                    idx1, idx2 = indices[i], indices[j]
                    similarity = self.calculate_record_similarity(
                        self.df.loc[idx1],
                        self.df.loc[idx2]
                    )

                    if similarity >= self.config.fuzzy_threshold:
                        duplicates.append((idx1, idx2, similarity))

        # Clean up
        self.df.drop('_blocking_key', axis=1, inplace=True)

        return duplicates

    def create_duplicate_clusters(
        self,
        duplicate_pairs: List[Tuple[int, int, float]]
    ) -> List[List[int]]:
        """Group duplicate pairs into clusters."""
        # Union-Find for clustering
        parent = {}

        def find(x):
            if x not in parent:
                parent[x] = x
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py

        # Build clusters
        for idx1, idx2, _ in duplicate_pairs:
            union(idx1, idx2)

        # Group by cluster root
        clusters = {}
        for idx1, idx2, _ in duplicate_pairs:
            root = find(idx1)
            if root not in clusters:
                clusters[root] = set()
            clusters[root].add(idx1)
            clusters[root].add(idx2)

        return [list(cluster) for cluster in clusters.values()]

    def select_survivor(self, cluster: List[int]) -> int:
        """Select the surviving record from a cluster."""
        cluster_df = self.df.loc[cluster]

        if self.config.keep_strategy == 'first':
            return cluster[0]
        elif self.config.keep_strategy == 'last':
            return cluster[-1]
        elif self.config.keep_strategy == 'most_complete':
            # Count non-null values
            completeness = cluster_df.notna().sum(axis=1)
            return completeness.idxmax()

        return cluster[0]

    def deduplicate(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Run deduplication and return clean data and duplicates."""
        # Find duplicates
        fuzzy_dupes = self.find_fuzzy_duplicates()
        clusters = self.create_duplicate_clusters(fuzzy_dupes)

        # Mark duplicates
        duplicate_indices = set()
        survivor_indices = set()

        for cluster in clusters:
            survivor = self.select_survivor(cluster)
            survivor_indices.add(survivor)
            duplicate_indices.update(set(cluster) - {survivor})

        # Split dataframe
        clean_df = self.df.drop(index=list(duplicate_indices))
        duplicate_df = self.df.loc[list(duplicate_indices)].copy()

        return clean_df, duplicate_df


# Usage example
def deduplicate_customers(df: pd.DataFrame) -> pd.DataFrame:
    """Deduplicate customer records."""
    config = DedupeConfig(
        exact_match_columns=['email'],
        fuzzy_match_columns=['first_name', 'last_name', 'phone'],
        fuzzy_threshold=0.85,
        blocking_columns=['last_name', 'email'],
        keep_strategy='most_complete'
    )

    deduper = Deduplicator(df, config)
    clean_df, duplicates_df = deduper.deduplicate()

    print(f"Removed {len(duplicates_df)} duplicate records")
    return clean_df
```

### 3. Data Cleansing Pipeline

```python
# cleansing.py
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any
import re
from datetime import datetime

class DataCleanser:
    """Pipeline for data cleansing operations."""

    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.changes_log: List[Dict] = []

    def log_change(self, operation: str, column: str, affected: int):
        """Log cleansing operation."""
        self.changes_log.append({
            'timestamp': datetime.utcnow().isoformat(),
            'operation': operation,
            'column': column,
            'affected_records': affected
        })

    def standardize_text(
        self,
        column: str,
        case: str = 'lower',
        strip: bool = True,
        remove_extra_spaces: bool = True
    ) -> 'DataCleanser':
        """Standardize text values."""
        original = self.df[column].copy()

        if strip:
            self.df[column] = self.df[column].str.strip()

        if remove_extra_spaces:
            self.df[column] = self.df[column].str.replace(r'\s+', ' ', regex=True)

        if case == 'lower':
            self.df[column] = self.df[column].str.lower()
        elif case == 'upper':
            self.df[column] = self.df[column].str.upper()
        elif case == 'title':
            self.df[column] = self.df[column].str.title()

        affected = (original != self.df[column]).sum()
        self.log_change('standardize_text', column, affected)

        return self

    def standardize_phone(
        self,
        column: str,
        format_pattern: str = '+1-XXX-XXX-XXXX'
    ) -> 'DataCleanser':
        """Standardize phone numbers."""
        def clean_phone(phone):
            if pd.isna(phone):
                return None

            # Extract only digits
            digits = re.sub(r'\D', '', str(phone))

            # Handle US numbers
            if len(digits) == 10:
                return f"+1-{digits[:3]}-{digits[3:6]}-{digits[6:]}"
            elif len(digits) == 11 and digits[0] == '1':
                return f"+1-{digits[1:4]}-{digits[4:7]}-{digits[7:]}"

            return phone  # Return original if can't parse

        original = self.df[column].copy()
        self.df[column] = self.df[column].apply(clean_phone)
        affected = (original != self.df[column]).sum()
        self.log_change('standardize_phone', column, affected)

        return self

    def standardize_email(self, column: str) -> 'DataCleanser':
        """Standardize email addresses."""
        original = self.df[column].copy()

        self.df[column] = (
            self.df[column]
            .str.lower()
            .str.strip()
            .str.replace(r'\s+', '', regex=True)
        )

        affected = (original != self.df[column]).sum()
        self.log_change('standardize_email', column, affected)

        return self

    def fill_missing(
        self,
        column: str,
        strategy: str = 'constant',
        value: Any = None,
        group_by: List[str] = None
    ) -> 'DataCleanser':
        """Fill missing values with various strategies."""
        missing_before = self.df[column].isna().sum()

        if strategy == 'constant':
            self.df[column] = self.df[column].fillna(value)
        elif strategy == 'mean':
            if group_by:
                self.df[column] = self.df.groupby(group_by)[column].transform(
                    lambda x: x.fillna(x.mean())
                )
            else:
                self.df[column] = self.df[column].fillna(self.df[column].mean())
        elif strategy == 'median':
            if group_by:
                self.df[column] = self.df.groupby(group_by)[column].transform(
                    lambda x: x.fillna(x.median())
                )
            else:
                self.df[column] = self.df[column].fillna(self.df[column].median())
        elif strategy == 'mode':
            mode_value = self.df[column].mode()[0] if len(self.df[column].mode()) > 0 else None
            self.df[column] = self.df[column].fillna(mode_value)
        elif strategy == 'forward_fill':
            self.df[column] = self.df[column].ffill()
        elif strategy == 'backward_fill':
            self.df[column] = self.df[column].bfill()

        missing_after = self.df[column].isna().sum()
        self.log_change('fill_missing', column, missing_before - missing_after)

        return self

    def remove_outliers(
        self,
        column: str,
        method: str = 'iqr',
        threshold: float = 1.5
    ) -> 'DataCleanser':
        """Remove or flag outliers."""
        outlier_mask = pd.Series([False] * len(self.df))

        if method == 'iqr':
            Q1 = self.df[column].quantile(0.25)
            Q3 = self.df[column].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - threshold * IQR
            upper_bound = Q3 + threshold * IQR
            outlier_mask = (self.df[column] < lower_bound) | (self.df[column] > upper_bound)

        elif method == 'zscore':
            mean = self.df[column].mean()
            std = self.df[column].std()
            zscore = np.abs((self.df[column] - mean) / std)
            outlier_mask = zscore > threshold

        # Replace outliers with NaN
        self.df.loc[outlier_mask, column] = np.nan
        self.log_change('remove_outliers', column, outlier_mask.sum())

        return self

    def validate_and_fix_dates(
        self,
        column: str,
        date_format: str = None,
        min_date: str = None,
        max_date: str = None
    ) -> 'DataCleanser':
        """Validate and fix date values."""
        original_nulls = self.df[column].isna().sum()

        # Parse dates
        self.df[column] = pd.to_datetime(
            self.df[column],
            format=date_format,
            errors='coerce'
        )

        # Apply range constraints
        if min_date:
            min_dt = pd.to_datetime(min_date)
            invalid = self.df[column] < min_dt
            self.df.loc[invalid, column] = pd.NaT

        if max_date:
            max_dt = pd.to_datetime(max_date)
            invalid = self.df[column] > max_dt
            self.df.loc[invalid, column] = pd.NaT

        new_nulls = self.df[column].isna().sum()
        self.log_change('validate_dates', column, new_nulls - original_nulls)

        return self

    def apply_mapping(
        self,
        column: str,
        mapping: Dict[str, str],
        default: str = None
    ) -> 'DataCleanser':
        """Apply value mapping for standardization."""
        original = self.df[column].copy()

        if default is not None:
            self.df[column] = self.df[column].map(mapping).fillna(default)
        else:
            self.df[column] = self.df[column].replace(mapping)

        affected = (original != self.df[column]).sum()
        self.log_change('apply_mapping', column, affected)

        return self

    def get_result(self) -> pd.DataFrame:
        """Return cleansed dataframe."""
        return self.df

    def get_changes_report(self) -> pd.DataFrame:
        """Return report of all changes made."""
        return pd.DataFrame(self.changes_log)
```

## Tools and Technologies

### Quality Platforms
| Tool | Strengths | Best For |
|------|-----------|----------|
| Great Expectations | Python-native | Data pipelines |
| dbt tests | SQL-native | Analytics |
| Monte Carlo | Observability | Monitoring |
| Soda | Declarative | Multi-platform |

### Profiling Tools
| Tool | Purpose | Use Case |
|------|---------|----------|
| pandas-profiling | EDA reports | Initial analysis |
| Deequ | Spark profiling | Big data |
| whylogs | Statistical profiles | ML monitoring |

## Metrics and Monitoring

### Quality KPIs

```sql
-- Data quality metrics tracking table
CREATE TABLE data_quality.quality_metrics (
    metric_id SERIAL PRIMARY KEY,
    dataset_name VARCHAR(100) NOT NULL,
    check_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dimension VARCHAR(50) NOT NULL,
    check_name VARCHAR(100) NOT NULL,
    total_records INTEGER NOT NULL,
    passed_records INTEGER NOT NULL,
    pass_rate DECIMAL(5, 4) NOT NULL,
    threshold DECIMAL(5, 4) NOT NULL,
    passed BOOLEAN NOT NULL
);

-- Quality score calculation
SELECT
    dataset_name,
    DATE(check_timestamp) AS check_date,
    AVG(pass_rate) AS overall_quality_score,
    AVG(CASE WHEN dimension = 'completeness' THEN pass_rate END) AS completeness_score,
    AVG(CASE WHEN dimension = 'accuracy' THEN pass_rate END) AS accuracy_score,
    AVG(CASE WHEN dimension = 'consistency' THEN pass_rate END) AS consistency_score,
    SUM(CASE WHEN NOT passed THEN 1 ELSE 0 END) AS failed_checks
FROM data_quality.quality_metrics
WHERE check_timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY dataset_name, DATE(check_timestamp)
ORDER BY check_date DESC;
```

## Common Pitfalls

### 1. Checking Too Late
**Problem**: Quality issues found after consumption
**Solution**: Validate at ingestion and transformation

### 2. No Baseline Metrics
**Problem**: Cannot detect degradation
**Solution**: Establish quality baselines

### 3. Alert Fatigue
**Problem**: Too many false positives
**Solution**: Tune thresholds and prioritize

### 4. Manual Cleansing
**Problem**: Inconsistent, error-prone fixes
**Solution**: Automate cleansing rules

### 5. Ignoring Data Lineage
**Problem**: Cannot trace quality issues to source
**Solution**: Implement data lineage tracking

## Integration Points

### Upstream Dependencies
- **Source Systems**: Raw data validation
- **ETL Pipelines**: Transformation checks
- **Data Catalog**: Quality metadata
- **Schema Registry**: Contract validation

### Downstream Consumers
- **Analytics Teams**: Quality reports
- **Data Stewards**: Issue resolution
- **Monitoring Systems**: Quality alerts
- **Governance Tools**: Compliance reporting

## Best Practices Checklist

- [ ] Quality dimensions defined (6 dimensions)
- [ ] Automated validation in pipelines
- [ ] Quality metrics dashboard
- [ ] Alerting for quality degradation
- [ ] Cleansing rules documented
- [ ] Deduplication strategy defined
- [ ] Quality SLAs established
- [ ] Root cause analysis process
- [ ] Data steward assignments
- [ ] Regular quality reviews
