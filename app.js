"use strict";

const DAY_MINUTES = 24 * 60;
const elements = {
  baseTime: document.querySelector("#base-time"),
  adjustMinutes: document.querySelector("#adjust-minutes"),
  adjustResult: document.querySelector("#adjust-result"),
  adjustMessage: document.querySelector("#adjust-message"),
  startTime: document.querySelector("#start-time"),
  endTime: document.querySelector("#end-time"),
  allowMidnight: document.querySelector("#allow-midnight"),
  differenceResult: document.querySelector("#difference-result"),
  differenceDetail: document.querySelector("#difference-detail"),
  resetAll: document.querySelector("#reset-all")
};

/**
 * Converts an HH:MM value into minutes after midnight.
 * This deliberately does not use a regular expression: browser time inputs can
 * vary across Safari versions, so each field is parsed and range-checked directly.
 */
function parseTimeToMinutes(value) {
  const parts = String(value ?? "").trim().split(":");
  if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) return null;

  const [hourText, minuteText] = parts;
  if (hourText === "" || minuteText === "") return null;

  const hours = Number(hourText);
  const minutes = Number(minuteText);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatTime(totalMinutes) {
  const normalized = ((totalMinutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} 分鐘`;
  if (minutes === 0) return `${hours} 小時`;
  return `${hours} 小時 ${minutes} 分鐘`;
}

function getSelectedOperation() {
  return document.querySelector('input[name="operation"]:checked').value;
}

function calculateAdjustment() {
  const base = parseTimeToMinutes(elements.baseTime.value);
  const typedMinutes = elements.adjustMinutes.value.trim();
  const minutes = Number(typedMinutes);

  if (base === null || typedMinutes === "" || !Number.isInteger(minutes) || minutes < 0 || minutes > 9999) {
    elements.adjustResult.value = "--:--";
    elements.adjustMessage.textContent = "請輸入有效時間及分鐘";
    return;
  }

  const multiplier = getSelectedOperation() === "add" ? 1 : -1;
  elements.adjustResult.value = formatTime(base + multiplier * minutes);
  elements.adjustMessage.textContent = `${getSelectedOperation() === "add" ? "加上" : "減去"} ${minutes} 分鐘`;
}

function calculateDifference() {
  const start = parseTimeToMinutes(elements.startTime.value);
  const end = parseTimeToMinutes(elements.endTime.value);
  if (start === null || end === null) {
    elements.differenceResult.value = "-- 分鐘";
    elements.differenceDetail.textContent = "請輸入兩個有效時間";
    return;
  }

  let difference = end - start;
  if (difference < 0 && elements.allowMidnight.checked) difference += DAY_MINUTES;
  if (difference < 0) {
    elements.differenceResult.value = "無效順序";
    elements.differenceDetail.textContent = "請開啟「跨午夜計算」，或重新輸入結束時間";
    return;
  }
  elements.differenceResult.value = `${difference} 分鐘`;
  elements.differenceDetail.textContent = formatDuration(difference);
}

function resetAdjustment() {
  elements.baseTime.value = "";
  elements.adjustMinutes.value = "";
  document.querySelector("#op-add").checked = true;
  calculateAdjustment();
  elements.baseTime.focus();
}

function resetDifference() {
  elements.startTime.value = "";
  elements.endTime.value = "";
  elements.allowMidnight.checked = true;
  calculateDifference();
  elements.startTime.focus();
}

[elements.baseTime, elements.adjustMinutes].forEach((input) => input.addEventListener("input", calculateAdjustment));
document.querySelectorAll('input[name="operation"]').forEach((input) => input.addEventListener("change", calculateAdjustment));
[elements.startTime, elements.endTime, elements.allowMidnight].forEach((input) => input.addEventListener("input", calculateDifference));
document.querySelectorAll("[data-reset]").forEach((button) => button.addEventListener("click", () => {
  button.dataset.reset === "adjust" ? resetAdjustment() : resetDifference();
}));
elements.resetAll.addEventListener("click", () => { resetAdjustment(); resetDifference(); });

calculateAdjustment();
calculateDifference();

// Exposed only for the lightweight browser test file; not needed by users.
window.timeCalculator = { parseTimeToMinutes, formatTime, formatDuration };
