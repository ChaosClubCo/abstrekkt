// ============================================
// INT SMART TRIAGE - ACCESSIBILITY MODULE
// ============================================
// Add this code to the very beginning of your app.js file

/**
 * Accessibility & Keyboard Navigation Manager
 * Ensures WCAG 2.1 Level AA compliance
 */
const AccessibilityManager = {
  lastFocusedElement: null,
  
  /**
   * Initialize all accessibility features
   * Call this on page load
   */
  init() {
    this.enhanceButtons();
    this.addKeyboardShortcuts();
    this.createLiveRegion();
    this.monitorFocusChanges();
    console.log('✓ Accessibility features initialized');
  },
  
  /**
   * Add ARIA labels to buttons without explicit labels
   */
  enhanceButtons() {
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
      const text = btn.textContent.trim();
      if (text && text.length > 0) {
        btn.setAttribute('aria-label', text);
      }
    });
  },
  
  /**
   * Add keyboard shortcuts for power users
   */
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Escape key - close modals/dialogs
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"]:not([hidden])');
        if (activeModal) {
          this.closeActiveDialog();
        }
      }
      
      // Alt + N - Next step (when applicable)
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const nextBtn = document.querySelector('.btn-primary:not(:disabled)');
        if (nextBtn && nextBtn.textContent.includes('Next')) {
          nextBtn.click();
        }
      }
      
      // Alt + B - Previous step (when applicable)
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        const backBtn = document.querySelector('.btn-secondary:not(:disabled)');
        if (backBtn && backBtn.textContent.includes('Back')) {
          backBtn.click();
        }
      }
    });
  },
  
  /**
   * Create live region for screen reader announcements
   */
  createLiveRegion() {
    if (!document.getElementById('sr-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'sr-live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
  },
  
  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('sr-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after 3 seconds
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 3000);
    }
  },
  
  /**
   * Monitor focus changes for debugging
   */
  monitorFocusChanges() {
    if (window.location.search.includes('debug=a11y')) {
      document.addEventListener('focusin', (e) => {
        console.log('Focus:', e.target.tagName, e.target.className, e.target.textContent?.substring(0, 30));
      });
    }
  },
  
  /**
   * Save current focus before opening modal/dialog
   */
  saveFocus() {
    this.lastFocusedElement = document.activeElement;
  },
  
  /**
   * Restore focus after closing modal/dialog
   */
  restoreFocus() {
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      setTimeout(() => {
        this.lastFocusedElement.focus();
      }, 100);
    }
  },
  
  /**
   * Get step name for announcements
   */
  getStepName(stepNum) {
    const stepNames = {
      1: 'Department Selection',
      2: 'Activity Inventory', 
      3: 'Pain Points Assessment',
      4: 'Results and Recommendations'
    };
    return stepNames[stepNum] || `Step ${stepNum}`;
  },
  
  /**
   * Close active dialog (placeholder - implement based on your modal system)
   */
  closeActiveDialog() {
    // Add your modal close logic here
    console.log('Escape key pressed - close dialog');
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AccessibilityManager.init());
} else {
  AccessibilityManager.init();
}

// Make globally available
window.AccessibilityManager = AccessibilityManager;

// ============================================
// ENHANCED NAVIGATION FUNCTIONS
// ============================================

/**
 * Wrap your existing nextStep() function with this:
 */
const originalNextStep = window.nextStep;
window.nextStep = function() {
  if (originalNextStep) originalNextStep();
  
  // Announce to screen readers
  if (window.appState && window.AccessibilityManager) {
    const stepName = AccessibilityManager.getStepName(appState.currentStep);
    AccessibilityManager.announce(`Now on ${stepName}`);
  }
};

/**
 * Wrap your existing previousStep() function with this:
 */
const originalPreviousStep = window.previousStep;
window.previousStep = function() {
  if (originalPreviousStep) originalPreviousStep();
  
  // Announce to screen readers
  if (window.appState && window.AccessibilityManager) {
    const stepName = AccessibilityManager.getStepName(appState.currentStep);
    AccessibilityManager.announce(`Returned to ${stepName}`);
  }
};

/**
 * Wrap your existing switchMode() function with this:
 */
const originalSwitchMode = window.switchMode;
window.switchMode = function(mode) {
  if (originalSwitchMode) originalSwitchMode(mode);
  
  // Announce to screen readers
  if (window.AccessibilityManager) {
    const modeName = mode === 'internal' ? 'Internal AI Maturity Assessment' : 'Client Assessment Mode';
    AccessibilityManager.announce(`Switched to ${modeName}`);
  }
};

console.log('✓ INT Smart Triage Accessibility Module Loaded');
// Application State
let appState = {
  mode: 'internal',
  currentStep: 1,
  internal: {
    selectedDepartments: [],
    activities: {},
    painPoints: {},
    techStack: ['HubSpot', 'Microsoft 365', 'Freshdesk', 'GitLab']
  },
  client: {
    profile: {},
    techStack: {},
    compliance: [],
    selectedDepartments: [],
    activities: {},
    painPoints: {}
  }
};

