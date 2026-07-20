# Freelance Hub

A comprehensive management platform for freelancers to track projects, clients, invoices, and generate professional reports.

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- State Management: Zustand
- Data Fetching: TanStack Query
- Testing: Jest + React Testing Library
- PDF Generation: jsPDF + jspdf-autotable

## Getting Started

Prerequisites: Node.js 18+, npm/yarn/pnpm, Supabase account.

Installation:
git clone <>
cd freelance-hub
npm install
cp .env.example .env.local
npm run dev

Open http://localhost:3000 to view the application.

Environment Variables:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

## Testing

Run all tests: npm test
Run specific test: npm test -- dashboard-calculations.test.ts
Run with coverage: npm test -- --coverage

Test Coverage:
- Dashboard calculations: 5 tests
- Zustand store: 3 tests
- Projects CRUD hooks: 4 tests
- Total: 19+ tests passing

## Project Structure

freelance-hub/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Protected routes
│   └── login/              # Authentication
├── components/             # Reusable UI components
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
│   ├── use-projects.ts     # Project CRUD operations
│   └── use-invoices.ts     # Invoice management
├── lib/                    # Business logic & utilities
│   ├── supabaseClient.ts   # Database client
│   ├── dashboard-calculations.ts
│   └── generateReportPDF.ts
├── store/                  # Zustand state stores
│   └── dashboard-store.ts
├── types/                  # TypeScript definitions
└── __tests__/              # Test suite

## Features

- Dashboard with real-time metrics
- Client management
- Project management with status tracking
- Invoice generation
- PDF reports
- Authentication with Supabase
- Responsive design

## Deployment

npm run build
npm run start

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feat/feature-name
3. Commit changes: git commit -m "feat: add feature"
4. Push: git push origin feat/feature-name
5. Open a Pull Request


## Contact

Simone Boncore - boncoresimone7@gmail.com

Built with ❤️ for freelancers