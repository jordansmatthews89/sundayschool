import OpenAI from 'openai';

export function openai() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export interface GeneratedContent {
  newsletter: string;
  subjectLine: string;
  linkedinPost: string;
  tweetOptions: string[];
}

export interface LessonMeta {
  slug: string;
  title: string;
  series: string;
}

export async function generateLessonContent(
  lesson: LessonMeta,
  leaderGuide: string,
  familyTakeHome: string
): Promise<GeneratedContent> {
  const client = openai();
  const systemPrompt = `You are a Christian curriculum writer for Family Faith, a newsletter and resource hub for families. 
Your job is to write a weekly newsletter based on the provided Sunday School lesson.
Tone: warm, encouraging, practical. Audience: parents of elementary-school kids.
Always return valid JSON matching the schema exactly.`;

  const userPrompt = `Lesson: "${lesson.title}" (Series: ${lesson.series})

LEADER GUIDE:
${leaderGuide}

FAMILY TAKE-HOME:
${familyTakeHome}

Write the newsletter package. Return ONLY valid JSON:
{
  "newsletter": "Full newsletter body in markdown (400-600 words). Include: greeting, lesson summary, key verse, 2-3 family discussion questions, a simple family activity, closing encouragement.",
  "subjectLine": "Email subject line (max 60 chars, warm and curiosity-driven)",
  "linkedinPost": "LinkedIn post (150-200 words, professional but warm, include 3-4 hashtags)",
  "tweetOptions": ["Tweet option 1 (max 280 chars)", "Tweet option 2 (max 280 chars)"]
}`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const text = response.choices[0]?.message?.content ?? '{}';
  return JSON.parse(text) as GeneratedContent;
}