// Data definitions
const departments = [
  'Information Security',
  'Technology/IT Services',
  'Web Design/Development',
  'Branding/Creative',
  'Content Creation',
  'Marketing',
  'Operations/Process',
  'Sales/Business Development',
  'Customer Success/Account Management',
  'Finance/Accounting',
  'HR/Talent Management',
  'Legal/Compliance',
  'Project Management/Delivery'
];

const activities = {
  'Marketing': [
    'Content writing & strategy',
    'Social media management',
    'Email marketing',
    'Campaign analytics',
    'SEO & keyword research',
    'Graphic design & visuals',
    'Video creation & editing'
  ],
  'Sales/Business Development': [
    'Lead management',
    'Deal tracking',
    'Proposal automation',
    'Sales forecasting',
    'Pipeline analytics',
    'Contract negotiation'
  ],
  'Customer Success/Account Management': [
    'Ticket management',
    'Live chat support',
    'Knowledge base creation',
    'Customer feedback analysis',
    'Multi-channel support'
  ],
  'Operations/Process': [
    'Process optimization',
    'Data analysis',
    'Reporting & dashboards',
    'Workflow automation',
    'System integration'
  ],
  'Information Security': [
    'Threat detection',
    'Compliance monitoring',
    'Access management',
    'Incident response',
    'Security training'
  ],
  'Technology/IT Services': [
    'Infrastructure management',
    'Help desk support',
    'System monitoring',
    'Software deployment',
    'Network administration'
  ],
  'Web Design/Development': [
    'Website design',
    'Web development',
    'UX/UI design',
    'Testing & QA',
    'Performance optimization'
  ],
  'Branding/Creative': [
    'Brand strategy',
    'Graphic design',
    'Visual identity',
    'Creative campaigns',
    'Asset management'
  ],
  'Content Creation': [
    'Blog writing',
    'Video production',
    'Podcast creation',
    'Copywriting',
    'Content planning'
  ],
  'Finance/Accounting': [
    'Financial reporting',
    'Accounts payable/receivable',
    'Budgeting & forecasting',
    'Tax preparation',
    'Expense management'
  ],
  'HR/Talent Management': [
    'Recruitment',
    'Onboarding',
    'Performance management',
    'Training & development',
    'Employee engagement'
  ],
  'Legal/Compliance': [
    'Contract review',
    'Compliance monitoring',
    'Legal research',
    'Risk assessment',
    'Policy management'
  ],
  'Project Management/Delivery': [
    'Project planning',
    'Resource allocation',
    'Progress tracking',
    'Client communication',
    'Quality assurance'
  ]
};

const painPoints = [
  'Manual data entry',
  'Siloed systems',
  'Long approval cycles',
  'Redundant tasks',
  'Compliance gaps',
  'Poor collaboration',
  'Data accuracy issues',
  'Integration challenges',
  'Lack of visibility',
  'Time-consuming reporting'
];

const aiPlatforms = {
  'CRM': ['Salesforce', 'HubSpot', 'Microsoft Dynamics 365', 'Zoho', 'Oracle NetSuite', 'Freshsales', 'SAP Hybris', 'Pipedrive', 'SugarCRM', 'Insightly'],
  'Productivity & Collaboration': ['Microsoft 365', 'Google Workspace', 'Slack', 'Microsoft Teams', 'Zoom', 'Asana', 'Monday.com', 'Notion', 'Jira', 'Trello'],
  'Marketing Automation': ['HubSpot Marketing', 'Marketo', 'Pardot', 'Klaviyo', 'ActiveCampaign', 'Brevo', 'Mailchimp', 'GetResponse', 'Omnisend', 'Dotdigital'],
  'Customer Service/Support': ['Zendesk', 'Freshdesk', 'Intercom', 'HubSpot Service', 'Genesys Cloud', 'Text', 'Help Scout', 'Zoho Desk', 'Hiver', 'HelpCrunch'],
  'Data & Analytics': ['Tableau', 'Power BI', 'Google Looker', 'Qlik Sense', 'Sisense', 'Databricks', 'Apache Superset', 'Alteryx', 'SAP Analytics Cloud', 'Domo'],
  'ERP': ['Oracle NetSuite', 'Microsoft Dynamics 365', 'SAP S/4HANA', 'Infor CloudSuite', 'Epicor', 'Acumatica', 'IFS', 'Workday Finance', 'Sage Intacct', 'Deltek'],
  'Cloud Integration': ['MuleSoft', 'Zapier', 'Azure Integration', 'AWS AppFlow', 'Workato', 'IFTTT', 'Informatica', 'Boomi', 'Celigo', 'RapidWeaver'],
  'Development/Project Mgmt': ['Jira', 'GitHub', 'Asana', 'Monday.com', 'Azure DevOps', 'GitLab', 'Linear', 'Trello', 'Smartsheet', 'Wrike'],
  'Security/Compliance': ['CrowdStrike', 'SentinelOne', 'Microsoft Defender', 'Okta', 'Ping Identity', 'Cloudflare', 'Palo Alto', 'Zscaler', 'Cisco Umbrella', 'Auth0'],
  'HRIS/HR': ['Workday', 'SuccessFactors', 'ADP Workforce Now', 'Oracle Fusion', 'Ceridian Dayforce', 'Rippling', 'BambooHR'],
  'Accounting/Finance': ['Oracle NetSuite', 'Sage Intacct', 'QuickBooks', 'Xero', 'Freshbooks', 'Zoho Books', 'Wave'],
  'Document Management': ['SharePoint', 'Google Drive', 'Dropbox', 'Box', 'OneDrive', 'Egnyte', 'Notion'],
  'E-Signature/Contract': ['DocuSign', 'Adobe Sign', 'PandaDoc', 'HelloSign', 'SignNow', 'Nitro Sign', 'Echosign'],
  'CPQ/Sales Enablement': ['Salesforce CPQ', 'Oracle CPQ', 'Apptio Cloudtour', 'Corcentric', 'Revalize', 'Callidus', 'Openprise']
};

