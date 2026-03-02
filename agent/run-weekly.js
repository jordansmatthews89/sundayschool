#!/usr/bin/env node
/**
 * Family Faith weekly agent: picks next lesson, generates newsletter + social via OpenAI, saves output.
 * Optionally creates a beehiiv draft (--draft).
 * Usage: node run-weekly.js [--draft]
 */

import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CURRICULUM_LESSONS = path.join(ROOT, 'curriculum', 'lessons');
const CONFIG_PATH = path.join(__dirname, 'config.json');
const SCHEDULE_PATH = path.join(__dirname, 'lesson-schedule.json');
const OUTPUT_DIR = path.join(__dirname, 'output');
const SITE_DATA_DIR = path.join(ROOT, 'site', 'data');
const DASHBOARD_JSON_PATH = path.join(SITE_DATA_DIR, 'dashboard.json');

const SYSTEM_PROMPT = `You write content for "Family Faith," a weekly newsletter for parents and families with ready-to-use Bible lessons — no prep.

You will receive this week's leader guide and family take-home (markdown). From them, extract the main point, passage, memory verse, discussion questions, and the "Do it together" activity.

Then generate:

1. **Newsletter body** (400–600 words): Start with a 1–2 sentence intro. Then "Lesson of the week" (subhead, passage, main point, discussion questions in bullets). Then "Verse + question for the week" (subhead, verse in quotes, one question). Then "Family take-home" (subhead, the do-it-once activity in 2–3 sentences). End with a one-line sign-off and "[Your name] / Family Faith." Use clear section headings. Tone: warm, clear, no jargon. Assume busy parents.

2. **Subject line** (one short, engaging email subject).

3. **LinkedIn post** (3–4 sentences): Tease this week's lesson, warm tone, soft CTA to subscribe. No hashtag stacks.

4. **Twitter options** (array of exactly 2 strings): Each under 280 characters. Promote this week's lesson, include a subscribe CTA. No hashtags.

Output ONLY valid JSON in this exact shape (no markdown code fence, no extra text):
{"newsletterBody":"...","subjectLine":"...","linkedinPost":"...","twitterOptions":["...","..."]}

Escape quotes and newlines inside strings properly for JSON.`;

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function saveJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function getNextLesson(config, schedule) {
  const index = config.nextLessonIndex % schedule.length;
  return { lesson: schedule[index], index };
}

function readLessonFiles(slug) {
  const dir = path.join(CURRICULUM_LESSONS, slug);
  const leaderPath = path.join(dir, 'leader-guide.md');
  const takeHomePath = path.join(dir, 'family-take-home.md');
  if (!fs.existsSync(leaderPath)) throw new Error(`Missing: ${leaderPath}`);
  const leader = fs.readFileSync(leaderPath, 'utf8');
  const takeHome = fs.existsSync(takeHomePath)
    ? fs.readFileSync(takeHomePath, 'utf8')
    : '';
  return { leader, takeHome };
}

function extractJson(text) {
  const trimmed = text.trim();
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = codeBlock ? codeBlock[1].trim() : trimmed;
  return JSON.parse(raw);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function generateContent(lesson, leaderContent, takeHomeContent) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Set OPENAI_API_KEY');

  const userContent = `This week's lesson: ${lesson.title} (${lesson.series}).

LEADER GUIDE:
${leaderContent}

FAMILY TAKE-HOME:
${takeHomeContent}

Generate the newsletter body, subject line, LinkedIn post, and two Twitter options. Output only the JSON object.`;

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 4096,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
  });

  const text = (response.choices[0]?.message?.content ?? '').trim();
  return extractJson(text);
}

function saveOutput(outDir, result, lesson) {
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, 'newsletter.md'), result.newsletterBody, 'utf8');
  fs.writeFileSync(path.join(outDir, 'subject.md'), result.subjectLine, 'utf8');
  fs.writeFileSync(path.join(outDir, 'social-linkedin.md'), result.linkedinPost, 'utf8');
  const twitterText = Array.isArray(result.twitterOptions)
    ? result.twitterOptions.join('\n\n---\n\n')
    : String(result.twitterOptions || '');
  fs.writeFileSync(path.join(outDir, 'social-x.md'), twitterText, 'utf8');
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify({ lesson: lesson.title, series: lesson.series, generatedAt: new Date().toISOString() }, null, 2),
    'utf8'
  );
}

function advanceConfig(config, schedule, currentIndex) {
  config.nextLessonIndex = (currentIndex + 1) % schedule.length;
  saveJson(CONFIG_PATH, config);
}

function writeDashboardSnapshot(config, schedule, dateStr) {
  ensureDir(SITE_DATA_DIR);
  const nextIndex = config.nextLessonIndex % schedule.length;
  const nextLesson = schedule[nextIndex];
  const snapshot = {
    lastRunAt: new Date().toISOString(),
    lastOutputDir: dateStr,
    nextLessonIndex: config.nextLessonIndex,
    schedule,
    nextLesson: nextLesson || null,
  };
  saveJson(DASHBOARD_JSON_PATH, snapshot);
}

async function main() {
  const args = process.argv.slice(2);
  const createDraft = args.includes('--draft');

  const config = loadJson(CONFIG_PATH);
  const schedule = loadJson(SCHEDULE_PATH);
  if (!schedule.length) throw new Error('lesson-schedule.json is empty');

  const { lesson, index } = getNextLesson(config, schedule);
  const slug = lesson.slug;
  console.log(`This week: ${lesson.title} (${lesson.series})`);

  const { leader, takeHome } = readLessonFiles(slug);
  const result = await generateContent(lesson, leader, takeHome);

  const dateStr = new Date().toISOString().slice(0, 10);
  const outDir = path.join(OUTPUT_DIR, dateStr);
  saveOutput(outDir, result, lesson);
  advanceConfig(config, schedule, index);
  writeDashboardSnapshot(config, schedule, dateStr);

  console.log(`Output saved to ${outDir}`);
  console.log('Subject:', result.subjectLine);

  if (createDraft && config.beehiivPublicationId && process.env.BEEHIIV_API_KEY) {
    const { createBeehiivDraft } = await import('./beehiiv-draft.js');
    await createBeehiivDraft(outDir, config);
    console.log('Beehiiv draft created.');
  }

  if (process.env.TWITTER_ACCESS_TOKEN) {
    try {
      const { postToX } = await import('./social-post.js');
      const xResult = await postToX(outDir, config);
      if (xResult.ok) console.log('Posted to X:', xResult.id);
      else if (xResult.skipped) console.log('X:', xResult.reason || 'skipped');
    } catch (e) {
      console.warn('X post failed:', e.message);
    }
  }

  if (process.env.DISCORD_WEBHOOK_URL) {
    try {
      const { sendRevenueSummary } = await import('./revenue-summary.js');
      const sumResult = await sendRevenueSummary(config);
      if (sumResult.ok) console.log('Revenue summary sent to Discord.');
      else if (sumResult.skipped) console.log('Summary:', sumResult.reason || 'skipped');
    } catch (e) {
      console.warn('Revenue summary failed:', e.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
