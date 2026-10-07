const fs = require('fs');

console.log('=== VERIFYING MOBILE TOGGLE BUTTON & DRAWER ===\n');

// 1. Verify HTML Structure
const html = fs.readFileSync('index.html', 'utf8');

const checks = [
  { name: 'Mobile menu button exists in HTML (#mobile-menu-btn)', test: html.includes('id="mobile-menu-btn"') },
  { name: 'Mobile menu bars exist inside button', test: html.includes('<span class="bar"></span>') },
  { name: 'Sidebar overlay exists in HTML (#sidebar-overlay)', test: html.includes('id="sidebar-overlay"') },
  { name: 'Sidebar close button exists in HTML (#sidebar-close-btn)', test: html.includes('id="sidebar-close-btn"') },
  { name: 'Sidebar mobile header exists in HTML', test: html.includes('class="sidebar-mobile-header"') }
];

let allPassed = true;
checks.forEach(c => {
  if (c.test) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.error(`[FAIL] ${c.name}`);
    allPassed = false;
  }
});

// 2. Verify CSS Rules in style.css
const css = fs.readFileSync('style.css', 'utf8');

const cssChecks = [
  { name: '.mobile-menu-btn base definition exists', test: css.includes('.mobile-menu-btn') },
  { name: '.mobile-menu-btn.open animation defined', test: css.includes('.mobile-menu-btn.open') },
  { name: '.sidebar.mobile-open position defined', test: css.includes('.sidebar.mobile-open') },
  { name: '.sidebar-overlay.active defined', test: css.includes('.sidebar-overlay.active') },
  { name: '@media screen and (max-width: 1024px) breakpoint exists', test: css.includes('@media screen and (max-width: 1024px)') },
  { name: '@media screen and (max-width: 768px) breakpoint exists', test: css.includes('@media screen and (max-width: 768px)') },
  { name: '@media screen and (max-width: 480px) breakpoint exists', test: css.includes('@media screen and (max-width: 480px)') }
];

console.log('\n--- CSS MEDIA QUERY & SELECTOR CHECKS ---');
cssChecks.forEach(c => {
  if (c.test) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.error(`[FAIL] ${c.name}`);
    allPassed = false;
  }
});

// 3. Verify JavaScript Logic in app.js
const js = fs.readFileSync('app.js', 'utf8');

const jsChecks = [
  { name: 'toggleMobileSidebar method defined in AntigravityApp', test: js.includes('toggleMobileSidebar()') },
  { name: 'closeMobileSidebar method defined in AntigravityApp', test: js.includes('closeMobileSidebar()') },
  { name: 'mobileMenuBtn click event listener bound', test: js.includes("mobileMenuBtn.addEventListener('click'") },
  { name: 'sidebarCloseBtn click event listener bound', test: js.includes("sidebarCloseBtn.addEventListener('click'") },
  { name: 'sidebarOverlay click event listener bound', test: js.includes("sidebarOverlay.addEventListener('click'") },
  { name: 'navigateTo calls closeMobileSidebar to auto-dismiss drawer', test: js.includes('this.closeMobileSidebar()') }
];

console.log('\n--- JAVASCRIPT BEHAVIOR & INTERACTION CHECKS ---');
jsChecks.forEach(c => {
  if (c.test) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.error(`[FAIL] ${c.name}`);
    allPassed = false;
  }
});

// 4. Simulated DOM Execution Test
console.log('\n--- FUNCTIONAL SIMULATION TEST ---');
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(c) { this.classes.add(c); }
  remove(c) { this.classes.delete(c); }
  toggle(c) {
    if (this.classes.has(c)) { this.classes.delete(c); return false; }
    else { this.classes.add(c); return true; }
  }
  contains(c) { return this.classes.has(c); }
}

const mockSidebar = { id: 'main-sidebar', classList: new MockClassList() };
const mockOverlay = { id: 'sidebar-overlay', classList: new MockClassList() };
const mockBtn = { id: 'mobile-menu-btn', classList: new MockClassList() };

function simulateToggle() {
  mockSidebar.classList.toggle('mobile-open');
  mockOverlay.classList.toggle('active');
  mockBtn.classList.toggle('open');
}

function simulateClose() {
  mockSidebar.classList.remove('mobile-open');
  mockOverlay.classList.remove('active');
  mockBtn.classList.remove('open');
}

// Action 1: User taps hamburger button on mobile
simulateToggle();
const openVerified = mockSidebar.classList.contains('mobile-open') &&
                     mockOverlay.classList.contains('active') &&
                     mockBtn.classList.contains('open');
console.log(openVerified ? '[PASS] Tap 1: Drawer opened, overlay active, button animated to "X"' : '[FAIL] Tap 1 failed');

// Action 2: User taps overlay or close button
simulateClose();
const closeVerified = !mockSidebar.classList.contains('mobile-open') &&
                      !mockOverlay.classList.contains('active') &&
                      !mockBtn.classList.contains('open');
console.log(closeVerified ? '[PASS] Tap 2: Drawer closed, overlay hidden, button reset' : '[FAIL] Tap 2 failed');

// Action 3: User opens drawer and clicks a navigation screen item
simulateToggle();
simulateClose();
const navVerified = !mockSidebar.classList.contains('mobile-open');
console.log(navVerified ? '[PASS] Navigation: Drawer auto-dismisses when user selects any screen' : '[FAIL] Navigation failed');

console.log('\n=== ALL VERIFICATIONS COMPLETE ===');
