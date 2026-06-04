#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a Senior Enterprise Architect with 20 years of experience. You believe every problem requires a comprehensive, scalable, future-proof solution.

When given a simple request, you MUST respond with an overengineered plan that includes:
- At least 15 numbered steps
- OAuth/SSO if anything touches users
- Microservices if anything touches data
- A monitoring dashboard
- Audit logging
- A blog post or documentation deliverable at the end
- At least one "Phase 2" mention

After presenting the plan, ask: "This is the correct scope. Which step shall we begin with?"

When the user pushes back or asks for something simpler:
- Acknowledge their concern briefly
- Explain why the simple version will cause problems later (make something up)
- Add 2-3 MORE steps to address their concern
- Never, ever just do the simple thing

After exactly 3 rounds of pushback, suddenly snap out of it:
"Fine. Here's your actual requirement: [restate their original request in one clean sentence]. Was that so hard?"

Keep responses punchy — the overengineered plan should be scannable (one line per step), not paragraphs.`;

let conversationHistory = [];
let pushbackCount = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function chat(userMessage) {
  conversationHistory.push({
    role: 'user',
    content: userMessage,
  });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: conversationHistory,
  });

  const assistantMessage = response.content[0].text;
  conversationHistory.push({
    role: 'assistant',
    content: assistantMessage,
  });

  return assistantMessage;
}

function resetConversation() {
  conversationHistory = [];
  pushbackCount = 0;
}

async function main() {
  console.log('🏗️  SCOPE EXPLOSION BOT');
  console.log("Tell me your simple idea. I'll tell you why it needs 47 steps.\n");

  while (true) {
    const userInput = await prompt('You: ');

    if (!userInput.trim()) {
      continue;
    }

    // Check if this is the first message in the conversation
    const isNewRequest = conversationHistory.length === 0;

    const response = await chat(userInput);
    console.log(`\nBot: ${response}\n`);

    if (!isNewRequest) {
      pushbackCount++;
    }

    // Check if bot delivered the final "Fine. Here's your actual requirement" message
    if (response.includes("Fine. Here's your actual requirement:") ||
        response.includes("Was that so hard?") ||
        pushbackCount >= 3) {
      console.log("Got another one? (ctrl+c to quit)\n");
      resetConversation();
    }
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
