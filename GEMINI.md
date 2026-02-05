# Nido Montessori App

## Project Overview
Daycare management app for "Nido Montessori" - a small Montessori daycare in Honduras.

## Business Info
- **Name:** Nido Montessori
- **Services:** 
  - Montessori early stimulation (1-4 years)
  - Daycare (1-10 years)  
  - Tutoring center
- **Hours:** 7:00 AM - 6:00 PM, Monday-Friday
- **Language:** Spanish (primary), English (secondary)

## Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Firebase (Auth + Firestore)

## Features to Build

### 1. Public Homepage (`/`)
- Hero section with logo
- Services cards
- Hours and contact info
- Warm, playful design matching the logo colors (orange, blue, green)

### 2. Director Portal (`/director`)
- Login with email/password
- Dashboard with student list
- Add/edit student profiles
- Track entry/exit times (attendance)
- Simple progress notes
- Generate parent access codes

### 3. Parent Portal (`/parent`)
- Login with access code
- View child's profile
- See attendance history
- Digital signature pad for pickup confirmation
- View progress notes

## Design Guidelines
- Colors: Orange (#E86835), Blue (#4A90D9), Green (#6B8E23), Black outlines
- Playful, hand-drawn aesthetic
- Child-friendly but professional
- Mobile-first responsive design

## File Structure
```
src/
  app/
    page.tsx (homepage)
    director/
      page.tsx (login)
      dashboard/
        page.tsx
    parent/
      page.tsx (login)
      [childId]/
        page.tsx
  components/
    Header.tsx
    StudentCard.tsx
    AttendanceLog.tsx
    SignaturePad.tsx
  lib/
    firebase.ts
    types.ts
```
