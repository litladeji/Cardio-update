# 🔧 Troubleshooting Guide

## Error: "Failed to fetch patients"

If you're seeing this error, follow these steps:

---

## Quick Diagnosis

### 1. Check Supabase Connection

Open your browser console and run:

```javascript
// Test health endpoint
fetch('https://fvyqkzaktmcseovxvukq.supabase.co/functions/v1/make-server-c21253d3/health', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXFremFrdG1jc2Vvdnh2dWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjM5MjgsImV4cCI6MjA3NjAzOTkyOH0.TjHfv9lRC5dQbwpGtAI-x_uSOL_FQplGN4KJ7GHI2aI'
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ Health check:', d))
  .catch(e => console.error('❌ Health check failed:', e));
```

**Expected Response:** `{ status: "ok" }`

---

### 2. Check Patient Data Endpoint

```javascript
// Test patients endpoint
fetch('https://fvyqkzaktmcseovxvukq.supabase.co/functions/v1/make-server-c21253d3/patients', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXFremFrdG1jc2Vvdnh2dWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjM5MjgsImV4cCI6MjA3NjAzOTkyOH0.TjHfv9lRC5dQbwpGtAI-x_uSOL_FQplGN4KJ7GHI2aI'
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ Patients:', d.patients?.length, 'patients loaded'))
  .catch(e => console.error('❌ Patient fetch failed:', e));
```

**Expected Response:** `{ patients: [...] }` with 6 patients

---

## Common Issues & Fixes

### Issue 1: CORS Error

**Symptom:** Browser console shows CORS policy error

**Fix:** 
- The server should have CORS enabled (already done in code)
- Check browser console for specific CORS error
- Make sure Supabase Edge Functions are deployed

---

### Issue 2: Database Table Missing

**Symptom:** KV store errors about table not existing

**Fix:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/fvyqkzaktmcseovxvukq
2. Navigate to: Database → Tables
3. Check if table `kv_store_c21253d3` exists
4. If not, create it:

```sql
CREATE TABLE kv_store_c21253d3 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

---

### Issue 3: Edge Function Not Deployed

**Symptom:** 404 error when calling API endpoints

**Fix:**
1. Deploy the edge function using Supabase CLI:

```bash
supabase functions deploy server
```

2. Or redeploy from Supabase Dashboard:
   - Go to Edge Functions section
   - Find `server` function
   - Click "Deploy"

---

### Issue 4: Empty Patient List

**Symptom:** Dashboard loads but shows "No patients found"

**Fix:**
The backend now automatically initializes sample data on first request. If still empty:

1. Manually trigger initialization:
```javascript
fetch('https://fvyqkzaktmcseovxvukq.supabase.co/functions/v1/make-server-c21253d3/patients', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXFremFrdG1jc2Vvdnh2dWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjM5MjgsImV4cCI6MjA3NjAzOTkyOH0.TjHfv9lRC5dQbwpGtAI-x_uSOL_FQplGN4KJ7GHI2aI'
  }
});
```

2. Check Supabase Edge Function logs for initialization messages

---

### Issue 5: Authentication Issues

**Symptom:** 401 Unauthorized errors

**Fix:**
- Check that the `publicAnonKey` in `/utils/supabase/info.tsx` is correct
- Verify the key hasn't expired
- Check Supabase Dashboard → Settings → API to confirm the anon key

---

## Manual Fix: Reset Database

If all else fails, reset the patient data:

```javascript
// Warning: This deletes all patient data!
fetch('https://fvyqkzaktmcseovxvukq.supabase.co/functions/v1/make-server-c21253d3/patients', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXFremFrdG1jc2Vvdnh2dWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjM5MjgsImV4cCI6MjA3NjAzOTkyOH0.TjHfv9lRC5dQbwpGtAI-x_uSOL_FQplGN4KJ7GHI2aI'
  }
});

// Then reload the page to re-initialize
```

---

## Check Supabase Logs

1. Go to: https://supabase.com/dashboard/project/fvyqkzaktmcseovxvukq/logs/edge-functions
2. Select the `server` function
3. Look for error messages or warnings
4. Common log messages:
   - ✅ "Sample patient data initialized successfully: 6 patients"
   - ✅ "Patient data already exists: 6 patients"
   - ❌ "Error initializing sample data"
   - ❌ "Error fetching patients"

---

## Still Having Issues?

### Check These:

1. **Network Tab:** Open browser DevTools → Network tab → Try to load the page → Look for failed requests
2. **Console Errors:** Check browser console for JavaScript errors
3. **Supabase Status:** Check https://status.supabase.com for any outages
4. **API Keys:** Verify your Supabase project keys haven't been rotated

---

## What We Fixed

The error handling has been improved in this update:

✅ Backend now tries to auto-initialize data if missing  
✅ Frontend gracefully handles empty patient arrays  
✅ Better error logging with emojis for visibility  
✅ Non-breaking errors (returns empty array instead of crashing)  
✅ Initialization errors are caught and logged  

---

## Emergency Fallback

If the backend is completely down, you can add mock data directly to the frontend temporarily:

In `/components/PatientDashboard.tsx`, add this at the top of `fetchPatients()`:

```typescript
// TEMPORARY FALLBACK - Remove after backend is fixed
const mockPatients = [
  {
    id: 'P001',
    name: 'Margaret Johnson',
    age: 72,
    diagnosis: 'Acute Myocardial Infarction',
    riskScore: 65,
    riskLevel: 'high' as const,
    // ... add other required fields
  }
];
setPatients(mockPatients);
setFilteredPatients(mockPatients);
setLoading(false);
return;
```

---

## Contact Support

If none of these solutions work:
1. Export all error logs from browser console
2. Export Supabase Edge Function logs
3. Note which specific action triggers the error
4. Check if it happens in incognito/private browsing mode

**Most likely cause:** Edge function not deployed or database table missing. Check Supabase Dashboard first!
