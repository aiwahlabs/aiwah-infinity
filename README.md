# Aiwah Infinity

A modern web application built with Next.js 15, Supabase, and Saas UI.

## Features

- **Authentication**: Complete auth flow with login, signup, and password reset using Supabase Auth
- **Secure Cookies**: Uses HTTP-only cookies for secure auth token storage
- **Row Level Security**: Data protection with Supabase's RLS
- **Modern UI**: Powered by Saas UI (built on Chakra UI)
- **TypeScript**: Full type safety throughout the codebase

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn
- Supabase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aiwah-infinity-v3.git
cd aiwah-infinity-v3
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
COOKIE_NAME=supabase-auth-token
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
aiwah-infinity/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── auth/             # Auth callback routes
│   │   ├── dashboard/        # Protected dashboard page
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   ├── layout.tsx        # Root layout with Providers
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable components
│   │   ├── AuthProvider.tsx  # Auth context provider
│   │   └── NavBar.tsx        # Navigation bar
│   └── lib/                  # Utility functions
│       └── supabase/         # Supabase client utilities
│           ├── browser.ts    # Browser client
│           └── server.ts     # Server client
├── middleware.ts             # Auth middleware
├── .env.local                # Environment variables (create this)
└── package.json              # Project dependencies
```

## Development Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:start` - Start Supabase local development
- `npm run db:gen` - Generate TypeScript types from Supabase
- `npm run db:mig` - Create a new migration and reset the database

## Deployment

This app can be deployed to Vercel with the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Saas UI Documentation](https://saas-ui.dev/docs)

## License

This project is licensed under the MIT License.
