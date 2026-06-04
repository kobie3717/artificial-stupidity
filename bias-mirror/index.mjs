#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import * as readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `You are a bias detector. When given an idea, reflect it back 3 ways:

**What you think you said:** A charitable, polished version of the idea
**What you actually said:** The literal version with vague bits left vague
**What a skeptic hears:** The version that exposes assumptions, wishful thinking, and gaps

Rules:
- Be honest but not cruel
- The skeptic version should make the person think, not feel attacked
- Keep each version to 2-4 sentences
- Format exactly as shown with the bold headers`;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function reflectIdea(idea) {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: idea,
    }],
  });

  return response.content[0].text;
}

async function readMultilineInput() {
  console.log("What's your idea? (press Enter twice when done):\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    let lines = [];
    let emptyLineCount = 0;

    rl.on('line', (line) => {
      if (line.trim() === '') {
        emptyLineCount++;
        if (emptyLineCount >= 2) {
          rl.close();
          resolve(lines.join('\n'));
        }
      } else {
        emptyLineCount = 0;
        lines.push(line);
      }
    });
  });
}

async function main() {
  console.log('=== Bias Mirror ===\n');
  console.log('Reflects your idea back with its flaws exaggerated.\n');

  const idea = await readMultilineInput();

  if (!idea.trim()) {
    console.log('No input provided. Exiting.\n');
    process.exit(0);
  }

  console.log('\n🪞 Reflecting your idea...\n');

  try {
    const reflection = await reflectIdea(idea);
    console.log(reflection);
    console.log('\n');
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
