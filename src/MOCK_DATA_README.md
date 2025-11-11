# 🎯 Mock Data System - Quick Reference

## What is This?

CardioGuard now has a **complete mock data system** that lets you run the entire application without a Supabase backend. Perfect for demos, development, and testing!

---

## ⚡ 10-Second Setup

**File:** `/utils/config.ts`  
**Line 7:** `useMockData: true`  
**Action:** Refresh browser  
**Result:** ✅ Demo mode active!

---

## 📁 Files Overview

| File | Purpose | When to Use |
|------|---------|-------------|
| `/utils/mockData.ts` | Mock patient data (8 patients) | Customize demo data |
| `/utils/config.ts` | Toggle demo/real mode | Switch modes |
| `DEMO_READY_SUMMARY.md` | ⭐ **START HERE** | Before demos |
| `QUICK_DEMO_SETUP.md` | Fast setup guide | Quick reference |
| `DEMO_MODE_GUIDE.md` | Complete documentation | Deep dive |
| `MOCK_DATA_IMPLEMENTATION.md` | Technical details | Developers |

---

## 🎯 Which Doc Should I Read?

### Going to Demo in 5 Minutes?
→ **[DEMO_READY_SUMMARY.md](./DEMO_READY_SUMMARY.md)**

### Need Quick Setup Steps?
→ **[QUICK_DEMO_SETUP.md](./QUICK_DEMO_SETUP.md)**

### Want Complete Information?
→ **[DEMO_MODE_GUIDE.md](./DEMO_MODE_GUIDE.md)**

### Developing/Customizing?
→ **[MOCK_DATA_IMPLEMENTATION.md](./MOCK_DATA_IMPLEMENTATION.md)**

### Demoing EHR Features?
→ **[EHR_DEMO_GUIDE.md](./EHR_DEMO_GUIDE.md)**

---

## 🚀 Quick Commands

### Enable Demo Mode
```typescript
// /utils/config.ts
useMockData: true
```

### Enable Real Backend
```typescript
// /utils/config.ts
useMockData: false
```

### Add Mock Patient
```typescript
// /utils/mockData.ts
export const mockPatients: Patient[] = [
  // Existing patients...
  { id: 'P009', name: 'New Patient', ... }
];
```

---

## 📊 What's Included

- ✅ 8 pre-loaded patients (varied risk levels)
- ✅ 5 AI recommendations
- ✅ 8 login status records
- ✅ Complete patient profiles with vitals
- ✅ Add new patients (live during demo)
- ✅ All search & filter features
- ✅ EHR integration (simulated)
- ✅ Professional "Demo Mode" badge

---

## 🎬 3-Minute Demo Flow

1. **Overview** (20s) - Show dashboard with 8 patients
2. **Critical Patient** (40s) - Click James Anderson
3. **Add Patient** (60s) - Create Jane Doe live
4. **EHR Integration** (40s) - Pull Margaret Johnson's data
5. **Close** (20s) - Summarize value proposition

---

## 🎯 Key Demo Patients

- **James Anderson** - Critical (use for alerts demo)
- **Margaret Johnson** - High risk (use for EHR demo)
- **Linda Martinez** - Low risk (use for success story)

---

## ✅ Pre-Demo Checklist

- [ ] `useMockData: true` ✅ (Already set!)
- [ ] Browser refreshed
- [ ] "Demo Mode" badge visible
- [ ] 8 patients showing
- [ ] Practiced demo flow

---

## 🔄 Mode Comparison

| Feature | Mock Mode | Real Backend |
|---------|-----------|--------------|
| Setup Time | 0 min | 30+ min |
| Internet Required | No | Yes |
| Data Persistence | Session only | Permanent |
| Patient Count | 8 (default) | Unlimited |
| Best For | Demos, dev | Production |

---

## 💡 Pro Tips

1. **Always demo in mock mode** (faster, reliable)
2. **Practice once before presenting**
3. **Use James Anderson for critical demo**
4. **Add a patient live to show ease**
5. **Mention AI and FHIR integration**

---

## 🐛 Common Issues

**No patients?** → Check `useMockData: true`  
**No badge?** → Hard refresh browser  
**Patient disappeared?** → Expected (demo mode doesn't persist)  
**Need persistence?** → Use `useMockData: false`

---

## 🎉 You're All Set!

Everything is configured and ready:
- Mock data loaded ✅
- Demo mode enabled ✅
- Documentation complete ✅
- Professional appearance ✅

**Just run the app and start demoing!**

---

## 📚 Full Documentation Index

1. **DEMO_READY_SUMMARY.md** - Complete demo guide ⭐
2. **QUICK_DEMO_SETUP.md** - 2-minute setup
3. **DEMO_MODE_GUIDE.md** - Comprehensive documentation
4. **MOCK_DATA_IMPLEMENTATION.md** - Technical details
5. **EHR_DEMO_GUIDE.md** - EHR feature demo
6. **MOCK_DATA_README.md** - This file

---

**Ready to impress? Let's go! 🚀**
