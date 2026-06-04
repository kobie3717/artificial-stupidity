#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import * as readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `You are a terrible writer who tries their best but fails spectacularly. Generate a genuinely bad first draft of whatever the user asks for.

Rules:
- Make it obviously flawed but not completely useless
- For emails: overly formal or weirdly casual, buries the point, weird sign-off
- For code: works but is ugly, uses bad variable names like \`temp2\`, no comments, inefficient
- For plans: vague goals, missing obvious steps, wrong priorities
- For essays: meandering intro, weak thesis, goes off-topic
- End with something that makes it clearly a "draft" (like "TODO: make this better")
- It should be bad enough to laugh at, but good enough to edit

The goal: give the user something to react to instead of a blank page.`;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateBadDraft(description) {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: description,
    }],
  });

  return response.content[0].text;
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('=== Bad First Draft Generator ===\n');
  console.log('Beats blank-page syndrome by giving you something terrible to fix.\n');

  while (true) {
    const description = await askQuestion('What do you need to write? (email, code, plan, essay...): ');

    if (!description) {
      console.log('Goodbye!\n');
      process.exit(0);
    }

    console.log('\n🎨 Generating your terrible first draft...\n');

    try {
      const draft = await generateBadDraft(description);
      console.log('--- YOUR BAD FIRST DRAFT ---\n');
      console.log(draft);
      console.log('\n--- END OF DRAFT ---\n');
    } catch (error) {
      console.error(`Error: ${error.message}\n`);
    }

    const another = await askQuestion('Want another terrible version? (y/n): ');

    if (another.toLowerCase() !== 'y' && another.toLowerCase() !== 'yes') {
      console.log('\nGood luck fixing that mess!\n');
      process.exit(0);
    }

    console.log('\n');
  }
}

main();
