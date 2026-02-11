# Collab Whiteboard 🎨

A real-time collaborative whiteboard with AI features. Draw, add sticky notes, and use AI to organize and summarize ideas — all in real-time with anyone who has the link.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Liveblocks](https://img.shields.io/badge/Liveblocks-Real--time-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## Features

- ✏️ Freehand drawing with color picker & brush size
- 📝 Sticky notes — create, move, edit, delete
- 👥 Real-time cursors showing other users
- 🤖 AI: Organize notes into categories
- 🤖 AI: Summarize board content
- 🔗 Share link — no auth needed
- ↩️ Undo/redo
- 🌙 Dark mode
- 📱 Responsive

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your Liveblocks public key
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` | Yes | Free at [liveblocks.io](https://liveblocks.io) |
| `OPENROUTER_API_KEY` | No | For real AI features. Mock AI works without it |

## Stack

- **Next.js 15** App Router
- **Liveblocks** for real-time sync (presence + storage)
- **HTML Canvas** for drawing
- **Tailwind CSS** + **Framer Motion**
- **OpenRouter** for AI (with mock fallback)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/matua-agent/collab-whiteboard&env=NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY)
