import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

// Mock Data
const mockData = {
  campaigns: [
    {
      id: "1234567890",
      name: "Campanha Premium 2025",
      type: "SEARCH",
      status: "ACTIVE",
      budget: 5000.00,
      clicks: 1200,
      impressions: 25000,
      conversions: 80,
      ctr: 4.8,
      cpc: 4.17,
      costPerConversion: 62.50
    },
    {
      id: "1234567891",
      name: "Display Brand Awareness",
      type: "DISPLAY",
      status: "ACTIVE",
      budget: 3000.00,
      clicks: 800,
      impressions: 50000,
      conversions: 45,
      ctr: 1.6,
      cpc: 3.75,
      costPerConversion: 66.67
    },
    {
      id: "1234567892", 
      name: "Shopping Black Friday",
      type: "SHOPPING",
      status: "PAUSED",
      budget: 8000.00,
      clicks: 2100,
      impressions: 35000,
      conversions: 160,
      ctr: 6.0,
      cpc: 3.81,
      costPerConversion: 50.00
    },
    {
      id: "1234567893",
      name: "Video YouTube Campaign",
      type: "VIDEO",
      status: "ACTIVE", 
      budget: 4500.00,
      clicks: 1850,
      impressions: 120000,
      conversions: 92,
      ctr: 1.54,
      cpc: 2.43,
      costPerConversion: 48.91
    }
  ],
  ads: [
    {
      id: "ad1",
      campaignId: "1234567890",
      headline: "Oferta Exclusiva Premium!",
      description: "Aproveite descontos incríveis agora mesmo. Produtos de alta qualidade com entrega rápida.",
      url: "https://example.com/premium",
      type: "RESPONSIVE_SEARCH",
      status: "ACTIVE"
    },
    {
      id: "ad2", 
      campaignId: "1234567891",
      headline: "Descubra Nossa Marca",
      description: "Conheça nossa história e valores. Qualidade que você pode confiar.",
      url: "https://example.com/brand",
      type: "DISPLAY",
      status: "ACTIVE"
    },
    {
      id: "ad3",
      campaignId: "1234567892",
      headline: "Black Friday Imperdível",
      description: "Até 70% de desconto em produtos selecionados. Estoque limitado!",
      url: "https://example.com/blackfriday",
      type: "SHOPPING",
      status: "PAUSED"
    }
  ],
  metrics: {
    totalClicks: 5950,
    totalImpressions: 230000,
    totalConversions: 377,
    totalCost: 18250.00,
    avgCtr: 2.59,
    avgCpc: 3.07,
    avgCostPerConversion: 48.41
  },
  notifications: [
    {
      id: "notif1",
      message: "Campanha Premium atingiu 80% do orçamento diário",
      type: "WARNING",
      date: "2025-01-08",
      time: "14:30"
    },
    {
      id: "notif2",
      message: "Nova conversão registrada na campanha Shopping",
      type: "SUCCESS", 
      date: "2025-01-08",
      time: "13:45"
    },
    {
      id: "notif3",
      message: "Campanha Display com baixo CTR - revisar criativos",
      type: "INFO",
      date: "2025-01-08", 
      time: "12:20"
    }
  ],
  user: {
    name: "Ana Silva",
    email: "ana.silva@google.com",
    avatar: "AS",
    role: "Google Ads Specialist",
    department: "Marketing Digital"
  }
};

// Mock API Functions
const api = {
  async getCampaigns() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockData.campaigns;
  },
  
  async getAds() {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return mockData.ads;
  },
  
  async getMetrics() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockData.metrics;
  },
  
  async getNotifications() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockData.notifications;
  },
  
  async createCampaign(campaign: any) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newCampaign = {
      ...campaign,
      id: Date.now().toString(),
      status: "ACTIVE"
    };
    mockData.campaigns.push(newCampaign);
    return newCampaign;
  },
  
  async updateCampaign(id: string, updates: any) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const index = mockData.campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      mockData.campaigns[index] = { ...mockData.campaigns[index], ...updates };
      return mockData.campaigns[index];
    }
    throw new Error('Campaign not found');
  },
  
  async deleteCampaign(id: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockData.campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      mockData.campaigns.splice(index, 1);
      return true;
    }
    throw new Error('Campaign not found');
  }
};

// Theme Context
const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// Theme Provider
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-spin border-t-accent/40" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
  </div>
);

// Skeleton Components
const SkeletonCard: React.FC = () => (
  <div className="card-premium p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="skeleton w-12 h-12 rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="skeleton-text w-3/4"></div>
        <div className="skeleton-text w-1/2"></div>
      </div>
    </div>
  </div>
);

const SkeletonTable: React.FC = () => (
  <div className="card-premium p-6 animate-pulse">
    <div className="skeleton-text w-1/4 mb-4"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="skeleton-text w-1/4"></div>
          <div className="skeleton-text w-1/4"></div>
          <div className="skeleton-text w-1/4"></div>
          <div className="skeleton-text w-1/4"></div>
        </div>
      ))}
    </div>
  </div>
);

