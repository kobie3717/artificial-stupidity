# Dangerous Duck

**The Most Dangerous Rubber Duck** — a CLI rubber duck debugger that wipes your entire conversation if you go quiet for 30 seconds.

Based on The Most Dangerous Writing App. The deletion threat forces you to keep articulating your problem.

## Install

```bash
cd dangerous-duck
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

## Run

```bash
npm start
```

You have 30 seconds between responses. Stay silent and the duck forgets everything. Ctrl+C to exit.
