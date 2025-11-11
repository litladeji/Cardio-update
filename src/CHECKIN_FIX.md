# Daily Check-In Mock Mode Fix

## Issue
The `DailyCheckIn.tsx` component was attempting to submit check-ins to the Supabase backend even when running in mock/demo mode (`config.useMockData = true`), causing "Error submitting check-in: Error: Failed to submit check-in" errors.

## Solution
Updated the daily check-in flow to respect the mock mode configuration:

### 1. Added Mock Check-In Function (`/utils/mockData.ts`)
- Created `CheckInSubmission` and `CheckInResult` interfaces
- Implemented `submitMockDailyCheckIn()` function that:
  - Analyzes check-in responses for symptom severity
  - Classifies risk level as green/yellow/red based on symptoms, mood, and energy
  - Updates patient's `dailyCheckInStatus`, `recoveryStreak`, `aiAlertLevel`, and reported symptoms
  - Returns appropriate messages and follow-up flags

### 2. Updated DailyCheckIn Component (`/components/patient/DailyCheckIn.tsx`)
- Added imports for `config`, `submitMockDailyCheckIn`, and `CheckInSubmission` type
- Modified `handleSubmit()` to check `config.useMockData`:
  - **Mock mode**: Uses `submitMockDailyCheckIn()` with simulated 1-second delay
  - **Live mode**: Makes actual API call to Supabase backend
- Added success toast notification for mock submissions

## Risk Classification Logic (Mock Mode)
The mock check-in analyzes responses to determine patient status:

- **Red (Critical)**: Severe symptoms like chest pain, difficulty breathing
- **Yellow (Warning)**: Moderate symptoms, low energy + poor mood
- **Green (Good)**: No significant concerns, positive responses

## Benefits
- Daily check-in now works seamlessly in demo mode without backend
- Maintains same UX flow as live mode
- Updates mock patient data to reflect completed check-ins
- Enables full testing of patient portal features without Supabase

## Testing
To test in demo mode:
1. Ensure `config.useMockData = true` in `/utils/config.ts`
2. Log in as a patient (e.g., P001, P002, etc.)
3. Complete the daily check-in flow
4. Verify check-in submits successfully and dashboard updates
