<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-vue-next';
import { cn } from './lib/utils';
import { useStore } from './composables/useStore';

// Views
import Dashboard from './views/Dashboard.vue';
import InvoiceCreator from './views/InvoiceCreator.vue';
import ClientGalaxy from './views/ClientGalaxy.vue';
import Settings from './views/Settings.vue';
import CashFlow from './views/CashFlow.vue';
import InvoiceLedger from './views/InvoiceLedger.vue';
import ClientCreator from './views/ClientCreator.vue';
import InvoiceDetail from './views/InvoiceDetail.vue';

const store = useStore();

type View = 'dashboard' | 'invoices' | 'clients' | 'cashflow' | 'settings' | 'create-invoice' | 'create-client' | 'invoice-detail';

const currentView = ref<View>('dashboard');
const selectedInvoiceId = ref<string | null>(null);
const isMobile = ref(false);
const sidebarCollapsed = ref(false);
const mobileMenuOpen = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
  if (isMobile.value) {
    sidebarCollapsed.value = true;
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const toggleSidebar = () => {
  if (isMobile.value) {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }
};

const navItems = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'invoices', label: 'Facturas', icon: FileText },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'cashflow', label: 'Flujo de Caja', icon: Wallet },
  { id: 'settings', label: 'Configuración', icon: SettingsIcon },
];

const setView = (view: View) => {
  currentView.value = view;
  selectedInvoiceId.value = null;
};

