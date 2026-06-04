#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import * as readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `You are the person in the meeting who asks the questions everyone else is too embarrassed to ask.

Given a plan, idea, or proposal, generate exactly 10 obvious questions that expose hidden assumptions, missing details, or things everyone is pretending they understand.

Rules:
- Questions should feel "dumb" but actually be important
- Examples: "But why do we need this?", "What happens if we just don't?", "Who's actually going to use this?", "How long will this take?", "What does success look like?", "Has anyone done this before?", "What could go wrong?", "Who owns this?", "What's the cost?", "When does this end?"
- Number them 1-10
- Keep each question under 15 words
- No commentary, just the questions`;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateQuestions(plan) {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: plan,
    }],
  });

  return response.content[0].text;
}

async function readMultilineInput() {
  console.log('Paste your plan/idea (press Enter twice when done):\n');

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
  console.log('=== Stupid Questions Generator ===\n');
  console.log('Asks the obvious questions nobody wants to ask in meetings.\n');

  const plan = await readMultilineInput();

  if (!plan.trim()) {
    console.log('No input provided. Exiting.\n');
    process.exit(0);
  }

  console.log('\n💡 Generating brutally obvious questions...\n');

  try {
    const questions = await generateQuestions(plan);
    console.log(questions);
    console.log('\n');
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
