# ALX Polly Security Audit

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

---

For more details, see code comments and Server Action implementations.