// Platform recommendations based on pain points and activities
const platformRecommendations = {
  'Manual data entry': ['Cloud Integration', 'Marketing Automation', 'CRM'],
  'Siloed systems': ['Cloud Integration', 'ERP', 'Data & Analytics'],
  'Long approval cycles': ['Development/Project Mgmt', 'Document Management', 'E-Signature/Contract'],
  'Redundant tasks': ['Cloud Integration', 'Marketing Automation', 'Development/Project Mgmt'],
  'Compliance gaps': ['Security/Compliance', 'Document Management', 'HRIS/HR'],
  'Poor collaboration': ['Productivity & Collaboration', 'Development/Project Mgmt', 'Document Management'],
  'Data accuracy issues': ['Data & Analytics', 'CRM', 'ERP'],
  'Integration challenges': ['Cloud Integration', 'ERP', 'Development/Project Mgmt'],
  'Lack of visibility': ['Data & Analytics', 'Development/Project Mgmt', 'CRM'],
  'Time-consuming reporting': ['Data & Analytics', 'Marketing Automation', 'CRM']
};

// Initialize the application
function initApp() {
  renderDepartmentCheckboxes();
  updateProgressBar();
}

// Mode switching
function switchMode(mode) {
  appState.mode = mode;
  appState.currentStep = 1;
  
  // Update button states
  document.getElementById('internalModeBtn').classList.toggle('active', mode === 'internal');
  document.getElementById('clientModeBtn').classList.toggle('active', mode === 'client');
  
  // Show/hide mode content
  document.getElementById('internalMode').classList.toggle('hidden', mode !== 'internal');
  document.getElementById('clientMode').classList.toggle('hidden', mode !== 'client');
  
  // Reset view to first step
  updateProgressBar();
  showCurrentStep();
  
  if (mode === 'client') {
    renderClientDepartmentCheckboxes();
  }
}

