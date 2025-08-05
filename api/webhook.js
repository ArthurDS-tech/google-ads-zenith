// API Webhook para Despachante Marcelino
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Verificar método
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verificar secret
  const secret = req.headers['x-webhook-secret'] || req.headers['authorization'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Processar webhook
  if (req.method === 'POST') {
    try {
      const { event, data } = req.body;

      // Log do webhook
      console.log(`Webhook recebido: ${event}`, data);

      // Processar diferentes tipos de eventos
      switch (event) {
        case 'message':
          // Processar nova mensagem
          processMessage(data);
          break;
        case 'lead':
          // Processar novo lead
          processLead(data);
          break;
        case 'conversion':
          // Processar conversão
          processConversion(data);
          break;
        case 'payment':
          // Processar pagamento
          processPayment(data);
          break;
        default:
          console.log(`Evento desconhecido: ${event}`);
      }

      // Resposta de sucesso
      res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso',
        timestamp: new Date().toISOString(),
        event: event
      });

    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}

// Funções de processamento
function processMessage(data) {
  // Processar mensagem do cliente
  console.log('Processando mensagem:', data);
  
  // Aqui você pode adicionar lógica para:
  // - Salvar no banco de dados
  // - Enviar notificação
  // - Atualizar dashboard
  // - Integrar com WhatsApp/Instagram
}

function processLead(data) {
  // Processar novo lead
  console.log('Processando lead:', data);
  
  // Aqui você pode adicionar lógica para:
  // - Criar lead no CRM
  // - Enviar email de boas-vindas
  // - Atribuir ao vendedor
}

function processConversion(data) {
  // Processar conversão
  console.log('Processando conversão:', data);
  
  // Aqui você pode adicionar lógica para:
  // - Atualizar métricas
  // - Enviar relatório
  // - Notificar equipe
}

function processPayment(data) {
  // Processar pagamento
  console.log('Processando pagamento:', data);
  
  // Aqui você pode adicionar lógica para:
  // - Confirmar pagamento
  // - Atualizar status
  // - Enviar recibo
}