import { ref, computed, watch } from 'vue';
import sampleData from '../data/sample-data.json';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  revenue: number;
  trend: 'up' | 'down';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  clientId?: string;
  client: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
  invoiceId?: string;
  description?: string;
}

export interface Activity {
  id: string;
  text: string;
  time: string;
  color: string;
  createdAt: string;
}

export interface Stats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  totalClients: number;
}

export interface Company {
  name: string;
  taxId: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  invoiceSeries: string;
  defaultTax: number;
}

export interface User {
  name: string;
  role: string;
  avatar: string;
}

const STORAGE_KEY = 'billflow-data';

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }
  return null;
};

const saveToStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

const getInitialData = () => {
  const stored = loadFromStorage();
  if (stored) {
    return stored;
  }
  return sampleData;
};

const state = ref(getInitialData());

watch(state, (newState) => {
  saveToStorage(newState);
}, { deep: true });

const generateId = (prefix: string) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${random}`;
};

export const useStore = () => {
  const clients = computed(() => state.value.clients as Client[]);
  const invoices = computed(() => state.value.invoices as Invoice[]);
  const transactions = computed(() => state.value.transactions as Transaction[]);
  const activities = computed(() => state.value.activities as Activity[]);
  const stats = computed(() => state.value.stats as Stats);
  const company = computed(() => state.value.company as Company);
  const user = computed(() => state.value.user as User);

  const recentInvoices = computed(() => {
    return [...invoices.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  const pendingInvoices = computed(() => {
    return invoices.value.filter(inv => inv.status === 'pending');
  });

  const overdueInvoices = computed(() => {
    const today = new Date();
    return invoices.value.filter(inv => {
      if (inv.status === 'paid') return false;
      return new Date(inv.dueDate) < today;
    }).map(inv => ({ ...inv, status: 'overdue' as const }));
  });

  const getClientById = (id: string) => {
    return clients.value.find(c => c.id === id);
  };

  const getInvoiceById = (id: string) => {
    return invoices.value.find(i => i.id === id);
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId('cli'),
      createdAt: new Date().toISOString().split('T')[0]
    };
    state.value.clients = [...state.value.clients, newClient];
    addActivity(`Cliente ${newClient.name} agregado.`);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const index = state.value.clients.findIndex((c: Client) => c.id === id);
    if (index !== -1) {
      state.value.clients[index] = { ...state.value.clients[index], ...updates };
      addActivity(`Datos de ${state.value.clients[index].name} actualizados.`);
    }
  };

  const deleteClient = (id: string) => {
    const client = getClientById(id);
    state.value.clients = state.value.clients.filter((c: Client) => c.id !== id);
    if (client) {
      addActivity(`Cliente ${client.name} eliminado.`);
    }
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `${company.value.invoiceSeries}${String(invoices.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    state.value.invoices = [...state.value.invoices, newInvoice];
    updateStats();
    addActivity(`Factura ${newInvoice.id} creada por ${newInvoice.total.toLocaleString('es-ES')} €.`);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const index = state.value.invoices.findIndex((i: Invoice) => i.id === id);
    if (index !== -1) {
      state.value.invoices[index] = { ...state.value.invoices[index], ...updates };
      updateStats();
    }
  };

  const deleteInvoice = (id: string) => {
    state.value.invoices = state.value.invoices.filter((i: Invoice) => i.id !== id);
    addActivity(`Factura ${id} eliminada.`);
    updateStats();
  };

  const markInvoiceAsPaid = (id: string) => {
    const invoice = getInvoiceById(id);
    if (invoice) {
      updateInvoice(id, { status: 'paid' });
      addTransaction({
        type: 'income',
        clientId: invoice.clientId,
        client: invoice.clientName,
        amount: invoice.total,
        date: new Date().toISOString(),
        status: 'completed',
        invoiceId: invoice.id
      });
      addActivity(`Factura ${invoice.id} marcada como pagada.`);
      updateStats();
    }
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: generateId('tx')
    };
    state.value.transactions = [newTx, ...state.value.transactions];
    updateStats();
    return newTx;
  };

  const addActivity = (text: string) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary'];
    const newActivity: Activity = {
      id: generateId('act'),
      text,
      time: 'Ahora mismo',
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString()
    };
    state.value.activities = [newActivity, ...state.value.activities.slice(0, 9)];
  };

  const updateStats = () => {
    const totalRevenue = transactions.value
      .filter(tx => tx.type === 'income' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const monthlyRevenue = transactions.value
      .filter(tx => {
        if (tx.type !== 'income' || tx.status !== 'completed') return false;
        const txDate = new Date(tx.date);
        const now = new Date();
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    const pendingAmount = invoices.value
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.total, 0);

    const overdueAmount = invoices.value
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    state.value.stats = {
      ...state.value.stats,
      totalRevenue,
      monthlyRevenue,
      pendingAmount,
      overdueAmount,
      totalClients: clients.value.length
    };
  };

  const updateCompany = (updates: Partial<Company>) => {
    state.value.company = { ...state.value.company, ...updates };
    addActivity('Configuración de empresa actualizada.');
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    state.value = JSON.parse(JSON.stringify(sampleData));
  };

  return {
    clients,
    invoices,
    transactions,
    activities,
    stats,
    company,
    user,
    recentInvoices,
    pendingInvoices,
    overdueInvoices,
    getClientById,
    getInvoiceById,
    addClient,
    updateClient,
    deleteClient,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markInvoiceAsPaid,
    addTransaction,
    addActivity,
    updateCompany,
    resetData
  };
};