// Notification Component
const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.getNotifications().then(data => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'WARNING': return '⚠️';
      case 'SUCCESS': return '✅';
      case 'INFO': return 'ℹ️';
      default: return '📢';
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'WARNING': return 'border-warning/20 bg-warning/5';
      case 'SUCCESS': return 'border-accent/20 bg-accent/5';
      case 'INFO': return 'border-primary/20 bg-primary/5';
      default: return 'border-border bg-background';
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors duration-200"
      >
        <span className="material-icons-outlined text-xl">notifications</span>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 glass-strong rounded-xl shadow-premium z-50 animate-scale-in">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-foreground">Notificações</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4">
                <LoadingSpinner />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <span className="material-icons-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${getNotificationColor(notif.type)}`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.date} às {notif.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// User Avatar Component
const UserAvatar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted/50 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {mockData.user.avatar}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-foreground">{mockData.user.name}</p>
          <p className="text-xs text-muted-foreground">{mockData.user.role}</p>
        </div>
        <span className="material-icons-outlined text-sm">expand_more</span>
      </button>
      
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 glass-strong rounded-xl shadow-premium z-50 animate-scale-in">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {mockData.user.avatar}
              </div>
              <div>
                <p className="font-semibold text-foreground">{mockData.user.name}</p>
                <p className="text-sm text-muted-foreground">{mockData.user.email}</p>
                <p className="text-xs text-muted-foreground">{mockData.user.department}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center space-x-2">
              <span className="material-icons-outlined text-lg">person</span>
              <span>Meu Perfil</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center space-x-2">
              <span className="material-icons-outlined text-lg">settings</span>
              <span>Configurações</span>
            </button>
            <hr className="border-white/10 my-2" />
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors flex items-center space-x-2">
              <span className="material-icons-outlined text-lg">logout</span>
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Login Page Component
const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo ao Google Ads Dashboard Premium",
    });
    onLogin();
  };
  
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-strong p-8 rounded-3xl animate-scale-in">
          {/* Google Ads Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-card">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Google Ads</h1>
            <p className="text-white/80">Dashboard Premium</p>
          </div>
          
          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">E-mail corporativo</label>
              <input
                type="email"
                className="input-premium text-foreground"
                placeholder="nome@google.com"
                defaultValue="ana.silva@google.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Senha</label>
              <input
                type="password"
                className="input-premium text-foreground"
                placeholder="••••••••"
                defaultValue="password123"
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-premium w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                  <span>Autenticando...</span>
                </div>
              ) : (
                <>
                  <span className="material-icons-outlined mr-2">login</span>
                  Entrar com Google
                </>
              )}
            </button>
            
            <div className="text-center">
              <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                Esqueceu a senha?
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6 text-white/60 text-sm">
          © 2025 Google LLC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

// Main App Component
const GoogleAdsApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }
  
  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'campaigns', label: 'Campanhas', icon: 'campaign' },
    { id: 'ads', label: 'Anúncios', icon: 'ads_click' },
    { id: 'reports', label: 'Relatórios', icon: 'analytics' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
    { id: 'profile', label: 'Perfil', icon: 'person' },
  ];
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground">Google Ads</h2>
              <p className="text-xs text-muted-foreground">Dashboard Premium</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-item w-full ${currentPage === item.id ? 'active' : ''}`}
                >
                  <span className="material-icons-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground capitalize">
                {navigationItems.find(item => item.id === currentPage)?.label}
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-muted/50 transition-colors duration-200"
                title="Alternar tema"
              >
                <span className="material-icons-outlined text-xl">
                  {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
              </button>
              
              <NotificationBell />
              <UserAvatar />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'campaigns' && <CampaignsPage />}
          {currentPage === 'ads' && <AdsPage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'profile' && <ProfilePage />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Page Component
const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Promise.all([
      api.getMetrics(),
      api.getCampaigns()
    ]).then(([metricsData, campaignsData]) => {
      setMetrics(metricsData);
      setCampaigns(campaignsData.slice(0, 5));
      setLoading(false);
    });
  }, []);
  
  const metricCards = [
    { 
      title: 'Total de Cliques', 
      value: metrics?.totalClicks || 0, 
      icon: 'mouse', 
      color: 'text-google-blue',
      format: (val: number) => val.toLocaleString('pt-BR')
    },
    { 
      title: 'Impressões', 
      value: metrics?.totalImpressions || 0, 
      icon: 'visibility', 
      color: 'text-google-green',
      format: (val: number) => val.toLocaleString('pt-BR')
    },
    { 
      title: 'Conversões', 
      value: metrics?.totalConversions || 0, 
      icon: 'trending_up', 
      color: 'text-google-yellow',
      format: (val: number) => val.toString()
    },
    { 
      title: 'Custo Total', 
      value: metrics?.totalCost || 0, 
      icon: 'payments', 
      color: 'text-google-red',
      format: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge-success">Ativo</span>;
      case 'PAUSED':
        return <span className="badge-warning">Pausado</span>;
      default:
        return <span className="badge-error">Inativo</span>;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <div key={metric.title} className="metric-card" style={{ animationDelay: `${index * 0.1}s` }}>
            {loading ? (
              <SkeletonCard />
            ) : (
              <>
                <div className={`metric-icon ${metric.color}`}>
                  <span className="material-icons-outlined">{metric.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {metric.format(metric.value)}
                </h3>
                <p className="text-muted-foreground text-sm">{metric.title}</p>
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-floating p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
            <span className="material-icons-outlined text-primary">bolt</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-premium">
              <span className="material-icons-outlined">add</span>
              Nova Campanha
            </button>
            <button className="btn-glass">
              <span className="material-icons-outlined">analytics</span>
              Ver Relatórios
            </button>
            <button className="btn-glass">
              <span className="material-icons-outlined">tune</span>
              Otimizar
            </button>
            <button className="btn-glass">
              <span className="material-icons-outlined">download</span>
              Exportar Dados
            </button>
          </div>
        </div>
        
        <div className="card-floating p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Insights Premium</h3>
            <span className="material-icons-outlined text-accent">lightbulb</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-foreground">
                📈 Campanha "Premium 2025" tem potencial para 20% mais conversões
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-foreground">
                ⚡ Aumente o orçamento da campanha Shopping em 15% para maximizar ROI
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-foreground">
                🎯 Segmente idade 25-34 anos para melhor performance
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Campaigns */}
      <div className="card-floating">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Campanhas Recentes</h3>
            <button className="text-primary hover:text-primary-hover transition-colors">
              Ver todas
            </button>
          </div>
        </div>
        
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Nome da Campanha</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Orçamento</th>
                  <th>Cliques</th>
                  <th>CTR</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id}>
                    <td>
                      <div className="font-medium text-foreground">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {campaign.id}</div>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-muted/50 rounded-lg text-xs font-medium">
                        {campaign.type}
                      </span>
                    </td>
                    <td>{getStatusBadge(campaign.status)}</td>
                    <td className="font-medium">
                      R$ {campaign.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td>{campaign.clicks.toLocaleString('pt-BR')}</td>
                    <td>{campaign.ctr}%</td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-muted/50 rounded transition-colors">
                          <span className="material-icons-outlined text-sm">edit</span>
                        </button>
                        <button className="p-1 hover:bg-muted/50 rounded transition-colors">
                          <span className="material-icons-outlined text-sm">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder pages (will be implemented similarly)
const CampaignsPage: React.FC = () => (
  <div className="animate-fade-in">
    <div className="card-floating p-8 text-center">
      <span className="material-icons-outlined text-6xl text-primary mb-4">campaign</span>
      <h2 className="text-2xl font-bold text-foreground mb-2">Gerenciamento de Campanhas</h2>
      <p className="text-muted-foreground">Página em desenvolvimento - Funcionalidade completa em breve</p>
    </div>
  </div>
);

const AdsPage: React.FC = () => (
  <div className="animate-fade-in">
    <div className="card-floating p-8 text-center">
      <span className="material-icons-outlined text-6xl text-accent mb-4">ads_click</span>
      <h2 className="text-2xl font-bold text-foreground mb-2">Criação e Edição de Anúncios</h2>
      <p className="text-muted-foreground">Página em desenvolvimento - Funcionalidade completa em breve</p>
    </div>
  </div>
);

const ReportsPage: React.FC = () => (
  <div className="animate-fade-in">
    <div className="card-floating p-8 text-center">
      <span className="material-icons-outlined text-6xl text-google-green mb-4">analytics</span>
      <h2 className="text-2xl font-bold text-foreground mb-2">Relatórios e Analytics</h2>
      <p className="text-muted-foreground">Página em desenvolvimento - Funcionalidade completa em breve</p>
    </div>
  </div>
);

const SettingsPage: React.FC = () => (
  <div className="animate-fade-in">
    <div className="card-floating p-8 text-center">
      <span className="material-icons-outlined text-6xl text-google-yellow mb-4">settings</span>
      <h2 className="text-2xl font-bold text-foreground mb-2">Configurações do Sistema</h2>
      <p className="text-muted-foreground">Página em desenvolvimento - Funcionalidade completa em breve</p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => (
  <div className="animate-fade-in">
    <div className="card-floating p-8 text-center">
      <span className="material-icons-outlined text-6xl text-google-red mb-4">person</span>
      <h2 className="text-2xl font-bold text-foreground mb-2">Perfil do Usuário</h2>
      <p className="text-muted-foreground">Página em desenvolvimento - Funcionalidade completa em breve</p>
    </div>
  </div>
);

// Main App with Theme Provider
const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <GoogleAdsApp />
      <Toaster />
    </ThemeProvider>
  );
};

export default Index;