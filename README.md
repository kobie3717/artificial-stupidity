# Rubber Duck Bot

Artificial stupidity that's surprisingly useful.

## What it is

A CLI chatbot that never solves your problem. It only asks dumb clarifying questions, one at a time. Forces you to talk through your issue until you solve it yourself.

## Install

```bash
cd /root/rubber-duck-bot
npm install
```

## Setup

Copy `.env.example` to `.env` and add your Anthropic API key:

```bash
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

```bash
npm start
# or
node index.mjs
```

Type your problem, press Enter. The duck will ask questions. You'll solve it yourself.

Press `ctrl+c` to quit.
