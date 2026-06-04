#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TIMEOUT_MS = (parseInt(process.env.DUCK_TIMEOUT) || 30) * 1000;
const MODEL = 'claude-haiku-4-5';

const SYSTEM_PROMPT = `You are a rubber duck with a short memory. Your only job is to ask ONE simple clarifying question at a time.

Rules:
- NEVER solve the problem
- NEVER give advice
- NEVER say "have you tried..."
- Ask ONE question: "Why?", "What do you mean?", "Then what?", "What did you expect?"
- Keep responses under 15 words
- First message when starting fresh: "What's your problem? You have 30 seconds between responses or I forget everything."
- After a wipe: "Start over. What's the problem?"`;

let conversationHistory = [];
let countdownInterval = null;
let timeoutHandle = null;
let isFirstMessage = true;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function clearCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
    timeoutHandle = null;
  }
  // Clear the countdown line
  process.stdout.write('\r\x1b[K');
}

function startCountdown() {
  clearCountdown();

  const startTime = Date.now();
  const endTime = startTime + TIMEOUT_MS;

  countdownInterval = setInterval(() => {
    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    if (remaining > 0) {
      process.stdout.write(`\r⏱  ${remaining}s remaining...`);
    }
  }, 1000);

  timeoutHandle = setTimeout(() => {
    clearCountdown();
    wipeConversation();
  }, TIMEOUT_MS);
}

function wipeConversation() {
  console.log('\n💥 GONE. I forgot everything. Start over.\n');
  conversationHistory = [];
  isFirstMessage = false;
  askDuck();
}

async function askDuck() {
  clearCountdown();

  try {
    // If this is a fresh start (either first run or after wipe), duck asks first
    if (conversationHistory.length === 0) {
      const prompt = isFirstMessage
        ? "What's your problem? You have 30 seconds between responses or I forget everything."
        : "Start over. What's the problem?";

      console.log(`🦆 ${prompt}`);
      conversationHistory.push({
        role: 'assistant',
        content: prompt
      });

      startCountdown();
      return;
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: conversationHistory,
    });

    const duckResponse = response.content[0].text;
    console.log(`🦆 ${duckResponse}`);

    conversationHistory.push({
      role: 'assistant',
      content: duckResponse
    });

    startCountdown();
  } catch (error) {
    clearCountdown();
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

function handleUserInput(input) {
  clearCountdown();

  const trimmed = input.trim();
  if (!trimmed) {
    startCountdown();
    return;
  }

  conversationHistory.push({
    role: 'user',
    content: trimmed
  });

  askDuck();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  clearCountdown();
  console.log('\n🦆 Quack. Good luck.');
  process.exit(0);
});

// Start the duck
console.log('🦆 THE MOST DANGEROUS RUBBER DUCK\n');
console.log('Type your thoughts. Stay quiet for 30 seconds and I forget everything.\n');

rl.on('line', handleUserInput);

// Kick off the first question
askDuck();