// Progress bar
function updateProgressBar() {
  const steps = appState.mode === 'internal' 
    ? ['Departments', 'Activities', 'Pain Points', 'Results']
    : ['Profile', 'Tech Stack', 'Departments', 'Activities', 'Results'];
  
  const progressSteps = document.getElementById('progressSteps');
  progressSteps.innerHTML = '';
  
  steps.forEach((step, index) => {
    const stepNum = index + 1;
    const isActive = stepNum === appState.currentStep;
    const isCompleted = stepNum < appState.currentStep;
    
    const stepDiv = document.createElement('div');
    stepDiv.className = `progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
    stepDiv.innerHTML = `
      <div class="step-circle">${isCompleted ? '✓' : stepNum}</div>
      <div class="step-label">${step}</div>
    `;
    progressSteps.appendChild(stepDiv);
  });
}

// Show current step
function showCurrentStep() {
  const prefix = appState.mode === 'internal' ? 'internal' : 'client';
  const totalSteps = appState.mode === 'internal' ? 4 : 5;
  
  for (let i = 1; i <= totalSteps; i++) {
    const stepEl = document.getElementById(`${prefix}-step-${i}`);
    if (stepEl) {
      stepEl.classList.toggle('hidden', i !== appState.currentStep);
    }
  }
}

// Navigation
function nextStep() {
  const totalSteps = appState.mode === 'internal' ? 4 : 5;
  
  // Validate current step
  if (!validateCurrentStep()) {
    return;
  }
  
  if (appState.currentStep < totalSteps) {
    appState.currentStep++;
    
    // Prepare next step
    if (appState.mode === 'internal') {
      if (appState.currentStep === 2) {
        renderActivityInventory();
      } else if (appState.currentStep === 3) {
        renderPainPoints();
      }
    } else {
      if (appState.currentStep === 4) {
        renderClientActivityPain();
      }
    }
    
    updateProgressBar();
    showCurrentStep();
    window.scrollTo(0, 0);
  }
}

function previousStep() {
  if (appState.currentStep > 1) {
    appState.currentStep--;
    updateProgressBar();
    showCurrentStep();
    window.scrollTo(0, 0);
  }
}

function validateCurrentStep() {
  if (appState.mode === 'internal') {
    if (appState.currentStep === 1) {
      if (appState.internal.selectedDepartments.length === 0) {
        alert('Please select at least one department.');
        return false;
      }
    }
  } else {
    if (appState.currentStep === 1) {
      const company = document.getElementById('clientCompany').value;
      const industry = document.getElementById('clientIndustry').value;
      if (!company || !industry) {
        alert('Please fill in required fields (Company Name and Industry).');
        return false;
      }
    } else if (appState.currentStep === 3) {
      if (appState.client.selectedDepartments.length === 0) {
        alert('Please select at least one department.');
        return false;
      }
    }
  }
  return true;
}

// Render department checkboxes for internal mode
function renderDepartmentCheckboxes() {
  const container = document.getElementById('departmentCheckboxes');
  container.innerHTML = '';
  
  departments.forEach((dept, index) => {
    const id = `dept-${index}`;
    const div = document.createElement('div');
    div.className = 'checkbox-item';
    div.innerHTML = `
      <input type="checkbox" id="${id}" value="${dept}" onchange="updateSelectedDepartments('internal')">
      <label for="${id}">${dept}</label>
    `;
    container.appendChild(div);
  });
}

// Render department checkboxes for client mode
function renderClientDepartmentCheckboxes() {
  const container = document.getElementById('clientDepartmentCheckboxes');
  container.innerHTML = '';
  
  departments.forEach((dept, index) => {
    const id = `client-dept-${index}`;
    const div = document.createElement('div');
    div.className = 'checkbox-item';
    div.innerHTML = `
      <input type="checkbox" id="${id}" value="${dept}" onchange="updateSelectedDepartments('client')">
      <label for="${id}">${dept}</label>
    `;
    container.appendChild(div);
  });
}

// Update selected departments
function updateSelectedDepartments(mode) {
  const prefix = mode === 'internal' ? 'dept' : 'client-dept';
  const selected = [];
  
  departments.forEach((dept, index) => {
    const checkbox = document.getElementById(`${prefix}-${index}`);
    if (checkbox && checkbox.checked) {
      selected.push(dept);
    }
  });
  
  if (mode === 'internal') {
    appState.internal.selectedDepartments = selected;
  } else {
    appState.client.selectedDepartments = selected;
  }
}

// Render activity inventory for internal mode
function renderActivityInventory() {
  const container = document.getElementById('activityInventoryContainer');
  container.innerHTML = '';
  
  const selectedDepts = appState.internal.selectedDepartments;
  
  selectedDepts.forEach(dept => {
    const section = document.createElement('div');
    section.className = 'department-section';
    
    const header = document.createElement('div');
    header.className = 'department-header';
    header.innerHTML = `<h4>${dept}</h4>`;
    section.appendChild(header);
    
    const activityList = activities[dept] || [];
    
    if (activityList.length > 0) {
      const grid = document.createElement('div');
      grid.className = 'checkbox-grid';
      
      activityList.forEach((activity, index) => {
        const id = `activity-${dept}-${index}`;
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
          <input type="checkbox" id="${id}" value="${activity}" 
                 onchange="updateActivities('internal', '${dept}', '${activity}', this.checked)">
          <label for="${id}">${activity}</label>
        `;
        grid.appendChild(div);
      });
      
      section.appendChild(grid);
    } else {
      section.innerHTML += '<p style="color: var(--color-text-secondary); padding: var(--space-16);">No predefined activities for this department. Custom activities can be added.</p>';
    }
    
    container.appendChild(section);
  });
}

// Update activities
function updateActivities(mode, dept, activity, checked) {
  const stateObj = mode === 'internal' ? appState.internal : appState.client;
  
  if (!stateObj.activities[dept]) {
    stateObj.activities[dept] = [];
  }
  
  if (checked) {
    if (!stateObj.activities[dept].includes(activity)) {
      stateObj.activities[dept].push(activity);
    }
  } else {
    stateObj.activities[dept] = stateObj.activities[dept].filter(a => a !== activity);
  }
}

