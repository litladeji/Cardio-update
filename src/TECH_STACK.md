# 🛠️ CardioGuard Tech Stack

## Complete Technology Stack Overview

---

## 🎨 Frontend

### Core Framework
- **React 18+** - UI library for building component-based interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server (implied by project setup)

### Styling & UI
- **Tailwind CSS v4.0** - Utility-first CSS framework
- **shadcn/ui** - High-quality, customizable React components built on Radix UI
  - 40+ pre-built components (Button, Card, Dialog, Input, etc.)
  - Located in `/components/ui/`
  - Fully accessible (WCAG compliant)
- **Custom CSS Tokens** - Design system variables in `styles/globals.css`

### Icons & Graphics
- **Lucide React** - Beautiful, consistent icon library
  - 1000+ icons
  - Used throughout: Heart, Activity, Users, Database, etc.

### State Management
- **React Hooks** - Built-in state management
  - `useState` for local state
  - `useEffect` for side effects
  - No external state library (Redux, Zustand) needed for current scale

---

## 🗄️ Backend

### Database & Backend Service
- **Supabase** - Open-source Firebase alternative
  - PostgreSQL database (relational)
  - Real-time subscriptions
  - Row Level Security (RLS)
  - RESTful API auto-generated

### Serverless Functions
- **Supabase Edge Functions** - Deno-based serverless functions
  - Located in `/supabase/functions/server/`
  - API endpoints at `/make-server-c21253d3/`
  - Runtime: Deno (TypeScript native)

### Data Storage
- **Supabase KV Store** - Key-value storage for caching
  - Used for patient data, metrics, activity logs
  - File: `/supabase/functions/server/kv_store.tsx`

### Authentication
- **Supabase Auth** - Built-in authentication system
  - Email/password authentication
  - Role-based access control (RBAC)
  - Three roles: Patient, Clinician, Administrator

---

## 📊 Data Visualization

### Charts & Graphs
- **Recharts** - Composable charting library built on D3
  - Line charts for vital trends
  - Sparklines for mini-charts
  - Bar charts for analytics
  - Custom circular progress gauges

### Custom Components
- **CircularProgress.tsx** - Custom SVG-based circular progress gauge
- **Sparkline.tsx** - Lightweight trend visualization

---

## 🔔 Notifications & Feedback

### Toast Notifications
- **Sonner** - Beautiful toast notification library
  - Success, error, info toasts
  - Customizable position and duration
  - Import: `import { toast } from 'sonner@2.0.3'`

### Alerts
- **shadcn Alert Components** - In-page alert messages
  - Info alerts (blue)
  - Success alerts (green)
  - Warning alerts (yellow)
  - Error alerts (red)

---

## 🌐 API & Integration

### API Architecture
- **RESTful API** - Standard HTTP methods
  - GET: Fetch data
  - POST: Create/update data
  - Endpoints follow pattern: `/make-server-c21253d3/{resource}`

### External Integrations (Demo/Mock)
- **Epic FHIR R4** - Electronic Health Record integration (simulated)
- **Cerner FHIR R4** - Alternative EHR system (simulated)
- **Twilio SMS** - SMS notification service (simulated)

### Data Formats
- **JSON** - Primary data exchange format
- **FHIR R4** - HL7 Fast Healthcare Interoperability Resources standard
  - Patient resources
  - Observation resources (vitals)
  - Condition resources (diagnosis)

---

## 🎯 Form Management

### Form Components
- **React Hook Form** - Performance-focused form library
  - Version: `react-hook-form@7.55.0`
  - Form validation
  - Error handling
  - Used in onboarding and patient forms

### Input Components
- **shadcn Form Components**:
  - Input (text, email, password)
  - Textarea (multi-line text)
  - Select (dropdowns)
  - Checkbox (boolean inputs)
  - Radio Group (single selection)
  - Calendar (date picker)

---

## 🎨 Animation & Motion

### Animation Library
- **Motion (Framer Motion)** - Production-ready motion library
  - Import: `import { motion } from 'motion/react'`
  - Smooth page transitions
  - Component animations
  - Gesture support

### CSS Animations
- **Tailwind Animations** - Built-in animation utilities
  - `animate-spin` - Loading spinners
  - `animate-pulse` - Pulsing effects
  - `animate-in` - Fade/slide in animations

---

## 🔐 Security & Access Control

### Authentication Flow
- **Role-Based Access Control (RBAC)** - Three distinct user roles
  1. **Patient** - Personal health portal
  2. **Clinician** - Patient management dashboard
  3. **Administrator** - System analytics and management

### Data Security
- **Supabase Row Level Security (RLS)** - Database-level security
- **Bearer Token Authentication** - API authorization
- **Environment Variables** - Secure configuration management

---

## 📱 Responsive Design

