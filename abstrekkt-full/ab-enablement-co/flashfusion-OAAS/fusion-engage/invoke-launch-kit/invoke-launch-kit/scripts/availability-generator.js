// availability-generator.js
// Auto-seeds Availability slots in B44 for the next N weeks
// Usage: node availability-generator.js [weeks=4] [days-of-week=1,2,3,4] [slots=3]
// Defaults: 4 weeks, Mon-Thu, 3 time slots per day

// ─────────────────────────────────────────────
// CONFIG — edit this section only
// ─────────────────────────────────────────────

const CONFIG = {
  // B44 app ID
  appId: '69c440b10249984f1114bc4b',

  // How many weeks ahead to generate
  weeksAhead: 6,

  // Days of week to include (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
  daysOfWeek: [1, 2, 3, 4], // Mon-Thu

  // Available time slots to seed
  timeSlots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],

  // Skip these specific dates (YYYY-MM-DD)
  blackoutDates: [
    // '2026-05-26', // Memorial Day
    // '2026-07-04', // Independence Day
  ],

  // Default notes per day-of-week (optional)
  dayNotes: {
    1: 'Open — all session types',
    2: 'Discovery calls preferred',
    3: 'Open — all session types',
    4: 'Audit follow-ups + deep work',
  },
};

// ─────────────────────────────────────────────
// B44 API HELPER
// ─────────────────────────────────────────────

async function b44CreateEntities(entities) {
  // In B44 context this calls the internal entity API
  // When running locally, replace with a direct API call if B44 exposes one
  // For now this logs the payload for manual import
  return entities;
}

// ─────────────────────────────────────────────
// DATE UTILS
// ─────────────────────────────────────────────

function toYMD(date) {
  return date.toISOString().split('T')[0];
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// ─────────────────────────────────────────────
// GENERATOR
// ─────────────────────────────────────────────

function generateSlots() {
  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = addDays(today, CONFIG.weeksAhead * 7);

  let cursor = addDays(today, 1); // start tomorrow

  while (cursor < endDate) {
    const dayOfWeek = cursor.getDay();
    const dateStr = toYMD(cursor);

    if (
      CONFIG.daysOfWeek.includes(dayOfWeek) &&
      !CONFIG.blackoutDates.includes(dateStr)
    ) {
      slots.push({
        date: dateStr,
        time_slots: CONFIG.timeSlots,
        notes: CONFIG.dayNotes[dayOfWeek] || 'Open — all session types',
        is_active: true,
      });
    }
    cursor = addDays(cursor, 1);
  }

  return slots;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

async function main() {
  const slots = generateSlots();

  console.log(`\n📅 AVAILABILITY GENERATOR`);
  console.log(`Generating ${slots.length} slots over ${CONFIG.weeksAhead} weeks...`);
  console.log(`Days: ${CONFIG.daysOfWeek.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}`);
  console.log(`Times: ${CONFIG.timeSlots.join(', ')}\n`);

  slots.forEach(s => {
    const day = new Date(s.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    console.log(`  ${day}: ${s.time_slots.join(', ')}`);
  });

  console.log(`\n✅ ${slots.length} slots ready`);
  console.log('\nPayload for B44 create_entities:');
  console.log(JSON.stringify(slots, null, 2));

  // When wired to B44 MCP directly:
  // const result = await b44CreateEntities(slots);
  // console.log(`Created ${result.length} records`);
}

main().catch(console.error);

// ─────────────────────────────────────────────
// PRO MOVE: Run this on a cron monthly to keep
// slots auto-populated. Add to n8n on a schedule:
// POST to n8n webhook → trigger this script via
// a Code node or Cloudflare Worker cron.
// ─────────────────────────────────────────────