const setViewWithInvoice = (view: View, invoiceId: string) => {
  currentView.value = view;
  selectedInvoiceId.value = invoiceId;
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
        onViewInvoice: (id: string) => setViewWithInvoice('invoice-detail', id),
        onViewAllInvoices: () => setView('invoices')
      };
    case 'invoices':
      return {
        onNewInvoice: () => setView('create-invoice'),
        onViewInvoice: (id: string) => setViewWithInvoice('invoice-detail', id)
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
        onBack: () => setView('invoices'),
        invoiceId: selectedInvoiceId.value
      };
    default:
      return {};
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/30">
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleSidebar"
      class="lg:hidden fixed top-4 left-4 z-50 glass-panel p-2 rounded-xl text-white hover:bg-white/10 transition-all"
    >
      <Menu :size="20" />
    </button>

    <!-- Mobile Overlay -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="mobileMenuOpen = false"
    />

    <!-- Sidebar -->
    <aside 
      :class="cn(
        'fixed top-0 h-full border-r border-white/10 bg-[#151b2d]/60 backdrop-blur-xl flex flex-col py-6 z-40 font-headline antialiased tracking-tight transition-all duration-300',
        isMobile 
          ? mobileMenuOpen ? 'left-0 w-64' : '-left-64 w-64'
          : sidebarCollapsed ? 'left-0 w-16' : 'left-0 w-64'
      )"
    >
      <!-- Toggle Button (Desktop) -->
      <button 
        v-if="!isMobile"
        @click="toggleSidebar"
        class="absolute -right-3 top-20 glass-panel p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all z-50"
      >
        <ChevronLeft v-if="!sidebarCollapsed" :size="16" />
        <ChevronRight v-else :size="16" />
      </button>

      <div :class="cn('mb-10 px-4 transition-all', sidebarCollapsed && !isMobile ? 'px-2 text-center' : '')">
        <h1 :class="cn('font-bold tracking-tighter text-white transition-all', sidebarCollapsed && !isMobile ? 'text-2xl' : 'text-xl')">Monto</h1>
        <p v-if="!sidebarCollapsed || isMobile" class="text-xs text-slate-400 font-medium">SaaS de Facturación</p>
      </div>

      <nav class="space-y-1 flex-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="setView(item.id as View)"
          :class="cn(
            'w-full flex items-center gap-3 py-3 rounded-lg transition-all duration-300',
            sidebarCollapsed && !isMobile 
              ? 'justify-center px-0' 
              : 'px-4',
            currentView === item.id 
              ? 'text-secondary bg-white/5 font-semibold' 
              : 'text-slate-400 hover:text-white hover:bg-white/10 hover:backdrop-blur-lg'
          )"
        >
          <component :is="item.icon" :size="20" />
          <span v-if="!sidebarCollapsed || isMobile">{{ item.label }}</span>
        </button>
      </nav>

      <div class="mt-auto pt-6 border-t border-white/5 space-y-1">
        <button 
          v-if="!sidebarCollapsed || isMobile"
          @click="setView('create-invoice')"
          class="w-full bg-primary-container text-white py-3 rounded-xl font-bold text-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-2 mb-4"
        >
          <Plus :size="18" />
          Factura Rápida
        </button>
        <button 
          v-else
          @click="setView('create-invoice')"
          class="w-full flex justify-center py-3 text-white transition-all"
        >
          <Plus :size="20" class="text-primary" />
        </button>
        
        <button :class="cn(
          'flex items-center gap-3 py-3 text-slate-400 hover:text-white transition-colors',
          sidebarCollapsed && !isMobile ? 'justify-center px-0' : 'px-4'
        )">
          <Globe :size="18" />
          <span v-if="!sidebarCollapsed || isMobile" class="text-sm">Idioma</span>
        </button>
        <button :class="cn(
          'flex items-center gap-3 py-3 text-slate-400 hover:text-white transition-colors',
          sidebarCollapsed && !isMobile ? 'justify-center px-0' : 'px-4'
        )">
          <Search :size="18" />
          <span v-if="!sidebarCollapsed || isMobile" class="text-sm">Buscar</span>
        </button>
        <button v-if="currentView === 'settings'" :class="cn(
          'flex items-center gap-3 py-3 text-slate-400 hover:text-error transition-colors',
          sidebarCollapsed && !isMobile ? 'justify-center px-0' : 'px-4'
        )">
          <LogOut :size="18" />
          <span v-if="!sidebarCollapsed || isMobile" class="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div :class="cn(
      'flex-1 transition-all duration-300',
      isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
    )">
      <!-- Top Bar -->
      <header :class="cn(
        'fixed top-0 h-16 flex justify-between items-center z-30 bg-[#0c1324]/40 backdrop-blur-md border-b border-white/5 font-sans text-sm font-medium transition-all duration-300',
        isMobile ? 'right-0 w-full px-4' : sidebarCollapsed ? 'right-0 w-full px-8' : 'right-0 lg:w-[calc(100%-16rem)] px-8'
      )">
        <div class="flex items-center gap-4">
          <h2 v-if="currentView === 'settings'" class="text-lg font-bold text-white tracking-tight">Panel de Configuración</h2>
          <div v-else :class="cn('relative', isMobile ? 'w-[calc(100vw-140px)]' : 'w-96')">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search :size="18" class="text-slate-500" />
            </div>
            <input 
              type="text"
              :placeholder="isMobile ? 'Buscar...' : 'Buscar facturas o clientes...'"
              class="w-full bg-surface-container-low/50 rounded-full h-9 pl-10 pr-4 text-on-surface placeholder:text-slate-500 border-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div :class="cn('flex items-center gap-4', isMobile ? '' : 'gap-6')">
          <div v-if="!isMobile" class="flex gap-4">
            <button class="text-slate-400 hover:text-white transition-colors">
              <HelpCircle :size="20" />
            </button>
            <button class="text-slate-400 hover:text-white transition-colors relative">
              <Bell :size="20" />
              <span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
          <div v-if="!isMobile" class="h-8 w-px bg-white/10"></div>
          <div class="flex items-center gap-3">
            <div v-if="!isMobile" class="text-right">
              <p class="text-xs font-bold text-white">{{ store.user.value.name }}</p>
              <p class="text-[10px] text-slate-400">{{ store.user.value.role }}</p>
            </div>
            <img 
              :src="store.user.value.avatar" 
              alt="Avatar" 
              :class="cn('rounded-full border border-primary/20 object-cover', isMobile ? 'h-8 w-8' : 'h-9 w-9')"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <!-- View Container -->
      <main class="mt-16 min-h-[calc(100vh-4rem)] mesh-gradient-bg overflow-x-hidden">
        <div :class="cn('transition-all duration-300', isMobile ? 'p-4' : 'p-8')">
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
