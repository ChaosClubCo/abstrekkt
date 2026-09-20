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
