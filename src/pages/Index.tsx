import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

// Sistema de Webhooks - Despachante Marcelino
const WebhookSystem = {
  // Configuração de Webhooks
  webhookConfig: {
    url: "https://despachantemarcelino.vercel.app/webhook",
    secret: "marcelino_webhook_secret_2025",
    events: ["message", "lead", "conversion", "payment"],
    rateLimit: 10000, // Aumentado para 10.000 requests/min
    timeout: 30000
  },

  // Dados de Mensagens em Tempo Real
  messages: [
    {
      id: "msg_001",
      client: "João Silva",
      phone: "+55 48 99999-1234",
      message: "Olá! Preciso renovar o licenciamento do meu carro. Quanto custa?",
      timestamp: "2025-06-30T16:45:00Z",
      status: "new",
      tags: ["licenciamento", "florianópolis", "urgente"],
      source: "whatsapp",
      priority: "high"
    },
    {
      id: "msg_002",
      client: "Maria Santos",
      phone: "+55 48 99999-5678",
      message: "Boa tarde! Quero transferir meu veículo. Vocês fazem isso?",
      timestamp: "2025-06-30T16:42:00Z",
      status: "in_progress",
      tags: ["transferência", "são josé", "consulta"],
      source: "instagram",
      priority: "medium"
    },
    {
      id: "msg_003",
      client: "Pedro Costa",
      phone: "+55 48 99999-9012",
      message: "Oi! Preciso de um despachante para resolver multas. Podem ajudar?",
      timestamp: "2025-06-30T16:40:00Z",
      status: "resolved",
      tags: ["multas", "palhoça", "despachante"],
      source: "facebook",
      priority: "low"
    },
    {
      id: "msg_004",
      client: "Ana Oliveira",
      phone: "+55 48 99999-3456",
      message: "Bom dia! Quanto tempo demora para renovar o licenciamento?",
      timestamp: "2025-06-30T16:38:00Z",
      status: "new",
      tags: ["licenciamento", "florianópolis", "prazo"],
      source: "whatsapp",
      priority: "high"
    },
    {
      id: "msg_005",
      client: "Carlos Mendes",
      phone: "+55 48 99999-7890",
      message: "Olá! Vocês atendem em Palhoça? Preciso de documentação veicular.",
      timestamp: "2025-06-30T16:35:00Z",
      status: "in_progress",
      tags: ["documentação", "palhoça", "atendimento"],
      source: "telefone",
      priority: "medium"
    }
  ],

  // Estatísticas de Webhooks
  webhookStats: {
    totalRequests: 15420,
    successfulRequests: 15380,
    failedRequests: 40,
    averageResponseTime: 245,
    lastWebhookTime: "2025-06-30T16:45:30Z",
    activeConnections: 8,
    messagesPerMinute: 12
  },

  // Configurações de Chat
  chatConfig: {
    autoReply: true,
    workingHours: "08:00-18:00",
    responseTime: "2 minutos",
    languages: ["pt-BR", "en"],
    integrations: ["whatsapp", "instagram", "facebook", "telefone"]
  }
};

