# ⚡ Quick Demo Setup

## 🎯 2-Minute Demo Preparation

### Step 1: Enable Demo Mode
Open `/utils/config.ts` and change line 6:

```typescript
useMockData: true,  // ← Make sure this is true
```

### Step 2: Refresh Browser
Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Step 3: Verify
Look for yellow "Demo Mode" badge in top-right of dashboard ✅

**Done! You're ready to demo.**

---

## 🎬 5-Second Feature Showcase

### What Works in Demo Mode?

| Feature | Status | Demo Data |
|---------|--------|-----------|
| Patient Dashboard | ✅ | 8 pre-loaded patients |
| Add New Patient | ✅ | Instant creation |
| Risk Stratification | ✅ | Auto-calculated scores |
| Login Tracking | ✅ | 3 online, 5 offline |
| Search & Filter | ✅ | All filters work |
| EHR Integration | ✅ | Simulated pulls/inserts |
| Patient Details | ✅ | Full patient records |
| Recommendations | ✅ | 5 AI recommendations |

---

## 📊 Pre-loaded Demo Patients

**Use these names in your demo:**

1. **Margaret Johnson** - High risk, missed check-in
2. **James Anderson** - Critical, chest pain alert 🚨
3. **Robert Chen** - Medium risk, 3-day streak
4. **Linda Martinez** - Low risk, 15-day streak ⭐
5. **Patricia Williams** - Low risk, excellent compliance
6. **David Thompson** - Medium risk, recent discharge
7. **Sarah Mitchell** - Medium risk, post-surgery
8. **Michael O'Brien** - High risk, fatigue symptoms

---

## 🎯 Demo Scenarios (Copy-Paste)

### Scenario 1: Show Critical Patient (30 sec)
1. Click "Critical" or "High Risk" filter
2. Click "James Anderson"
3. Point out: "85 risk score, chest pain alert"
4. Show recommendations: "AI recommends urgent follow-up"

### Scenario 2: Add Patient (60 sec)
1. Click "Add New Patient"
2. Fill form:
   - Name: **John Smith**
   - Age: **68**
   - Email: **john.smith@email.com**
   - Phone: **555-1234**
   - Diagnosis: **Congestive Heart Failure**
   - Risk Factors: Diabetes, Hypertension
3. Click Create
4. Copy credentials
5. Point out: "Patient instantly appears in dashboard"

### Scenario 3: EHR Integration (45 sec)
1. Navigate to "Data Intake & EHR"
2. Click "EHR Integration" tab
3. **Pull Data:**
   - Enter: **Margaret Johnson**
   - Click "Pull Patient Data"
   - Show popup with complete medical record
4. **Insert Data:**
   - Enter any name
   - Click "Insert to EHR"
   - Show success toast

---

## 🔄 Toggle Between Modes

### Switch to Real Backend
```typescript
// /utils/config.ts
useMockData: false,
```

### Switch to Demo Mode
```typescript
// /utils/config.ts
useMockData: true,
```

**Always refresh browser after changing config!**

---

## 💡 Pro Tips

✅ **Start fresh:** Refresh page before every demo  
✅ **Know names:** Memorize "James Anderson" (critical patient)  
✅ **Fast demos:** Set `apiDelay: 200` for quicker responses  
✅ **Slow demos:** Set `apiDelay: 800` to show "loading" states  
✅ **Add patients:** Show live creation during demo  
✅ **Filter combo:** Try "High Risk" + search for "Anderson"  

---

## 🐛 Quick Fixes

### "No patients showing"
→ Check `useMockData: true` in `/utils/config.ts`

### "Demo Mode badge not visible"
→ Hard refresh: `Ctrl+Shift+R`

### "New patient not appearing"
→ Data resets on refresh (expected in demo mode)

### "Want persistent data"
→ Switch to `useMockData: false` (requires Supabase)

---

## ✨ Demo Checklist

Before presenting:

- [ ] `useMockData: true` in `/utils/config.ts`
- [ ] Browser refreshed (`Ctrl+Shift+R`)
- [ ] "Demo Mode" badge visible
- [ ] 8 patients showing on dashboard
- [ ] Know which patient to showcase (James Anderson)
- [ ] Prepared to add a patient live
- [ ] EHR demo tab located

**You're ready! Break a leg! 🎭**

---

## 📝 One-Liner Summary

**"Open `/utils/config.ts`, set `useMockData: true`, refresh browser, look for yellow Demo Mode badge. Done!"**

---

## 🎬 Post-Demo

To disable demo mode after presenting:

1. Open `/utils/config.ts`
2. Change `useMockData: true` → `useMockData: false`
3. Refresh browser
4. App connects to Supabase backend

---

**Questions?** Check `/DEMO_MODE_GUIDE.md` for comprehensive documentation.
