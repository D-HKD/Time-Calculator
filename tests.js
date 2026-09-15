// Run in a browser console after opening index.html, or by including after app.js.
const cases = [
  ["10:30", 630], ["14:20", 860], ["00:15", 15], ["23:50", 1430],
  ["24:00", null], ["12:60", null], ["hello", null], ["", null]
];
for (const [value, expected] of cases) {
  const actual = window.timeCalculator.parseTimeToMinutes(value);
  if (actual !== expected) throw new Error(`${value}: expected ${expected}, got ${actual}`);
}
console.info("Time parser tests passed.");
