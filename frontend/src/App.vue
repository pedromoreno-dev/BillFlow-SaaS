<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Wallet, 
  Settings as SettingsIcon, 
  Plus, 
  Search, 
  Globe, 
  HelpCircle, 
  Bell,
  LogOut
} from 'lucide-vue-next';
import { cn } from './lib/utils';

// Views
import Dashboard from './views/Dashboard.vue';
import InvoiceCreator from './views/InvoiceCreator.vue';
import ClientGalaxy from './views/ClientGalaxy.vue';
import Settings from './views/Settings.vue';
import CashFlow from './views/CashFlow.vue';
import InvoiceLedger from './views/InvoiceLedger.vue';
import ClientCreator from './views/ClientCreator.vue';
import InvoiceDetail from './views/InvoiceDetail.vue';

type View = 'dashboard' | 'invoices' | 'clients' | 'cashflow' | 'settings' | 'create-invoice' | 'create-client' | 'invoice-detail';

const currentView = ref<View>('dashboard');

const navItems = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'invoices', label: 'Facturas', icon: FileText },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'cashflow', label: 'Flujo de Caja', icon: Wallet },
  { id: 'settings', label: 'Configuración', icon: SettingsIcon },
];

const setView = (view: View) => {
  currentView.value = view;
};

const currentViewComponent = computed(() => {
  switch (currentView.value) {
    case 'dashboard': return Dashboard;
    case 'invoices': return InvoiceLedger;
    case 'clients': return ClientGalaxy;
    case 'cashflow': return CashFlow;
    case 'settings': return Settings;
    case 'create-invoice': return InvoiceCreator;
    case 'create-client': return ClientCreator;
    case 'invoice-detail': return InvoiceDetail;
    default: return Dashboard;
  }
});

const currentViewProps = computed(() => {
  switch (currentView.value) {
    case 'dashboard':
      return {
        onNewClient: () => setView('create-client'),
        onNewInvoice: () => setView('create-invoice'),
        onViewInvoice: () => setView('invoice-detail'),
        onViewAllInvoices: () => setView('invoices')
      };
    case 'invoices':
      return {
        onNewInvoice: () => setView('create-invoice'),
        onViewInvoice: () => setView('invoice-detail')
      };
    case 'clients':
      return {
        onNewClient: () => setView('create-client')
      };
    case 'create-invoice':
      return {
        onBack: () => setView('invoices')
      };
    case 'create-client':
      return {
        onBack: () => setView('clients')
      };
    case 'invoice-detail':
      return {
        onBack: () => setView('invoices')
      };
    default:
      return {};
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/30">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 border-r border-white/10 bg-[#151b2d]/60 backdrop-blur-xl flex flex-col py-6 px-4 z-40 font-headline antialiased tracking-tight">
      <div class="mb-10 px-4">
        <h1 class="text-xl font-bold tracking-tighter text-white">Monto</h1>
        <p class="text-xs text-slate-400 font-medium">SaaS de Facturación</p>
      </div>

      <nav class="space-y-1 flex-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="setView(item.id as View)"
          :class="cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
            currentView === item.id 
              ? 'text-secondary bg-white/5 font-semibold' 
              : 'text-slate-400 hover:text-white hover:bg-white/10 hover:backdrop-blur-lg'
          )"
        >
          <component :is="item.icon" :size="20" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="mt-auto pt-6 border-t border-white/5 space-y-1">
        <button 
          @click="setView('create-invoice')"
          class="w-full bg-primary-container text-white py-3 rounded-xl font-bold text-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-2 mb-4"
        >
          <Plus :size="18" />
          Factura Rápida
        </button>
        
        <button class="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <Globe :size="18" />
          <span class="text-sm">Idioma</span>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <Search :size="18" />
          <span class="text-sm">Buscar</span>
        </button>
        <button v-if="currentView === 'settings'" class="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-error transition-colors">
          <LogOut :size="18" />
          <span class="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <!-- Top Bar -->
      <header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-8 z-30 bg-[#0c1324]/40 backdrop-blur-md border-b border-white/5 font-sans text-sm font-medium">
        <div class="flex items-center gap-4">
          <h2 v-if="currentView === 'settings'" class="text-lg font-bold text-white tracking-tight">Panel de Configuración</h2>
          <div v-else class="relative w-96">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search :size="18" class="text-slate-500" />
            </div>
            <input 
              type="text"
              placeholder="Buscar facturas o clientes..."
              class="w-full bg-surface-container-low/50 rounded-full h-9 pl-10 pr-4 text-on-surface placeholder:text-slate-500 border-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex gap-4">
            <button class="text-slate-400 hover:text-white transition-colors">
              <HelpCircle :size="20" />
            </button>
            <button class="text-slate-400 hover:text-white transition-colors relative">
              <Bell :size="20" />
              <span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
          <div class="h-8 w-px bg-white/10"></div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-xs font-bold text-white">Roberto García</p>
              <p class="text-[10px] text-slate-400">Admin Premium</p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Avatar" 
              class="h-9 w-9 rounded-full border border-primary/20 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <!-- View Container -->
      <main class="mt-16 min-h-[calc(100vh-4rem)] mesh-gradient-bg overflow-x-hidden">
        <div class="p-8">
          <Transition name="fade-slide" mode="out-in">
            <component :is="currentViewComponent" v-bind="currentViewProps" :key="currentView" />
          </Transition>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
