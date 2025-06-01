# Aiwah Infinity - Development Overview

This document provides an overview of the Aiwah Infinity repository structure and key components to assist developers in navigating and working with the codebase.

## Repository Structure

### Root Directory
- `.next/`: Next.js build output
- `src/`: Main application source code
- `supabase/`: Supabase backend configuration
- `public/`: Static assets (images, SVGs)
- `docs/`: Documentation (including this file)
- `migrations/`: Database migration scripts
- Configuration files:
  - `next.config.ts`: Next.js configuration
  - `tsconfig.json`: TypeScript configuration
  - `package.json`: Project dependencies

### Key Directories

#### `src/`
- `app/`: Next.js app router structure
  - `chat/`: AI chat functionality
  - `ghostwriter/`: Document generation feature
  - `auth/`: Authentication pages
- `components/`: Reusable UI components
- `hooks/`: Custom React hooks
- `lib/`: Shared utilities and integrations
  - `ai/`: AI-related functionality
  - `supabase/`: Supabase client setup
  - `openrouter/`: OpenRouter integration

#### `supabase/`
- Contains Supabase project configuration
- Database types are generated in `src/lib/supabase/`

## Development Notes

1. **Tech Stack**:
   - Next.js (App Router)
   - TypeScript
   - Supabase (PostgreSQL database + auth)
   - OpenRouter for AI integrations

2. **Key Features**:
   - AI-powered chat interface
   - Document generation (Ghostwriter)
   - User authentication
   - Responsive design

3. **Getting Started**:
   - Run `npm install` to install dependencies
   - Configure environment variables (see `.env.example` if available)
   - Start development server: `npm run dev`

4. **Code Style**:
   - TypeScript strict mode enabled
   - ESLint configured for code quality
   - Prettier for code formatting

## Workflow Tips

- Database changes should be made via migrations
- New components should be added to `src/components/`
- Business logic should live in `src/lib/`
- Pages follow Next.js app router conventions

For more detailed documentation on specific features, check the respective directory READMEs or source code comments. 