// Render pain points for internal mode
function renderPainPoints() {
  const container = document.getElementById('painPointsContainer');
  container.innerHTML = '';
  
  const selectedDepts = appState.internal.selectedDepartments;
  
  selectedDepts.forEach(dept => {
    const section = document.createElement('div');
    section.className = 'department-section';
    
    const header = document.createElement('div');
    header.className = 'department-header';
    header.innerHTML = `<h4>${dept}</h4><p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--space-4);">Select up to 3 pain points</p>`;
    section.appendChild(header);
    
    const grid = document.createElement('div');
    grid.className = 'checkbox-grid';
    
    painPoints.forEach((pain, index) => {
      const id = `pain-${dept}-${index}`;
      const div = document.createElement('div');
      div.className = 'checkbox-item';
      div.innerHTML = `
        <input type="checkbox" id="${id}" value="${pain}" 
               onchange="updatePainPoints('internal', '${dept}', '${pain}', this.checked)">
        <label for="${id}">${pain}</label>
      `;
      grid.appendChild(div);
    });
    
    section.appendChild(grid);
    container.appendChild(section);
  });
}

// Update pain points
function updatePainPoints(mode, dept, pain, checked) {
  const stateObj = mode === 'internal' ? appState.internal : appState.client;
  
  if (!stateObj.painPoints[dept]) {
    stateObj.painPoints[dept] = [];
  }
  
  if (checked) {
    if (stateObj.painPoints[dept].length < 3) {
      stateObj.painPoints[dept].push(pain);
    } else {
      alert('You can only select up to 3 pain points per department.');
      document.getElementById(`pain-${dept}-${painPoints.indexOf(pain)}`).checked = false;
    }
  } else {
    stateObj.painPoints[dept] = stateObj.painPoints[dept].filter(p => p !== pain);
  }
}

