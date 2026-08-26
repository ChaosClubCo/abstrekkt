# HTML ACCESSIBILITY UPDATES
# Copy-paste these snippets into your index.html

## 1. ADD TO <head> (after line 6)
```html
<meta name="description" content="INT Inc Smart Triage AI 2.0 - Assessment tool for evaluating AI platform readiness and client engagement opportunities">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
```

## 2. ADD AS FIRST ELEMENT IN <body>
```html
<!-- Skip Navigation for Keyboard Users -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

## 3. REPLACE EXISTING HEADER DIV
**Find:**
```html
<div class="header">
```

**Replace with:**
```html
<header class="header" role="banner">
```

**And close with:**
```html
</header>
```

## 4. UPDATE MODE TOGGLE BUTTONS
**Find:**
```html
<button class="mode-btn active" id="internalModeBtn" onclick="switchMode('internal')">
    Internal AI Maturity
</button>
<button class="mode-btn" id="clientModeBtn" onclick="switchMode('client')">
    Client Assessment & Market Opportunity
</button>
```

**Replace with:**
```html
<div role="tablist" aria-label="Assessment mode selection">
    <button class="mode-btn active" 
            id="internalModeBtn" 
            onclick="switchMode('internal')"
            role="tab"
            aria-selected="true"
            aria-controls="internal-assessment"
            aria-label="Internal AI Maturity Assessment Mode">
        Internal AI Maturity
    </button>
    <button class="mode-btn" 
            id="clientModeBtn" 
            onclick="switchMode('client')"
            role="tab"
            aria-selected="false"
            aria-controls="client-assessment"
            aria-label="Client Assessment and Market Opportunity Mode">
        Client Assessment & Market Opportunity
    </button>
</div>
```

## 5. ADD MAIN LANDMARK
**Find:**
```html
<div class="main-content">
```

**Replace with:**
```html
<main id="main-content" class="main-content" role="main">
```

**And close with:**
```html
</main>
```

## 6. UPDATE PROGRESS BAR
**Find:**
```html
<div class="progress-bar">
```

**Replace with:**
```html
<nav class="progress-bar" role="navigation" aria-label="Assessment progress">
    <h2 class="sr-only">Assessment Progress</h2>
```

## 7. UPDATE PROGRESS STEPS
**For each step, update like this:**
```html
<div class="progress-step active" role="group" aria-current="step">
    <div class="step-circle" aria-label="Step 1 of 4: Department Selection (current step)">
        1
    </div>
    <div class="step-label" aria-hidden="true">Department Selection</div>
</div>
```

## 8. UPDATE ALL NAVIGATION BUTTONS
**Next buttons:**
```html
<button class="btn btn-primary" 
        onclick="nextStep()"
        aria-label="Proceed to next step: Activity Inventory">
    Next: Activity Inventory
</button>
```

**Previous buttons:**
```html
<button class="btn btn-secondary" 
        onclick="previousStep()"
        aria-label="Return to previous step">
    Back
</button>
```

**Action buttons:**
```html
<button class="btn btn-primary" 
        onclick="generateInternalReport()"
        aria-label="Generate assessment report based on your inputs">
    Generate Assessment
</button>
```

## 9. UPDATE CHECKBOX GROUPS
**Wrap checkbox sections in fieldset:**
```html
<fieldset class="department-checkboxes">
    <legend class="sr-only">Select your organization's departments</legend>
    <div id="departmentCheckboxes">
        <!-- checkboxes here -->
    </div>
</fieldset>
```

## 10. UPDATE INDIVIDUAL CHECKBOXES
```html
<label class="checkbox-item">
    <input type="checkbox" 
           value="Information Security" 
           onchange="updateSelectedDepartments('internal')"
           aria-describedby="dept-infosec-desc">
    <span>Information Security</span>
    <span id="dept-infosec-desc" class="sr-only">
        Check if your organization has an Information Security department
    </span>
</label>
```

## 11. ADD TEXT INPUT LABELS (if any exist)
```html
<div class="form-group">
    <label for="client-company-name">Company Name <span aria-label="required">*</span></label>
    <input type="text" 
           id="client-company-name"
           name="companyName"
           aria-required="true"
           aria-invalid="false"
           aria-describedby="company-name-hint">
    <span id="company-name-hint" class="sr-only">Enter the full legal name of the company</span>
    <span id="company-name-error" role="alert" class="error-message"></span>
</div>
```

## 12. UPDATE RESULTS SECTION
**Add region landmark:**
```html
<div class="card step-content" id="internal-step-4">
    <section aria-labelledby="results-heading">
        <h2 id="results-heading">Assessment Results</h2>
        <div id="internalReport" class="report-container">
            <!-- Results content -->
        </div>
    </section>
</div>
```

## 13. ADD LOADING STATE (when generating reports)
```javascript
// In your generateInternalReport() function, add:
const reportContainer = document.getElementById('internalReport');
reportContainer.setAttribute('aria-busy', 'true');
reportContainer.setAttribute('aria-live', 'polite');

// After report generation:
reportContainer.setAttribute('aria-busy', 'false');
AccessibilityManager.announce('Assessment report generated successfully');
```

## 14. ADD STATUS MESSAGES
```html
<!-- Add near end of body -->
<div id="status-messages" role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>
```

## 15. UPDATE EXPORT BUTTONS
```html
<div class="button-group" role="group" aria-label="Export options">
    <button class="btn btn-primary" 
            onclick="exportPDF('internal')"
            aria-label="Download assessment as PDF executive summary">
        <span aria-hidden="true">📄</span> Download Executive Summary (PDF)
    </button>
    <button class="btn btn-primary" 
            onclick="exportReport('internal')"
            aria-label="Download complete assessment report">
        <span aria-hidden="true">📊</span> Download Full Report
    </button>
    <button class="btn btn-secondary" 
            onclick="exportRoadmap()"
            aria-label="Download implementation roadmap document">
        <span aria-hidden="true">🗺️</span> Download Implementation Roadmap
    </button>
    <button class="btn btn-secondary" 
            onclick="resetAssessment()"
            aria-label="Clear all data and start a new assessment">
        <span aria-hidden="true">🔄</span> Start New Assessment
    </button>
</div>
```

## INTEGRATION INSTRUCTIONS

1. **Copy accessibility-styles.css** into your <style> section
2. **Add accessibility-module.js** to the beginning of your app.js
3. **Update HTML snippets** one section at a time
4. **Test with keyboard** (Tab through everything)
5. **Test with screen reader** (NVDA on Windows, VoiceOver on Mac)

## QUICK TEST
After implementing, press F12 and run:
```javascript
console.log('A11y Check:', {
    skipLink: !!document.querySelector('.skip-link'),
    mainLandmark: !!document.querySelector('main'),
    liveRegion: !!document.getElementById('sr-live-region'),
    labeledButtons: document.querySelectorAll('button[aria-label]').length,
    headerLandmark: !!document.querySelector('header')
});
```

Expected output: All should be true/non-zero