// Componente de Chat em Tempo Real
const LiveChat: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return '💬';
      case 'instagram': return '📷';
      case 'facebook': return '📘';
      case 'telefone': return '📞';
      default: return '💬';
    }
  };

  const filteredMessages = WebhookSystem.messages.filter(msg => {
    const statusMatch = filterStatus === 'all' || msg.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || msg.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleReply = () => {
    if (replyText.trim() && selectedMessage) {
      toast({
        title: "Resposta enviada!",
        description: `Resposta enviada para ${selectedMessage.client}`,
      });
      setReplyText('');
      setSelectedMessage(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Chat */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Chat em Tempo Real</h2>
          <p className="text-muted-foreground">Gerencie mensagens dos clientes</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Online</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {WebhookSystem.webhookStats.messagesPerMinute} msg/min
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-floating p-4">
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-premium"
          >
            <option value="all">Todos os Status</option>
            <option value="new">Novas</option>
            <option value="in_progress">Em Andamento</option>
            <option value="resolved">Resolvidas</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-premium"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Mensagens */}
        <div className="lg:col-span-1">
          <div className="card-floating">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Mensagens ({filteredMessages.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-primary/10 border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSourceIcon(message.source)}</span>
                      <div>
                        <h4 className="font-medium text-foreground">{message.client}</h4>
                        <p className="text-sm text-muted-foreground">{message.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2 line-clamp-2">{message.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {message.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Individual */}
        <div className="lg:col-span-2">
          <div className="card-floating h-96 flex flex-col">
            {selectedMessage ? (
              <>
                {/* Header do Chat */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getSourceIcon(selectedMessage.source)}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{selectedMessage.client}</h3>
                        <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm">{selectedMessage.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(selectedMessage.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm">Olá! Como posso ajudá-lo hoje?</p>
                      <p className="text-xs text-muted-foreground mt-1">Agora</p>
                    </div>
                  </div>
                </div>

                {/* Input de Resposta */}
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Digite sua resposta..."
                      className="flex-1 input-premium"
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="btn-premium disabled:opacity-50"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-icons-outlined text-4xl text-muted-foreground mb-4">chat</span>
                  <p className="text-muted-foreground">Selecione uma mensagem para começar o chat</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Estatísticas de Webhooks
const WebhookStats: React.FC = () => {
  const stats = WebhookSystem.webhookStats;
  const [isConnected, setIsConnected] = useState(true);
  const [lastActivity, setLastActivity] = useState(new Date());
  
  // Simular conexão em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setLastActivity(new Date());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Estatísticas de Webhooks</h2>
          <p className="text-muted-foreground">Monitoramento em tempo real dos webhooks</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Última atividade: {lastActivity.toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">webhook</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{stats.totalRequests.toLocaleString('pt-BR')}</h3>
          <p className="text-muted-foreground text-sm">Total de Requests</p>
          <div className="flex items-center justify-center mt-2 text-green-600 text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_upward</span>
            +12.5% vs maio 2025
          </div>
        </div>

        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">check_circle</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{stats.successfulRequests.toLocaleString('pt-BR')}</h3>
          <p className="text-muted-foreground text-sm">Requests Bem-sucedidos</p>
          <div className="flex items-center justify-center mt-2 text-green-600 text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_upward</span>
            99.7% de sucesso
          </div>
        </div>

        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">error</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{stats.failedRequests}</h3>
          <p className="text-muted-foreground text-sm">Requests Falharam</p>
          <div className="flex items-center justify-center mt-2 text-red-600 text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_downward</span>
            0.3% de falha
          </div>
        </div>

        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">speed</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{stats.averageResponseTime}ms</h3>
          <p className="text-muted-foreground text-sm">Tempo de Resposta</p>
          <div className="flex items-center justify-center mt-2 text-green-600 text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_upward</span>
            -15% vs maio 2025
          </div>
        </div>
      </div>

      {/* Configurações de Webhook */}
      <div className="card-floating p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Configurações de Webhook</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">URL do Webhook</label>
            <input
              type="text"
              value={WebhookSystem.webhookConfig.url}
              readOnly
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Secret Key</label>
            <input
              type="password"
              value={WebhookSystem.webhookConfig.secret}
              readOnly
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rate Limit</label>
            <input
              type="text"
              value={`${WebhookSystem.webhookConfig.rateLimit} requests/min`}
              readOnly
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timeout</label>
            <input
              type="text"
              value={`${WebhookSystem.webhookConfig.timeout}ms`}
              readOnly
              className="input-premium"
            />
          </div>
        </div>
      </div>

      {/* Logs de Webhook em Tempo Real */}
      <div className="card-floating p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Logs de Webhook</h3>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
          <div className="space-y-1">
            <div>[2025-06-30 16:45:30] ✅ Webhook recebido: message</div>
            <div>[2025-06-30 16:45:28] ✅ Webhook recebido: lead</div>
            <div>[2025-06-30 16:45:25] ✅ Webhook recebido: conversion</div>
            <div>[2025-06-30 16:45:22] ✅ Webhook recebido: message</div>
            <div>[2025-06-30 16:45:20] ✅ Webhook recebido: payment</div>
            <div>[2025-06-30 16:45:18] ✅ Webhook recebido: message</div>
            <div>[2025-06-30 16:45:15] ✅ Webhook recebido: lead</div>
            <div>[2025-06-30 16:45:12] ✅ Webhook recebido: conversion</div>
            <div className="text-yellow-400">[2025-06-30 16:45:10] ⚠️ Tentativa de reconexão...</div>
            <div className="text-green-400">[2025-06-30 16:45:08] ✅ Conexão restabelecida</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dados Reais do Dashboard - Despachante Marcelino
const mockData = {
  campaigns: [
    {
      id: "CAMP_001",
      name: "[LEAD] [SEARCH] [LP AUTOFÁCIL] Florianópolis - 05/11/25",
      type: "SEARCH",
      status: "ACTIVE",
      budget: 8000.00,
      clicks: 320,
      impressions: 8500,
      conversions: 85,
      ctr: 3.76,
      cpc: 8.50,
      costPerConversion: 2720.00
    },
    {
      id: "CAMP_002",
      name: "[LEAD] [SEARCH] [LP AUTOFÁCIL] São José - 02/10/25",
      type: "SEARCH",
      status: "ACTIVE",
      budget: 6000.00,
      clicks: 280,
      impressions: 7200,
      conversions: 65,
      ctr: 3.89,
      cpc: 7.80,
      costPerConversion: 2184.00
    },
    {
      id: "CAMP_003", 
      name: "[LEAD] [SEARCH] [LP AUTOFÁCIL] Palhoça - 05/11/25",
      type: "SEARCH",
      status: "ACTIVE",
      budget: 5000.00,
      clicks: 259,
      impressions: 10196,
      conversions: 43.33,
      ctr: 2.54,
      cpc: 6.20,
      costPerConversion: 1605.86
    }
  ],
  ads: [
    {
      id: "AD_001",
      campaignId: "CAMP_001",
      headline: "Despachante Marcelino - Florianópolis",
      description: "Despachante veicular em Florianópolis. Licenciamento, transferência e documentação veicular.",
      url: "https://despachantemarcelino.com.br/florianopolis",
      type: "RESPONSIVE_SEARCH",
      status: "ACTIVE"
    },
    {
      id: "AD_002", 
      campaignId: "CAMP_002",
      headline: "Despachante Marcelino - São José",
      description: "Despachante veicular em São José. Agilidade e confiança para sua documentação.",
      url: "https://despachantemarcelino.com.br/sao-jose",
      type: "SEARCH",
      status: "ACTIVE"
    },
    {
      id: "AD_003",
      campaignId: "CAMP_003",
      headline: "Despachante Marcelino - Palhoça",
      description: "Despachante veicular em Palhoça. Licenciamento e transferência com qualidade.",
      url: "https://despachantemarcelino.com.br/palhoca",
      type: "SEARCH",
      status: "ACTIVE"
    }
  ],
  metrics: {
    totalClicks: 859,
    totalImpressions: 25896,
    totalConversions: 193.33,
    totalCost: 6509.86,
    avgCtr: 3.32,
    avgCpc: 7.58,
    avgCostPerConversion: 33.67
  },
  notifications: [
    {
      id: "notif1",
      message: "Campanha Florianópolis atingiu 90% do orçamento diário",
      type: "WARNING",
      date: "2025-06-30",
      time: "16:45"
    },
    {
      id: "notif2",
      message: "Nova conversão registrada na campanha São José",
      type: "SUCCESS", 
      date: "2025-06-30",
      time: "15:30"
    },
    {
      id: "notif3",
      message: "Campanha São José com CTR de 3.89% - acima da média",
      type: "SUCCESS",
      date: "2025-06-30", 
      time: "14:15"
    },
    {
      id: "notif4",
      message: "Campanha Palhoça com CTR de 2.54% - considerar otimização",
      type: "INFO",
      date: "2025-06-30",
      time: "13:20"
    },
    {
      id: "notif5",
      message: "Relatório mensal de junho 2025 disponível para download",
      type: "INFO",
      date: "2025-06-30",
      time: "12:00"
    },
    {
      id: "notif6",
      message: "CPC médio de R$ 7.58 - dentro do esperado para o setor",
      type: "INFO",
      date: "2025-06-30",
      time: "11:30"
    }
  ],
  user: {
    name: "Marcelino Silva",
    email: "marcelino@despachantemarcelino.com.br",
    avatar: "MS",
    role: "Google Ads Manager",
    department: "Marketing Digital"
  }
};

// API Functions - Dados Reais
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

// Ad Modal Component
const AdModal: React.FC<{
  title: string;
  ad?: any;
  campaigns: any[];
  onSave: (data: any) => void;
  onClose: () => void;
}> = ({ title, ad, campaigns, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    headline: ad?.headline || '',
    description: ad?.description || '',
    url: ad?.url || '',
    type: ad?.type || 'RESPONSIVE_SEARCH',
    campaignId: ad?.campaignId || (campaigns[0]?.id || ''),
    status: ad?.status || 'ACTIVE'
  });

  const [preview, setPreview] = useState(true);

  const handleSubmit = () => {
    if (!formData.headline.trim() || !formData.description.trim() || !formData.url.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(formData);
  };

  const getCampaignName = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : 'Campanha não encontrada';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-premium max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Form Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Informações do Anúncio</h3>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Campanha *
              </label>
              <select
                value={formData.campaignId}
                onChange={(e) => setFormData({...formData, campaignId: e.target.value})}
                className="input-premium"
              >
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Título do Anúncio *
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({...formData, headline: e.target.value})}
                className="input-premium"
                placeholder="Ex: Oferta Exclusiva Premium!"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.headline.length}/30 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-premium h-24 resize-none"
                placeholder="Aproveite descontos incríveis agora mesmo. Produtos de alta qualidade com entrega rápida."
                maxLength={90}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/90 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL de Destino *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="input-premium"
                placeholder="https://autofacildespachante.com.br"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Anúncio
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="input-premium"
                >
                  <option value="RESPONSIVE_SEARCH">Responsivo de Pesquisa</option>
                  <option value="DISPLAY">Display</option>
                  <option value="SHOPPING">Shopping</option>
                  <option value="VIDEO">Vídeo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="input-premium"
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="PAUSED">Pausado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Preview do Anúncio</h3>
              <button
                onClick={() => setPreview(!preview)}
                className="btn-glass text-sm"
              >
                <span className="material-icons-outlined">
                  {preview ? 'visibility_off' : 'visibility'}
                </span>
                {preview ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            
            {preview && (
              <div className="space-y-4">
                {/* Google Ads Preview */}
                <div className="p-4 border border-border rounded-lg bg-background">
                  <div className="text-xs text-muted-foreground mb-1">Anúncio</div>
                  <div className="space-y-1">
                    <div className="flex items-start">
                      <div className="w-4 h-4 bg-accent rounded-sm mr-2 mt-0.5"></div>
                      <div className="flex-1">
                        <div className="text-primary text-sm font-medium">
                          {formData.headline || 'Título do anúncio aparecerá aqui'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formData.url || 'URL de destino'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-foreground ml-6">
                      {formData.description || 'Descrição do anúncio aparecerá aqui'}
                    </div>
                  </div>
                </div>

                {/* Campaign Info */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Informações da Campanha</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Campanha: {getCampaignName(formData.campaignId)}</div>
                    <div>Tipo: {formData.type}</div>
                    <div>Status: {formData.status}</div>
                  </div>
                </div>

                {/* Tips */}
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">💡 Dicas para Setor Veicular</h4>
                  <ul className="text-sm text-foreground space-y-1">
                    <li>• Use "licenciamento veicular" e "despachante veicular" no título</li>
                    <li>• Destaque "processo 100% digital" e "sem sair de casa"</li>
                    <li>• Inclua "agilidade" e "confiança" como diferenciais</li>
                    <li>• Teste variações com "rápido", "online" e "digital"</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-border">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-glass"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn-premium"
            >
              <span className="material-icons-outlined mr-2">save</span>
              {ad ? 'Atualizar' : 'Criar'} Anúncio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
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

// Campaign Modal Component
const CampaignModal: React.FC<{
  title: string;
  campaign?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}> = ({ title, campaign, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    type: campaign?.type || 'SEARCH',
    budget: campaign?.budget || 1000,
    status: campaign?.status || 'ACTIVE',
    keywords: campaign?.keywords || '',
    location: campaign?.location || 'Brasil',
    ageRange: campaign?.ageRange || '18-65',
    device: campaign?.device || 'ALL'
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome da campanha é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-premium max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome da Campanha *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-premium"
                placeholder="Ex: Campanha Premium 2025"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Campanha
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="input-premium"
              >
                <option value="SEARCH">Search</option>
                <option value="DISPLAY">Display</option>
                <option value="SHOPPING">Shopping</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Orçamento Diário (R$)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                className="input-premium"
                min="10"
                step="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="input-premium"
              >
                <option value="ACTIVE">Ativo</option>
                <option value="PAUSED">Pausado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Localização
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="input-premium"
                placeholder="Ex: São Paulo, Brasil"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Faixa Etária
              </label>
              <select
                value={formData.ageRange}
                onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                className="input-premium"
              >
                <option value="18-24">18-24 anos</option>
                <option value="25-34">25-34 anos</option>
                <option value="35-44">35-44 anos</option>
                <option value="45-54">45-54 anos</option>
                <option value="55-64">55-64 anos</option>
                <option value="18-65">18-65 anos</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Palavras-chave (separadas por vírgula)
            </label>
            <textarea
              value={formData.keywords}
              onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              className="input-premium h-24 resize-none"
              placeholder="premium, exclusivo, oferta especial, desconto"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-border">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-glass"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn-premium"
            >
              <span className="material-icons-outlined mr-2">save</span>
              {campaign ? 'Atualizar' : 'Criar'} Campanha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Comments Modal Component
const CommentsModal: React.FC<{
  campaign: any;
  comments: any[];
  onAddComment: (text: string) => void;
  onClose: () => void;
}> = ({ campaign, comments, onAddComment, onClose }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi adicionado com sucesso.",
      });
    }
  };

  const getCommentIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return '💡';
      case 'insight': return '📊';
      case 'warning': return '⚠️';
      default: return '💬';
    }
  };

  const getCommentColor = (type: string) => {
    switch (type) {
      case 'suggestion': return 'border-l-accent bg-accent/5';
      case 'insight': return 'border-l-primary bg-primary/5';
      case 'warning': return 'border-l-warning bg-warning/5';
      default: return 'border-l-muted bg-muted/5';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-premium max-w-3xl w-full max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Comentários da Campanha</h2>
              <p className="text-sm text-muted-foreground">{campaign.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons-outlined text-6xl text-muted-foreground/50 mb-4">comment</span>
              <p className="text-muted-foreground">Nenhum comentário ainda</p>
              <p className="text-sm text-muted-foreground">Seja o primeiro a comentar nesta campanha</p>
            </div>
          ) : (
            comments.map(comment => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg border-l-4 ${getCommentColor(comment.type)} animate-slide-up`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getCommentIcon(comment.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-foreground">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-foreground">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t border-border">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Adicionar comentário
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="input-premium h-20 resize-none"
                  placeholder="Digite seu comentário sobre esta campanha..."
                />
              </div>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="btn-premium self-end disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
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
      description: "Bem-vindo ao Dashboard do Despachante Marcelino",
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
            <h1 className="text-3xl font-bold text-white mb-2">Despachante Marcelino</h1>
            <p className="text-white/80">Dashboard de Marketing Digital</p>
          </div>
          
          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">E-mail corporativo</label>
              <input
                type="email"
                className="input-premium text-foreground"
                placeholder="nome@google.com"
                defaultValue="marcelino@despachantemarcelino.com.br"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Senha</label>
              <input
                type="password"
                className="input-premium text-foreground"
                placeholder="••••••••"
                defaultValue="MARCELINO2025"
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
    { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
    { id: 'chat', label: 'Chat', icon: 'chat' },
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
              <p className="text-xs text-muted-foreground">Dashboard Despachante Marcelino</p>
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
          {currentPage === 'webhooks' && <WebhookStats />}
          {currentPage === 'chat' && <LiveChat />}
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
  // Dados estáticos conforme fornecido
  const periodoAnalise = "01/07/2025 a 01/08/2025";
  const periodoComparacao = "Sem período de comparação";

  // Cards de métricas com design antigo
  const metricCards = [
    {
      title: 'Custo',
      value: 1561.29,
      icon: 'payments',
      color: 'text-google-red',
      format: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '',
      changeType: 'neutral',
    },
    {
      title: 'Impressões',
      value: 22688,
      icon: 'visibility',
      color: 'text-google-green',
      format: (val: number) => val.toLocaleString('pt-BR'),
      change: '',
      changeType: 'neutral',
    },
    {
      title: 'Cliques',
      value: 1127,
      icon: 'mouse',
      color: 'text-google-blue',
      format: (val: number) => val.toLocaleString('pt-BR'),
      change: '',
      changeType: 'neutral',
    },
    {
      title: 'CTR',
      value: 4.97,
      icon: 'trending_up',
      color: 'text-google-yellow',
      format: (val: number) => `${val.toFixed(2)}%`,
      change: '',
      changeType: 'neutral',
    },
    {
      title: 'CPC médio',
      value: 1.39,
      icon: 'attach_money',
      color: 'text-google-blue',
      format: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '',
      changeType: 'neutral',
    },
    {
      title: 'Taxa de Conversão',
      value: 16.81,
      icon: 'percent',
      color: 'text-google-green',
      format: (val: number) => `${val.toFixed(2)}%`,
      change: '',
      changeType: 'neutral',
    },
    {
      title: 'Custo por Conversão',
      value: 8.24,
      icon: 'calculate',
      color: 'text-google-red',
      format: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '',
      changeType: 'neutral',
    },
    {
      title: 'Conversões',
      value: 189.5,
      icon: 'check_circle',
      color: 'text-google-yellow',
      format: (val: number) => val.toLocaleString('pt-BR'),
      change: '',
      changeType: 'neutral',
    },
    {
      title: '% de impressões (1ª posição)',
      value: 15.98,
      icon: 'looks_one',
      color: 'text-google-blue',
      format: (val: number) => `${val.toFixed(2)}%`,
      change: '',
      changeType: 'neutral',
    },
    {
      title: '% de impressões (parte superior)',
      value: 70.24,
      icon: 'vertical_align_top',
      color: 'text-google-green',
      format: (val: number) => `${val.toFixed(2)}%`,
      change: '',
      changeType: 'neutral',
    },
  ];

  const campanhas = [
    {
      nome: "lead-search-despmarcelino-lpauto-estados_sul-junho_2026",
      impressoes: "8.023",
      cliques: "456",
      ctr: "5,68%",
      cpc: "R$0,69",
      conversoes: "79",
      custoPorConversao: "R$3,96",
      taxaConversao: "17,32%",
      taxaCliques: "12,23%",
      taxaTopo: "67,68%",
      custo: "R$313,02"
    },
    {
      nome: "lead-search-lp2-desp_marcelino-palhoca-02_10_24-01_08_25-lp1-04_08_25",
      impressoes: "3.477",
      cliques: "186",
      ctr: "5,35%",
      cpc: "R$1,62",
      conversoes: "26,5",
      custoPorConversao: "R$11,39",
      taxaConversao: "14,25%",
      taxaCliques: "18,99%",
      taxaTopo: "76,01%",
      custo: "R$301,88"
    },
    {
      nome: "lead-search-lp2-desp_marcelino-sao_jose-02_10_24-01_08_25-lp1-04_08_25",
      impressoes: "4.441",
      cliques: "173",
      ctr: "3,9%",
      cpc: "R$1,71",
      conversoes: "29,5",
      custoPorConversao: "R$10,01",
      taxaConversao: "17,05%",
      taxaCliques: "17,39%",
      taxaTopo: "72,1%",
      custo: "R$295,34"
    },
    {
      nome: "lead-search-desp_marcelino-floripa-06_11_24-lp2-16_07_25-01_08_25",
      impressoes: "3.268",
      cliques: "164",
      ctr: "5,02%",
      cpc: "R$1,87",
      conversoes: "28,5",
      custoPorConversao: "R$10,78",
      taxaConversao: "17,38%",
      taxaCliques: "15,1%",
      taxaTopo: "70,3%",
      custo: "R$307,26"
    },
    {
      nome: "Leads-Search-Autofacilcertificados-09-07-25",
      impressoes: "1.814",
      cliques: "73",
      ctr: "4,02%",
      cpc: "R$3,36",
      conversoes: "17",
      custoPorConversao: "R$14,41",
      taxaConversao: "23,29%",
      taxaCliques: "12,99%",
      taxaTopo: "66,77%",
      custo: "R$244,94"
    }
  ];

  const campanhasNomes = [
    "[LEAD] [SERACH] [LP AUTOFÁCIL] Florianópolis - 05/11/24",
    "Auto Facil WORKING",
    "[LEAD] [SERACH] [LP AUTOFÁCIL] São José - 02/10/24",
    "Auto Facil WORKING",
    "[LEAD] [SERACH] [LP AUTOFÁCIL] Palhoça - 05/11/2024",
    "Auto Facil WORKING"
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard de Despachante Marcelino</h2>
          <div className="text-muted-foreground text-sm mt-1">Período de análise: <b>{periodoAnalise}</b></div>
          <div className="text-muted-foreground text-sm">Período de comparação: <b>{periodoComparacao}</b></div>
        </div>
        <button className="btn btn-primary">Atualizar período</button>
      </div>

      {/* Cards de métricas com design antigo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricCards.map((metric, index) => (
          <div key={metric.title} className="metric-card group" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`metric-icon ${metric.color}`}>
              <span className="material-icons-outlined">{metric.icon}</span>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {metric.format(metric.value)}
              </h3>
              {metric.change && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  metric.changeType === 'positive'
                    ? 'bg-green-100 text-green-700'
                    : metric.changeType === 'negative'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {metric.change}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{metric.title}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Todas as Campanhas</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-card border border-border rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2">Campanha</th>
                <th className="px-4 py-2">Impressões</th>
                <th className="px-4 py-2">Cliques</th>
                <th className="px-4 py-2">CTR</th>
                <th className="px-4 py-2">CPC</th>
                <th className="px-4 py-2">Conversões</th>
                <th className="px-4 py-2">Custo/Conv.</th>
                <th className="px-4 py-2">Taxa Conv.</th>
                <th className="px-4 py-2">Taxa Cliques</th>
                <th className="px-4 py-2">Taxa Topo</th>
                <th className="px-4 py-2">Custo</th>
              </tr>
            </thead>
            <tbody>
              {campanhas.map((c, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{c.nome}</td>
                  <td className="px-4 py-2">{c.impressoes}</td>
                  <td className="px-4 py-2">{c.cliques}</td>
                  <td className="px-4 py-2">{c.ctr}</td>
                  <td className="px-4 py-2">{c.cpc}</td>
                  <td className="px-4 py-2">{c.conversoes}</td>
                  <td className="px-4 py-2">{c.custoPorConversao}</td>
                  <td className="px-4 py-2">{c.taxaConversao}</td>
                  <td className="px-4 py-2">{c.taxaCliques}</td>
                  <td className="px-4 py-2">{c.taxaTopo}</td>
                  <td className="px-4 py-2">{c.custo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Campanhas</h3>
        <ul className="list-disc pl-6 space-y-1">
          {campanhasNomes.map((nome, i) => (
            <li key={i}>{nome}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Campaigns Page Component - CÓDIGO LIMPO
const CampaignsPage: React.FC = () => {
  const campanhas = [
    {
      nome: "lead-search-despmarcelino-lpauto-estados_sul-junho_2026",
      impressoes: "8.023",
      cliques: "456",
      ctr: "5,68%",
      cpc: "R$0,69",
      conversoes: "79",
      custoPorConversao: "R$3,96",
      taxaConversao: "17,32%",
      taxaCliques: "12,23%",
      taxaTopo: "67,68%",
      custo: "R$313,02",
      status: "Ativo"
    },
    {
      nome: "lead-search-lp2-desp_marcelino-palhoca-02_10_24-01_08_25-lp1-04_08_25",
      impressoes: "3.477",
      cliques: "186",
      ctr: "5,35%",
      cpc: "R$1,62",
      conversoes: "26,5",
      custoPorConversao: "R$11,39",
      taxaConversao: "14,25%",
      taxaCliques: "18,99%",
      taxaTopo: "76,01%",
      custo: "R$301,88",
      status: "Ativo"
    },
    {
      nome: "lead-search-lp2-desp_marcelino-sao_jose-02_10_24-01_08_25-lp1-04_08_25",
      impressoes: "4.441",
      cliques: "173",
      ctr: "3,9%",
      cpc: "R$1,71",
      conversoes: "29,5",
      custoPorConversao: "R$10,01",
      taxaConversao: "17,05%",
      taxaCliques: "17,39%",
      taxaTopo: "72,1%",
      custo: "R$295,34",
      status: "Ativo"
    },
    {
      nome: "lead-search-desp_marcelino-floripa-06_11_24-lp2-16_07_25-01_08_25",
      impressoes: "3.268",
      cliques: "164",
      ctr: "5,02%",
      cpc: "R$1,87",
      conversoes: "28,5",
      custoPorConversao: "R$10,78",
      taxaConversao: "17,38%",
      taxaCliques: "15,1%",
      taxaTopo: "70,3%",
      custo: "R$307,26",
      status: "Ativo"
    },
    {
      nome: "Leads-Search-Autofacilcertificados-09-07-25",
      impressoes: "1.814",
      cliques: "73",
      ctr: "4,02%",
      cpc: "R$3,36",
      conversoes: "17",
      custoPorConversao: "R$14,41",
      taxaConversao: "23,29%",
      taxaCliques: "12,99%",
      taxaTopo: "66,77%",
      custo: "R$244,94",
      status: "Ativo"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Campanhas</h2>
          <p className="text-muted-foreground">Gerencie suas campanhas do Google Ads</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-glass">
            <span className="material-icons-outlined">filter_list</span>
            Filtros
          </button>
          <button className="btn-premium">
            <span className="material-icons-outlined">add</span>
            Nova Campanha
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">campaign</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{campanhas.length}</h3>
          <p className="text-muted-foreground text-sm">Campanhas Ativas</p>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">trending_up</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">R$ 1.461,50</h3>
          <p className="text-muted-foreground text-sm">Custo Total</p>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-google-green/10 text-google-green rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">mouse</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">1.052</h3>
          <p className="text-muted-foreground text-sm">Total de Cliques</p>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-google-yellow/10 text-google-yellow rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">check_circle</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">180</h3>
          <p className="text-muted-foreground text-sm">Conversões</p>
        </div>
      </div>

      <div className="card-floating overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Campanhas ({campanhas.length})
            </h3>
            <div className="flex gap-2">
              <button className="btn-glass">
                <span className="material-icons-outlined">download</span>
                Exportar
              </button>
              <button className="btn-glass">
                <span className="material-icons-outlined">refresh</span>
                Atualizar
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th className="text-left">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Campanha
                  </div>
                </th>
                <th>Status</th>
                <th>Impressões</th>
                <th>Cliques</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>Conversões</th>
                <th>Custo/Conv.</th>
                <th>Custo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {campanhas.map((c, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <div className="font-medium text-foreground">{c.nome}</div>
                        <div className="text-sm text-muted-foreground">Search Network</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-success">{c.status}</span>
                  </td>
                  <td className="font-medium">{c.impressoes}</td>
                  <td className="font-medium">{c.cliques}</td>
                  <td>
                    <span className={`text-sm ${
                      parseFloat(c.ctr.replace(',', '.')) >= 4.0 ? 'text-green-600' : 
                      parseFloat(c.ctr.replace(',', '.')) >= 3.0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {c.ctr}
                    </span>
                  </td>
                  <td className="font-medium">{c.cpc}</td>
                  <td>{c.conversoes}</td>
                  <td className="font-medium">{c.custoPorConversao}</td>
                  <td className="font-medium">{c.custo}</td>
                  <td>
                    <div className="flex space-x-1">
                      <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors" title="Editar">
                        <span className="material-icons-outlined text-sm">edit</span>
                      </button>
                      <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors" title="Ver detalhes">
                        <span className="material-icons-outlined text-sm">visibility</span>
                      </button>
                      <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors" title="Relatórios">
                        <span className="material-icons-outlined text-sm">analytics</span>
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive" title="Pausar">
                        <span className="material-icons-outlined text-sm">pause</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Ads Page Component - COMPLETE
const AdsPage: React.FC = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [campaignFilter, setCampaignFilter] = useState('ALL');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('headline');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    Promise.all([
      api.getAds(),
      api.getCampaigns()
    ]).then(([adsData, campaignsData]) => {
      setAds(adsData);
      setCampaigns(campaignsData);
      setLoading(false);
    });
  }, []);

  const filteredAndSortedAds = ads
    .filter(ad => {
      const matchesSearch = ad.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCampaign = campaignFilter === 'ALL' || ad.campaignId === campaignFilter;
      const matchesStatus = statusFilter === 'ALL' || ad.status === statusFilter;
      return matchesSearch && matchesCampaign && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getCampaignName = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : 'Campanha não encontrada';
  };

  const handleExportAds = () => {
    const csvData = [
      ['Título', 'Descrição', 'Campanha', 'Tipo', 'Status', 'URL'],
      ...filteredAndSortedAds.map(ad => [
        ad.headline,
        ad.description,
        getCampaignName(ad.campaignId),
        ad.type,
        ad.status,
        ad.url
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `anuncios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Relatório exportado!",
      description: "O arquivo CSV foi baixado com sucesso.",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCampaignFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('headline');
    setSortOrder('asc');
  };

  const handleCreateAd = async (adData: any) => {
    try {
      const newAd = {
        ...adData,
        id: Date.now().toString(),
        status: 'ACTIVE'
      };
      setAds([...ads, newAd]);
      setShowCreateModal(false);
      toast({
        title: "Anúncio criado com sucesso!",
        description: `O anúncio "${newAd.headline}" foi criado e está ativo.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao criar anúncio",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAd = async (adData: any) => {
    try {
      setAds(ads.map(a => a.id === selectedAd.id ? { ...adData, id: selectedAd.id } : a));
      setShowEditModal(false);
      setSelectedAd(null);
      toast({
        title: "Anúncio atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar anúncio",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      setAds(ads.filter(a => a.id !== adId));
      toast({
        title: "Anúncio excluído",
        description: "O anúncio foi removido permanentemente.",
      });
    }
  };

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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciamento de Anúncios</h2>
          <p className="text-muted-foreground">Crie e gerencie anúncios para suas campanhas</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-premium"
        >
          <span className="material-icons-outlined">add</span>
          Novo Anúncio
        </button>
      </div>

      {/* Filters */}
      <div className="card-floating p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Buscar</label>
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <input
                type="text"
                placeholder="Título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Campanha</label>
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="input-premium"
            >
              <option value="ALL">Todas as Campanhas</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-premium"
            >
              <option value="ALL">Todos os Status</option>
              <option value="ACTIVE">Ativo</option>
              <option value="PAUSED">Pausado</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-premium"
            >
              <option value="headline">Título</option>
              <option value="type">Tipo</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ordem</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-premium"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button 
              onClick={handleClearFilters}
              className="btn-glass flex-1"
              title="Limpar filtros"
            >
              <span className="material-icons-outlined">clear</span>
              Limpar
            </button>
            <button 
              onClick={handleExportAds}
              className="btn-premium flex-1"
              title="Exportar anúncios"
            >
              <span className="material-icons-outlined">download</span>
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Ads Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">ads_click</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{ads.length}</h3>
          <p className="text-muted-foreground text-sm">Total de Anúncios</p>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">play_arrow</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{ads.filter(a => a.status === 'ACTIVE').length}</h3>
          <p className="text-muted-foreground text-sm">Anúncios Ativos</p>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">pause</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">{ads.filter(a => a.status === 'PAUSED').length}</h3>
          <p className="text-muted-foreground text-sm">Anúncios Pausados</p>
        </div>
      </div>

      {/* Ads Table */}
      <div className="card-floating overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Anúncios ({filteredAndSortedAds.length})
          </h3>
        </div>
        
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Anúncio</th>
                  <th>Campanha</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedAds.map(ad => (
                  <tr key={ad.id}>
                    <td>
                      <div>
                        <div className="font-medium text-foreground">{ad.headline}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {ad.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-muted-foreground">
                        {getCampaignName(ad.campaignId)}
                      </span>
                    </td>
                    <td>
                      <span className="px-3 py-1 bg-muted/50 rounded-full text-xs font-medium">
                        {ad.type}
                      </span>
                    </td>
                    <td>{getStatusBadge(ad.status)}</td>
                    <td>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setSelectedAd(ad);
                            setShowEditModal(true);
                          }}
                          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <span className="material-icons-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            toast({
                              title: "Preview do Anúncio",
                              description: `Título: ${ad.headline}\nDescrição: ${ad.description}`,
                            });
                          }}
                          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <span className="material-icons-outlined text-sm">preview</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                          title="Excluir"
                        >
                          <span className="material-icons-outlined text-sm">delete</span>
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

      {/* Create Ad Modal */}
      {showCreateModal && (
        <AdModal
          title="Criar Novo Anúncio"
          campaigns={campaigns}
          onSave={handleCreateAd}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Ad Modal */}
      {showEditModal && selectedAd && (
        <AdModal
          title="Editar Anúncio"
          ad={selectedAd}
          campaigns={campaigns}
          onSave={handleUpdateAd}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAd(null);
          }}
        />
      )}
    </div>
  );
};

// Reports Page Component - COMPLETE
const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [selectedCampaign, setSelectedCampaign] = useState('ALL');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.getCampaigns(),
      api.getMetrics()
    ]).then(([campaignsData, metricsData]) => {
      setCampaigns(campaignsData);
      setReportData({
        ...metricsData,
        chartData: {
          labels: ['01/01', '07/01', '14/01', '21/01', '28/01', '04/02', '11/02'],
          clicks: [850, 1200, 980, 1500, 1300, 1100, 1400],
          impressions: [15000, 22000, 18500, 28000, 24000, 20000, 26000],
          conversions: [42, 65, 51, 78, 68, 55, 72]
        },
        campaignPerformance: campaignsData.map(campaign => ({
          ...campaign,
          roi: ((campaign.conversions * 150 - campaign.budget) / campaign.budget * 100).toFixed(1)
        }))
      });
      setLoading(false);
    });
  }, []);

  const exportReport = () => {
    if (!reportData) {
      toast({
        title: "Erro ao exportar",
        description: "Nenhum dado disponível para exportar.",
        variant: "destructive",
      });
      return;
    }

    const csvData = [
      ['Campanha', 'Cliques', 'Impressões', 'CTR', 'CPC', 'Conversões', 'ROI'],
      ...reportData.campaignPerformance.map((campaign: any) => [
        campaign.name,
        campaign.clicks,
        campaign.impressions,
        campaign.ctr + '%',
        'R$ ' + campaign.cpc.toFixed(2),
        campaign.conversions,
        campaign.roi + '%'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Relatório exportado!",
      description: "O arquivo CSV foi baixado com sucesso.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Relatórios e Analytics</h2>
          <p className="text-muted-foreground">Análises detalhadas do desempenho das suas campanhas</p>
        </div>
        <button
          onClick={exportReport}
          className="btn-premium"
        >
          <span className="material-icons-outlined">download</span>
          Exportar Relatório
        </button>
      </div>

      {/* Filters */}
      <div className="card-floating p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Período</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-premium"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Campanha</label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="input-premium"
            >
              <option value="ALL">Todas as Campanhas</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Métrica</label>
            <select className="input-premium">
              <option value="clicks">Cliques</option>
              <option value="impressions">Impressões</option>
              <option value="conversions">Conversões</option>
              <option value="cost">Custo</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  toast({
                    title: "Dados atualizados!",
                    description: "Os relatórios foram atualizados com sucesso.",
                  });
                }, 1500);
              }}
              className="btn-glass w-full"
            >
              <span className="material-icons-outlined">refresh</span>
              Atualizar Dados
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">trending_up</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">2.59%</h3>
          <p className="text-muted-foreground text-sm">CTR Médio</p>
          <div className="flex items-center justify-center mt-2 text-accent text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_upward</span>
            +0.3% vs maio 2025
          </div>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">attach_money</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">R$ 3,07</h3>
          <p className="text-muted-foreground text-sm">CPC Médio</p>
          <div className="flex items-center justify-center mt-2 text-destructive text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_downward</span>
            -R$ 0.15 vs maio 2025
          </div>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">transform</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">6.34%</h3>
          <p className="text-muted-foreground text-sm">Taxa de Conversão</p>
          <div className="flex items-center justify-center mt-2 text-accent text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_upward</span>
            +1.2% vs maio 2025
          </div>
        </div>
        
        <div className="card-floating p-6 text-center">
          <div className="w-12 h-12 bg-google-red/10 text-google-red rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined">trending_up</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">285%</h3>
          <p className="text-muted-foreground text-sm">ROI Médio</p>
          <div className="flex items-center justify-center mt-2 text-accent text-sm">
            <span className="material-icons-outlined text-sm mr-1">arrow_upward</span>
            +45% vs maio 2025
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="card-floating p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Performance ao Longo do Tempo</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="material-icons-outlined text-4xl text-muted-foreground mb-2">show_chart</span>
                <p className="text-muted-foreground">Gráfico de Performance</p>
                <p className="text-sm text-muted-foreground">Dados dos últimos {dateRange} dias</p>
              </div>
            </div>
          )}
        </div>

        {/* ROI by Campaign */}
        <div className="card-floating p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">ROI por Campanha</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="h-64 space-y-4 overflow-y-auto">
              {reportData?.campaignPerformance.map((campaign: any, index: number) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">{campaign.type}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${parseFloat(campaign.roi) > 0 ? 'text-accent' : 'text-destructive'}`}>
                      {campaign.roi > 0 ? '+' : ''}{campaign.roi}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.conversions} conversões
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="card-floating overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Relatório Detalhado</h3>
        </div>
        
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Campanha</th>
                  <th>Cliques</th>
                  <th>Impressões</th>
                  <th>CTR</th>
                  <th>CPC</th>
                  <th>Conversões</th>
                  <th>Custo</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.campaignPerformance.map((campaign: any) => (
                  <tr key={campaign.id}>
                    <td>
                      <div className="font-medium text-foreground">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">{campaign.type}</div>
                    </td>
                    <td className="font-medium">{campaign.clicks.toLocaleString('pt-BR')}</td>
                    <td>{campaign.impressions.toLocaleString('pt-BR')}</td>
                    <td>{campaign.ctr}%</td>
                    <td>R$ {campaign.cpc.toFixed(2)}</td>
                    <td>{campaign.conversions}</td>
                    <td>R$ {campaign.budget.toFixed(2)}</td>
                    <td className={`font-medium ${parseFloat(campaign.roi) > 0 ? 'text-accent' : 'text-destructive'}`}>
                      {campaign.roi > 0 ? '+' : ''}{campaign.roi}%
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

// Settings Page Component - COMPLETE
const SettingsPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    developerToken: '',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    customerId: ''
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    emailReports: true,
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  });

  const [loading, setLoading] = useState(false);

  const handleSaveCredentials = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    toast({
      title: "Credenciais salvas!",
      description: "Suas credenciais do Google Ads foram atualizadas com sucesso.",
    });
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    toast({
      title: "Preferências salvas!",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configurações do Sistema</h2>
        <p className="text-muted-foreground">Gerencie suas credenciais e preferências</p>
      </div>

      {/* Google Ads Credentials */}
      <div className="card-floating">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <span className="material-icons-outlined">key</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Credenciais Google Ads API</h3>
              <p className="text-sm text-muted-foreground">Configure suas credenciais para acessar a API</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Developer Token *
              </label>
              <input
                type="password"
                value={credentials.developerToken}
                onChange={(e) => setCredentials({...credentials, developerToken: e.target.value})}
                className="input-premium"
                placeholder="Seu developer token"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Client ID *
              </label>
              <input
                type="text"
                value={credentials.clientId}
                onChange={(e) => setCredentials({...credentials, clientId: e.target.value})}
                className="input-premium"
                placeholder="Client ID da aplicação OAuth2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Client Secret *
              </label>
              <input
                type="password"
                value={credentials.clientSecret}
                onChange={(e) => setCredentials({...credentials, clientSecret: e.target.value})}
                className="input-premium"
                placeholder="Client secret da aplicação OAuth2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Refresh Token *
              </label>
              <input
                type="password"
                value={credentials.refreshToken}
                onChange={(e) => setCredentials({...credentials, refreshToken: e.target.value})}
                className="input-premium"
                placeholder="Token de atualização OAuth2"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Customer ID *
              </label>
              <input
                type="text"
                value={credentials.customerId}
                onChange={(e) => setCredentials({...credentials, customerId: e.target.value})}
                className="input-premium"
                placeholder="ID do cliente Google Ads (formato: 123-456-7890)"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveCredentials}
              disabled={loading}
              className="btn-premium disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                <>
                  <span className="material-icons-outlined mr-2">save</span>
                  Salvar Credenciais
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card-floating">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
              <span className="material-icons-outlined">tune</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Preferências</h3>
              <p className="text-sm text-muted-foreground">Personalize sua experiência</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tema
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                className="input-premium"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Idioma
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                className="input-premium"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fuso Horário
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                className="input-premium"
              >
                <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Notificações</h4>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-foreground">Receber notificações push</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.emailReports}
                  onChange={(e) => setPreferences({...preferences, emailReports: e.target.checked})}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-foreground">Receber relatórios por email</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSavePreferences}
              disabled={loading}
              className="btn-premium disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                <>
                  <span className="material-icons-outlined mr-2">save</span>
                  Salvar Preferências
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Page Component - COMPLETE
const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: mockData.user.name,
    email: mockData.user.email,
    role: mockData.user.role,
    department: mockData.user.department,
    phone: '+55 11 99999-9999',
    location: 'São Paulo, Brasil',
            joinDate: '2025-01-15'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activityLog] = useState([
    {
      id: 1,
      action: 'Criou campanha "Premium 2025"',
      date: '2025-01-08 14:30',
      type: 'create'
    },
    {
      id: 2,
      action: 'Atualizou orçamento da campanha Shopping',
      date: '2025-01-08 11:15',
      type: 'update'
    },
    {
      id: 3,
      action: 'Exportou relatório de performance',
      date: '2025-01-07 16:45',
      type: 'export'
    },
    {
      id: 4,
      action: 'Pausou campanha "Display Brand"',
      date: '2025-01-07 10:20',
      type: 'pause'
    },
    {
      id: 5,
      action: 'Adicionou comentário na campanha Video',
      date: '2025-01-06 15:30',
      type: 'comment'
    }
  ]);

  const handleSaveProfile = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return 'add_circle';
      case 'update': return 'edit';
      case 'export': return 'download';
      case 'pause': return 'pause';
      case 'comment': return 'comment';
      default: return 'info';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create': return 'text-accent';
      case 'update': return 'text-primary';
      case 'export': return 'text-warning';
      case 'pause': return 'text-destructive';
      case 'comment': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Meu Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e histórico</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-floating">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {mockData.user.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{userInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">{userInfo.role}</p>
                    <p className="text-xs text-muted-foreground">{userInfo.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-glass"
                >
                  <span className="material-icons-outlined">
                    {isEditing ? 'close' : 'edit'}
                  </span>
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="input-premium"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Corporativo
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="input-premium"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cargo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.role}
                      onChange={(e) => setUserInfo({...userInfo, role: e.target.value})}
                      className="input-premium"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.role}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Departamento
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.department}
                      onChange={(e) => setUserInfo({...userInfo, department: e.target.value})}
                      className="input-premium"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.department}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="input-premium"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Localização
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.location}
                      onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                      className="input-premium"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.location}</p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-glass"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="btn-premium disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      <>
                        <span className="material-icons-outlined mr-2">save</span>
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Log & Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card-floating p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="material-icons-outlined">calendar_today</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Membro desde</h3>
            <p className="text-muted-foreground">
              {new Date(userInfo.joinDate).toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Activity Log */}
          <div className="card-floating">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activityLog.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-muted/30 ${getActivityColor(activity.type)}`}>
                      <span className="material-icons-outlined text-sm">
                        {getActivityIcon(activity.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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