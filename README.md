# Artificial Stupidity 🦆

> A collection of AI tools that are deliberately dumb — and surprisingly useful.

The opposite of AI assistants that try to solve everything. These tools help YOU think by being strategically useless.

## Tools

| Tool | What it does |
|------|-------------|
| [rubber-duck-bot](./rubber-duck-bot) | Asks dumb questions until you solve your own problem |
| [bad-first-draft](./bad-first-draft) | Generates terrible drafts so you have something to fix |
| [stupid-questions](./stupid-questions) | Asks the obvious questions nobody wants to ask |
| [bias-mirror](./bias-mirror) | Shows you what a skeptic hears when you pitch your idea |

## Philosophy

Good AI makes you dependent. Artificial stupidity makes you think.

Each tool here follows the same rule: **never solve the problem for you**. Instead, it creates just enough friction to get your brain working.

## Usage

Each tool is standalone. Pick one, `cd` into it, install deps, add your API key:

```bash
cd rubber-duck-bot
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
node index.mjs
```

## Contributing

Built something deliberately dumb? [Read CONTRIBUTING.md](./CONTRIBUTING.md) and send a PR.

## License

MIT
