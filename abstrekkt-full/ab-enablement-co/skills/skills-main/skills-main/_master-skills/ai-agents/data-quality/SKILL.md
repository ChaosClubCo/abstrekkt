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


## References
- `references/2-deduplication-algorithms.md` — 2. Deduplication Algorithms
- `references/references.md` — References
- `references/tools-and-technologies.md` — Tools and Technologies