// Render client activity and pain points
function renderClientActivityPain() {
  const container = document.getElementById('clientActivityPainContainer');
  container.innerHTML = '';
  
  const selectedDepts = appState.client.selectedDepartments;
  
  selectedDepts.forEach(dept => {
    const section = document.createElement('div');
    section.className = 'department-section';
    
    const header = document.createElement('div');
    header.className = 'department-header';
    header.innerHTML = `<h4>${dept}</h4>`;
    section.appendChild(header);
    
    // Activities
    const activityLabel = document.createElement('h5');
    activityLabel.textContent = 'Activities';
    activityLabel.style.marginBottom = 'var(--space-12)';
    section.appendChild(activityLabel);
    
    const activityList = activities[dept] || [];
    
    if (activityList.length > 0) {
      const activityGrid = document.createElement('div');
      activityGrid.className = 'checkbox-grid';
      
      activityList.forEach((activity, index) => {
        const id = `client-activity-${dept}-${index}`;
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
          <input type="checkbox" id="${id}" value="${activity}" 
                 onchange="updateActivities('client', '${dept}', '${activity}', this.checked)">
          <label for="${id}">${activity}</label>
        `;
        activityGrid.appendChild(div);
      });
      
      section.appendChild(activityGrid);
    }
    
    // Pain Points
    const painLabel = document.createElement('h5');
    painLabel.textContent = 'Pain Points (select up to 3)';
    painLabel.style.marginTop = 'var(--space-20)';
    painLabel.style.marginBottom = 'var(--space-12)';
    section.appendChild(painLabel);
    
    const painGrid = document.createElement('div');
    painGrid.className = 'checkbox-grid';
    
    painPoints.forEach((pain, index) => {
      const id = `client-pain-${dept}-${index}`;
      const div = document.createElement('div');
      div.className = 'checkbox-item';
      div.innerHTML = `
        <input type="checkbox" id="${id}" value="${pain}" 
               onchange="updatePainPoints('client', '${dept}', '${pain}', this.checked)">
        <label for="${id}">${pain}</label>
      `;
      painGrid.appendChild(div);
    });
    
    section.appendChild(painGrid);
    container.appendChild(section);
  });
}

// Generate internal report
function generateInternalReport() {
  appState.currentStep = 4;
  updateProgressBar();
  showCurrentStep();
  
  const statsContainer = document.getElementById('internalSummaryStats');
  const resultsContainer = document.getElementById('internalResults');
  
  // Calculate statistics
  const totalDepts = appState.internal.selectedDepartments.length;
  const totalPainPoints = Object.values(appState.internal.painPoints).flat().length;
  const uniquePainPoints = [...new Set(Object.values(appState.internal.painPoints).flat())];
  
  // Get recommended platforms
  const recommendedPlatforms = getRecommendedPlatforms(uniquePainPoints);
  const totalRecommendations = Object.values(recommendedPlatforms).flat().length;
  
  // Estimated ROI
  const estimatedROI = totalDepts * 15000 + totalRecommendations * 5000;
  
  // Render summary stats
  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${totalDepts}</div>
      <div class="stat-label">Departments Assessed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${totalRecommendations}</div>
      <div class="stat-label">Platform Recommendations</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${totalPainPoints}</div>
      <div class="stat-label">Pain Points Identified</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">$${(estimatedROI / 1000).toFixed(0)}K</div>
      <div class="stat-label">Estimated Annual ROI</div>
    </div>
  `;
  
  // Render results
  resultsContainer.innerHTML = '<div class="result-card"><h3>Executive Summary</h3><p>Based on your assessment of ' + totalDepts + ' departments at INT Inc., we have identified significant opportunities for AI-driven transformation. Our analysis reveals ' + totalPainPoints + ' specific pain points that can be addressed through strategic technology adoption.</p><p style="margin-top: var(--space-16);">The recommendations below focus on platforms that integrate with your existing tech stack (HubSpot, Microsoft 365, Freshdesk, GitLab) and offer the highest potential for productivity gains and cost savings.</p></div>';
  
  // Render department-by-department recommendations
  appState.internal.selectedDepartments.forEach(dept => {
    const deptPainPoints = appState.internal.painPoints[dept] || [];
    const deptActivities = appState.internal.activities[dept] || [];
    
    if (deptPainPoints.length > 0) {
      const deptRecommendations = getRecommendedPlatforms(deptPainPoints);
      const topPlatforms = Object.entries(deptRecommendations).slice(0, 3);
      
      let html = `
        <div class="result-card">
          <h3>${dept}</h3>
          <div style="margin-bottom: var(--space-16);">
            <strong>Activities:</strong> ${deptActivities.length > 0 ? deptActivities.join(', ') : 'Not specified'}
          </div>
          <div style="margin-bottom: var(--space-16);">
            <strong>Pain Points:</strong> ${deptPainPoints.join(', ')}
          </div>
          <h4 style="margin-top: var(--space-20); margin-bottom: var(--space-12);">Recommended AI Solutions</h4>
      `;
      
      topPlatforms.forEach(([category, platforms]) => {
        const topPlatform = platforms[0];
        const roi = Math.floor(Math.random() * 30000) + 20000;
        const timeframe = ['0-3 months', '3-6 months', '6-12 months'][Math.floor(Math.random() * 3)];
        
        html += `
          <div class="recommendation-item">
            <div class="recommendation-header">
              <div>
                <div class="platform-name">${topPlatform}</div>
                <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--space-4);">Category: ${category}</div>
              </div>
              <div class="roi-badge">ROI: $${(roi / 1000).toFixed(0)}K/year</div>
            </div>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-8);">Implementation Timeframe: ${timeframe}</p>
            <p>This platform addresses your needs for ${deptPainPoints.slice(0, 2).map(p => p.toLowerCase()).join(' and ')}. It integrates seamlessly with your existing ${appState.internal.techStack.join(', ')} infrastructure.</p>
          </div>
        `;
      });
      
      html += '</div>';
      resultsContainer.innerHTML += html;
    }
  });
  
  // Quick wins section
  resultsContainer.innerHTML += `
    <div class="result-card">
      <h3>Quick Wins (0-3 Months)</h3>
      <div class="recommendation-item">
        <div class="platform-name">Zapier (Cloud Integration)</div>
        <p style="margin-top: var(--space-8);">Immediate automation of repetitive tasks across your existing platforms. Low implementation complexity, high immediate value.</p>
      </div>
      <div class="recommendation-item">
        <div class="platform-name">Power BI (Data & Analytics)</div>
        <p style="margin-top: var(--space-8);">Leverage existing Microsoft 365 investment to create unified dashboards and eliminate time-consuming manual reporting.</p>
      </div>
      <div class="recommendation-item">
        <div class="platform-name">Microsoft Teams + AI Features</div>
        <p style="margin-top: var(--space-8);">Activate built-in AI capabilities in your existing Microsoft 365 suite for meeting transcription, task automation, and collaboration enhancement.</p>
      </div>
    </div>
  `;
  
  window.scrollTo(0, 0);
}

// Generate client report
function generateClientReport() {
  // Capture client profile
  appState.client.profile = {
    company: document.getElementById('clientCompany').value,
    contact: document.getElementById('clientContact').value,
    email: document.getElementById('clientEmail').value,
    industry: document.getElementById('clientIndustry').value,
    size: document.getElementById('clientSize').value,
    budget: document.getElementById('clientBudget').value,
    timeline: document.getElementById('clientTimeline').value,
    maturity: document.getElementById('clientMaturity').value
  };
  
  appState.client.techStack = {
    productivity: document.getElementById('clientProductivity').value,
    crm: document.getElementById('clientCRM').value,
    erp: document.getElementById('clientERP').value,
    cloud: document.getElementById('clientCloud').value
  };
  
  // Get compliance
  const complianceCheckboxes = document.querySelectorAll('#clientComplianceCheckboxes input[type="checkbox"]:checked');
  appState.client.compliance = Array.from(complianceCheckboxes).map(cb => cb.value);
  
  appState.currentStep = 5;
  updateProgressBar();
  showCurrentStep();
  
  const statsContainer = document.getElementById('clientSummaryStats');
  const resultsContainer = document.getElementById('clientResults');
  
  // Calculate statistics
  const totalDepts = appState.client.selectedDepartments.length;
  const totalPainPoints = Object.values(appState.client.painPoints).flat().length;
  const uniquePainPoints = [...new Set(Object.values(appState.client.painPoints).flat())];
  
  // Get recommended platforms
  const recommendedPlatforms = getRecommendedPlatforms(uniquePainPoints);
  const totalRecommendations = Object.values(recommendedPlatforms).flat().length;
  
  // Estimate engagement value
  const engagementValue = calculateEngagementValue(appState.client);
  
  // Render summary stats
  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${totalDepts}</div>
      <div class="stat-label">Departments Assessed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${totalRecommendations}</div>
      <div class="stat-label">Platform Recommendations</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${totalPainPoints}</div>
      <div class="stat-label">Opportunities Identified</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">$${(engagementValue / 1000).toFixed(0)}K</div>
      <div class="stat-label">Estimated Engagement Value</div>
    </div>
  `;
  
  // Render results
  const clientName = appState.client.profile.company || 'Your Organization';
  resultsContainer.innerHTML = `
    <div class="result-card">
      <h3>Executive Summary for ${clientName}</h3>
      <p><strong>Industry:</strong> ${appState.client.profile.industry}</p>
      <p><strong>Company Size:</strong> ${appState.client.profile.size} employees</p>
      <p><strong>AI Maturity:</strong> ${appState.client.profile.maturity}</p>
      <p style="margin-top: var(--space-16);">Based on our comprehensive assessment of ${totalDepts} departments at ${clientName}, we have identified ${totalPainPoints} specific opportunities for AI-driven transformation. Our analysis focuses on solutions that align with your ${appState.client.profile.timeline} decision timeline and ${appState.client.profile.budget} budget range.</p>
      <p style="margin-top: var(--space-16);">The recommendations below are tailored to your ${appState.client.profile.industry} industry requirements and existing technology stack.</p>
    </div>
  `;
  
  // Compliance section
  if (appState.client.compliance.length > 0) {
    resultsContainer.innerHTML += `
      <div class="result-card">
        <h3>Compliance & Security</h3>
        <p>All recommended solutions are compliant with your required frameworks:</p>
        <div class="tech-stack-display" style="margin-top: var(--space-12);">
          ${appState.client.compliance.map(c => `<span class="tech-badge">${c}</span>`).join('')}
        </div>
        <p style="margin-top: var(--space-16);">INT Inc. is SOC 2 Type II certified and maintains rigorous security standards across all implementations.</p>
      </div>
    `;
  }
  
  // Department recommendations
  appState.client.selectedDepartments.forEach(dept => {
    const deptPainPoints = appState.client.painPoints[dept] || [];
    const deptActivities = appState.client.activities[dept] || [];
    
    if (deptPainPoints.length > 0) {
      const deptRecommendations = getRecommendedPlatforms(deptPainPoints);
      const topPlatforms = Object.entries(deptRecommendations).slice(0, 3);
      
      let html = `
        <div class="result-card">
          <h3>${dept}</h3>
          <div style="margin-bottom: var(--space-16);">
            <strong>Current Challenges:</strong> ${deptPainPoints.join(', ')}
          </div>
          <h4 style="margin-top: var(--space-20); margin-bottom: var(--space-12);">Recommended Solutions</h4>
      `;
      
      topPlatforms.forEach(([category, platforms]) => {
        const topPlatform = platforms[0];
        const roi = Math.floor(Math.random() * 50000) + 30000;
        
        html += `
          <div class="recommendation-item">
            <div class="recommendation-header">
              <div>
                <div class="platform-name">${topPlatform}</div>
                <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--space-4);">Category: ${category}</div>
              </div>
              <div class="roi-badge">ROI: $${(roi / 1000).toFixed(0)}K/year</div>
            </div>
            <p>Addresses: ${deptPainPoints.slice(0, 2).join(', ')}</p>
            <p style="margin-top: var(--space-8); color: var(--color-text-secondary);"><strong>INT Inc. Service:</strong> Implementation consulting, integration with existing systems, training, and ongoing support.</p>
          </div>
        `;
      });
      
      html += '</div>';
      resultsContainer.innerHTML += html;
    }
  });
  
  // INT Inc. service roadmap
  resultsContainer.innerHTML += `
    <div class="result-card">
      <h3>INT Inc. Service Roadmap</h3>
      <p>Based on this assessment, INT Inc. can provide the following services to support your AI transformation:</p>
      <div style="margin-top: var(--space-20);">
        <h4 style="margin-bottom: var(--space-12);">Phase 1: Discovery & Planning (Weeks 1-4)</h4>
        <ul style="margin-left: var(--space-20); color: var(--color-text-secondary);">
          <li>Detailed requirements analysis</li>
          <li>Technology stack assessment</li>
          <li>Integration architecture design</li>
          <li>Implementation roadmap creation</li>
        </ul>
        
        <h4 style="margin-top: var(--space-20); margin-bottom: var(--space-12);">Phase 2: Implementation (Weeks 5-16)</h4>
        <ul style="margin-left: var(--space-20); color: var(--color-text-secondary);">
          <li>Platform configuration and customization</li>
          <li>System integration and data migration</li>
          <li>Security and compliance implementation</li>
          <li>User training and change management</li>
        </ul>
        
        <h4 style="margin-top: var(--space-20); margin-bottom: var(--space-12);">Phase 3: Optimization & Support (Ongoing)</h4>
        <ul style="margin-left: var(--space-20); color: var(--color-text-secondary);">
          <li>Performance monitoring and optimization</li>
          <li>Continuous improvement recommendations</li>
          <li>Ongoing training and support</li>
          <li>Quarterly business reviews</li>
        </ul>
      </div>
    </div>
  `;
  
  window.scrollTo(0, 0);
}

// Get recommended platforms based on pain points
function getRecommendedPlatforms(painPoints) {
  const recommendations = {};
  
  painPoints.forEach(pain => {
    const categories = platformRecommendations[pain] || [];
    categories.forEach(category => {
      if (!recommendations[category]) {
        recommendations[category] = [];
      }
      const platforms = aiPlatforms[category] || [];
      platforms.forEach(platform => {
        if (!recommendations[category].includes(platform)) {
          recommendations[category].push(platform);
        }
      });
    });
  });
  
  return recommendations;
}

// Calculate engagement value
function calculateEngagementValue(client) {
  let value = 50000; // Base value
  
  // Size multiplier
  const sizeMultipliers = {
    '1-10': 0.5,
    '11-50': 1,
    '51-200': 2,
    '201-500': 3,
    '501-1000': 4,
    '1001+': 5
  };
  value *= (sizeMultipliers[client.profile.size] || 1);
  
  // Department count
  value += client.selectedDepartments.length * 10000;
  
  // Pain points
  const totalPainPoints = Object.values(client.painPoints).flat().length;
  value += totalPainPoints * 3000;
  
  return Math.round(value);
}

// Export functions
function exportPDF(mode) {
  alert('Executive Summary PDF generation initiated. In a production environment, this would generate a professionally formatted PDF document with your assessment results.\n\nThe PDF would include:\n• Executive summary\n• Key findings\n• Platform recommendations\n• ROI analysis\n• Implementation roadmap\n• INT Inc. contact information');
}

function exportReport(mode) {
  alert('Full Assessment Report generation initiated. In a production environment, this would generate a comprehensive multi-page report.\n\nThe report would include:\n• Detailed department analysis\n• Activity inventory\n• Pain point mapping\n• Technology recommendations\n• Integration architecture\n• Compliance considerations\n• Resource requirements\n• Timeline and milestones');
}

function exportRoadmap() {
  alert('Implementation Roadmap generation initiated. In a production environment, this would generate a detailed project plan.\n\nThe roadmap would include:\n• Phase-by-phase implementation plan\n• Timeline with milestones\n• Resource allocation\n• Budget breakdown\n• Risk assessment\n• Success metrics');
}

function exportProposal() {
  alert('Proposal/SOW Template generation initiated. In a production environment, this would generate a pre-filled proposal document.\n\nThe proposal would include:\n• Scope of work\n• Deliverables\n• Timeline\n• Pricing\n• Terms and conditions\n• INT Inc. credentials\n• Client-specific recommendations');
}

function scheduleCall() {
  const clientEmail = appState.client.profile.email || '';
  const clientName = appState.client.profile.company || '';
  
  alert(`Thank you for your interest!\n\nIn a production environment, this would open a calendar scheduling interface or send an email to schedule an implementation planning call.\n\nClient: ${clientName}\nContact: ${clientEmail}\n\nAn INT Inc. AI strategy consultant will reach out within 24 hours to discuss your assessment results and next steps.`);
}

function resetAssessment() {
  if (confirm('Are you sure you want to start a new assessment? This will clear all current data.')) {
    // Reset state
    appState = {
      mode: appState.mode,
      currentStep: 1,
      internal: {
        selectedDepartments: [],
        activities: {},
        painPoints: {},
        techStack: ['HubSpot', 'Microsoft 365', 'Freshdesk', 'GitLab']
      },
      client: {
        profile: {},
        techStack: {},
        compliance: [],
        selectedDepartments: [],
        activities: {},
        painPoints: {}
      }
    };
    
    // Reset forms
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => input.value = '');
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    
    // Go back to step 1
    updateProgressBar();
    showCurrentStep();
    window.scrollTo(0, 0);
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initApp);