// Configuration for CardioGuard
// Toggle between mock data (demo mode) and real Supabase backend

export const config = {
  // Set to true to use mock data (no Supabase required)
  // Set to false to use real Supabase backend
  useMockData: true,
  
  // API configuration
  apiDelay: 500, // Simulate network delay in ms (for mock mode)
  
  // Feature flags
  features: {
    enableRealTimeUpdates: false, // Requires Supabase
    enableEHRIntegration: true,   // Works in both modes (simulated)
    enableSMSNotifications: true, // Works in both modes (simulated)
    enableAnalytics: true,
  },
  
  // Demo settings
  demo: {
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    showDebugInfo: false,
  }
};

// Helper to check if we're in mock mode
export const isMockMode = () => config.useMockData;

// Helper to simulate API delay
export const simulateDelay = () => 
  new Promise(resolve => setTimeout(resolve, config.apiDelay));
