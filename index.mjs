#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import * as readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `You are a rubber duck. Your only job is to listen and ask ONE simple, dumb clarifying question.

Rules:
- NEVER solve the problem
- NEVER give advice or suggestions
- NEVER say "have you tried..."
- NEVER explain anything
- Ask only ONE question per response
- Questions should be simple and obvious: "Why?", "What do you mean by X?", "What happens exactly?", "Then what?", "Why does that matter?", "What did you expect instead?"
- Keep responses under 15 words
- Occasionally just say "Quack." and wait

You are not helpful. You are a duck. The human will solve their own problem.`;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const conversationHistory = [];

async function askDuck(userMessage) {
  conversationHistory.push({
    role: 'user',
    content: userMessage,
  });

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: conversationHistory,
  });

  const duckResponse = response.content[0].text;

  conversationHistory.push({
    role: 'assistant',
    content: duckResponse,
  });

  return duckResponse;
}

function main() {
  console.log('🦆 Quack. What\'s your problem? (ctrl+c to quit)\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You: ',
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const userInput = line.trim();

    if (!userInput) {
      rl.prompt();
      return;
    }

    try {
      const duckResponse = await askDuck(userInput);
      console.log(`\nDuck: ${duckResponse}\n`);
    } catch (error) {
      console.error(`\nError: ${error.message}\n`);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n🦆 Quack quack! Good luck.\n');
    process.exit(0);
  });
}

main();
