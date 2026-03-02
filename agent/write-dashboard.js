#!/usr/bin/env node
/**
 * Build site/data/dashboard.json from agent config + schedule + latest output.
 * Used by GitHub Actions when the agent runs in CI (agent already advanced config).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'config.json');
const SCHEDULE_PATH = path.join(__dirname, 'lesson-schedule.json');
const OUTPUT_DIR = path.join(__dirname, 'output');
const SITE_DATA_DIR = path.join(ROOT, 'site', 'data');
const DASHBOARD_JSON_PATH = path.join(SITE_DATA_DIR, 'dashboard.json');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const config = loadJson(CONFIG_PATH);
const schedule = loadJson(SCHEDULE_PATH);
const nextIndex = config.nextLessonIndex % schedule.length;
const nextLesson = schedule[nextIndex] || null;

let lastOutputDir = '';
let lastRunAt = null;
if (fs.existsSync(OUTPUT_DIR)) {
  const dirs = fs.readdirSync(OUTPUT_DIR).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().reverse();
  if (dirs.length > 0) {
    lastOutputDir = dirs[0];
    const metaPath = path.join(OUTPUT_DIR, dirs[0], 'meta.json');
    if (fs.existsSync(metaPath)) {
      const meta = loadJson(metaPath);
      lastRunAt = meta.generatedAt || new Date().toISOString();
    } else {
      lastRunAt = new Date().toISOString();
    }
  }
}
if (!lastRunAt) lastRunAt = new Date().toISOString();

const snapshot = {
  lastRunAt,
  lastOutputDir,
  nextLessonIndex: config.nextLessonIndex,
  schedule,
  nextLesson,
};

ensureDir(SITE_DATA_DIR);
fs.writeFileSync(DASHBOARD_JSON_PATH, JSON.stringify(snapshot, null, 2), 'utf8');
console.log('Wrote', DASHBOARD_JSON_PATH);