### Mobile-First Approach
- **Tailwind Responsive Classes** - Breakpoint-based styling
  - `sm:` - Small devices (640px+)
  - `md:` - Medium devices (768px+)
  - `lg:` - Large devices (1024px+)
  - `xl:` - Extra large devices (1280px+)

### Layout System
- **CSS Grid** - 2D layout system
- **Flexbox** - 1D layout system
- **Container Queries** - Component-level responsive design

---

## 🧪 Development Tools

### Type Safety
- **TypeScript** - Static type checking
  - Interfaces for data models
  - Type inference
  - IntelliSense support

### Code Quality
- **ESLint** - Code linting (implied)
- **Prettier** - Code formatting (implied)

### Build & Deploy
- **Vite** - Lightning-fast build tool
- **Supabase CLI** - Deploy edge functions
- **Hot Module Replacement (HMR)** - Instant updates during development

---

## 📦 Key Dependencies

### Core Libraries
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^4.0",
  "lucide-react": "latest",
  "recharts": "latest",
  "sonner": "^2.0.3",
  "react-hook-form": "7.55.0",
  "motion": "latest"
}
```

### UI Component Libraries
```json
{
  "@radix-ui/react-*": "latest (multiple packages for shadcn/ui)",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

### Backend (Supabase)
```json
{
  "@supabase/supabase-js": "latest",
  "hono": "latest (for edge function routing)"
}
```

---

## 🏗️ Architecture Pattern

### Component Architecture
- **Atomic Design** - Organized component hierarchy
  - **Atoms**: UI primitives (Button, Input, Badge)
  - **Molecules**: Simple combinations (FormField, AlertBox)
  - **Organisms**: Complex components (PatientDashboard, DataIntakeDashboard)
  - **Pages**: Full-page views (PatientPortal, ClinicianDashboard)

### File Structure
```
/components/
  ├── ui/              # shadcn/ui components (atoms)
  ├── patient/         # Patient-specific features (organisms)
  ├── figma/           # Figma-exported components
  └── *.tsx            # Shared/main components (organisms)

/supabase/functions/
  └── server/          # Backend API endpoints

/utils/
  └── supabase/        # Supabase configuration

/styles/
  └── globals.css      # Global styles & design tokens
```

### Data Flow
```
User Interaction
    ↓
React Component (Frontend)
    ↓
API Call (fetch)
    ↓
Supabase Edge Function (Backend)
    ↓
Supabase Database / KV Store
    ↓
Response (JSON)
    ↓
React State Update
    ↓
UI Re-render
```

---

## 🎯 AI & Intelligence (Mock Implementation)

### Risk Assessment Engine
- **Custom Algorithm** - TypeScript-based risk calculation
  - Factors: Days since discharge, age, conditions, vitals
  - Output: Risk score 0-100
  - Classification: Low (green), Medium (yellow), High (red)

### Symptom Analysis
- **Mock AI Classification** - Simulated machine learning
  - Input: Patient symptom responses
  - Output: Alert level (green/yellow/red)
  - Recommendation generation

---

## 🔄 Real-Time Features

### Live Updates
- **Supabase Realtime** - WebSocket-based updates
  - Patient status changes
  - Risk score recalculation
  - Dashboard metric updates

### Polling
- **Manual Refresh** - User-triggered data fetching
- **Auto-refresh** - Periodic data updates

---

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting** - Lazy loading of routes
- **Memoization** - React.memo for expensive components
- **Debouncing** - Input field optimizations

### Backend Optimizations
- **Caching** - KV store for frequently accessed data
- **Query Optimization** - Efficient database queries
- **Edge Computing** - Low-latency serverless functions

---

## 🌍 Browser Support

### Modern Browsers
- Chrome/Edge (Chromium) - Latest 2 versions
- Firefox - Latest 2 versions
- Safari - Latest 2 versions
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 Deployment

### Frontend Hosting
- **Vercel / Netlify / Cloudflare Pages** (recommended)
- Static site generation
- Automatic deployments from Git

### Backend Hosting
- **Supabase Cloud** - Managed backend service
- Edge functions deployed globally
- PostgreSQL database hosted on AWS

---

## 📝 Summary

**CardioGuard** is a modern, production-ready web application built with:

✅ **React + TypeScript** for type-safe frontend development  
✅ **Tailwind CSS + shadcn/ui** for beautiful, accessible UI  
✅ **Supabase** for backend, database, and authentication  
✅ **Recharts** for data visualization  
✅ **Motion** for smooth animations  
✅ **FHIR R4** compatibility for healthcare integration  
✅ **Mobile-responsive** design  
✅ **Role-based access control** for security  

**Total Tech Stack Simplicity**: ~10 major dependencies, minimal complexity, maximum functionality! 🎯
