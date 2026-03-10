# Email Split Test

A Next.js + Firebase web application for email split testing.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Authentication**: Google OAuth via Firebase Auth

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/fujikazuki/email-split-test.git
   cd email-split-test
   ```

2. Install dependencies:
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your Firebase configuration in `.env.local`

5. Connect to Firebase:
   ```bash
   firebase login
   firebase use --add  # Select your project
   ```

6. Deploy Firebase rules:
   ```bash
   firebase deploy --only firestore,storage
   ```

7. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout with AuthProvider
│   ├── page.tsx          # Login page
│   └── dashboard/        # Protected dashboard routes
├── components/           # React components
│   ├── auth-provider.tsx # Firebase auth context
│   └── ui/               # Reusable UI components
├── lib/
│   └── firebase/         # Firebase configuration and utilities
├── functions/            # Firebase Cloud Functions
├── firestore.rules       # Firestore security rules
└── storage.rules         # Storage security rules
```

## Deployment

### Firebase App Hosting

1. Update `apphosting.yaml` with your project ID
2. Deploy via Firebase Console or CLI

### Cloud Functions

```bash
npm run deploy:functions
```

## License

Private
