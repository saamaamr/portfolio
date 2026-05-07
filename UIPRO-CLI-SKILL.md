# UIPro CLI Skill Guide

## Overview
The `uipro-cli` is a command-line tool for installing UI/UX Pro Max skills for various AI coding assistants. It provides pre-built skill sets that enhance the capabilities of AI assistants like Claude Code, Cursor, Windsurf, and others with UI/UX focused knowledge.

## Installation
```bash
npm install -g uipro-cli
```

## Usage
After installation, you can use the CLI with the following commands:

### Initialize a skill
Installs UI/UX Pro Max skill for a specific AI assistant:
```bash
uipro init
```
This will prompt you to select which AI assistant to install the skill for:
- Claude Code (.claude/skills/)
- Cursor (.cursor/skills/)
- Windsurf (.windsurf/skills/)
- Antigravity (.agent/skills/)
- GitHub Copilot (.github/prompts/)
- RooCode (.roo/skills/)
- Kiro (.kiro/steering/)
- Codex (.codex/skills/)
- Qoder (.qoder/skills/)
- Gemini CLI (.gemini/skills/)

### List available versions
```bash
uipro versions
```

### Update to latest version
```bash
uipro update
```

## Example Workflow
1. Install the CLI globally: `npm install -g uipro-cli`
2. Navigate to your project directory
3. Run `uipro init` and select your AI assistant
4. Restart your AI coding assistant
5. Use enhanced UI/UX capabilities in your assistant

## Skill Content
Once installed, the UI/UX Pro Max skill provides:
- UI/UX best practices and principles
- Component library knowledge
- Design system guidelines
- Accessibility standards (WCAG)
- Responsive design techniques
- User interaction patterns
- Prototyping methodologies

## Troubleshooting
If the command is not found after installation:
1. Ensure your npm global bin directory is in your PATH
2. On Windows, check that `%APPDATA%\npm` is in your PATH
3. You can run the CLI directly using the full path: `%APPDATA%\npm\uipro`

## Notes
- Skills are installed in the appropriate directory for each AI assistant
- After installation, restart your AI coding assistant to load the new skills
- The skill includes templates and guidelines that can be referenced during development