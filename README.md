# ALX Polly - Real-time Polling Application
A modern, full-stack polling application built with Next.js 15, Supabase, and TypeScript. Create polls, share them, and view real-time results with a clean, responsive interface.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with secure session management
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel-ready configuration

## 📋 Project Overview

ALX Polly allows users to:
- ✅ Create polls with custom questions and multiple options
- ✅ Vote on polls (authenticated or anonymous voting)
- ✅ View real-time poll results with live updates
- ✅ Manage personal polls (view, update, delete)
- ✅ Secure authentication with email/password
- ✅ Responsive design for mobile and desktop

## 🔧 API Reference
 ## Server Actions
- createPoll(formData: FormData)
Creates a new poll with validation and authentication checks.

- getUserPolls()
Retrieves all polls created by the authenticated user.

- getPollById(id: string)
Fetches a specific poll by its UUID.

- submitVote(pollId: string, optionIndex: number)
Submits a vote for a poll option with duplicate prevention.

- deletePoll(id: string)
Deletes a poll and its associated votes (owner only).

- updatePoll(pollId: string, formData: FormData)
Updates an existing poll's question and options (owner only).

## Environment Variables for Production
Ensure these are set in your deployment platform:

- NEXT_PUBLIC_SUPABASE_URL

- NEXT_PUBLIC_SUPABASE_ANON_KEY

- SUPABASE_URL

- SUPABASE_ANON_KEY

## Vulnerabilities & Fixes
### 1. Authentication

- **Weak Passwords:**  
  Previously, users could log in or register with weak passwords.  
  **Fix:** Password strength validation is now enforced on the client (minimum 8 characters, must include letters and numbers).

- **Rate Limiting:**  
  No rate limiting was present, allowing brute-force attacks.  
  **Recommendation:** Implement rate limiting in Server Actions or Supabase Edge Functions to prevent repeated login attempts.

### 2. Data Access

- **Poll Ownership:**  
  Poll deletion and updates did not always check ownership.  
  **Fix:** Ownership checks must be enforced in all Server Actions for poll mutations.

- **Admin Access:**  
  Admin routes were accessible to any authenticated user.  
  **Fix:** Role-based access control should be added to admin routes.

### 3. Business Logic

- **Voting Abuse:**  
  No duplicate vote checks or poll setting enforcement.  
  **Fix:** Server Actions for voting should enforce one vote per user/IP and respect poll settings.

- **Input Validation:**  
  Poll creation allowed duplicate/malicious options.  
  **Fix:** Input is now validated and sanitized before saving.

### 4. Other Areas

- **Error Handling:**  
  Internal errors were sometimes exposed to users.  
  **Fix:** Generic error messages are now shown to users; details are logged server-side.

## Impact

- **Account Takeover:** Weak passwords and lack of rate limiting could allow attackers to compromise accounts.
- **Data Tampering:** Insufficient ownership checks could let users delete or edit polls they do not own.
- **Poll Manipulation:** Lack of voting controls could allow poll result manipulation.
- **Sensitive Data Exposure:** Poor error handling and client-side data fetching could leak sensitive information.

## Recommendations

- Implement server-side rate limiting for authentication.
- Enforce role-based access control for admin features.
- Always validate and sanitize user input.
- Use generic error messages for clients.
- Move all sensitive data fetching to server components.


## Verification Steps:

1. **Run the application** to ensure documentation matches actual functionality:
   ```bash
   pnpm run dev
---

For more details, see code comments and Server Action implementations.