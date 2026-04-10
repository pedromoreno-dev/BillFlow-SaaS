<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Printer,
  Mail,
  Trash2
} from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { useStore } from '../composables/useStore';

interface InvoiceLedgerProps {
  onNewInvoice: () => void;
  onViewInvoice: (id: string) => void;
}

defineProps<InvoiceLedgerProps>();

const store = useStore();

const searchQuery = ref('');

const filteredInvoices = computed(() => {
  let invoices = [...store.invoices.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    invoices = invoices.filter(inv => 
      inv.id.toLowerCase().includes(query) ||
      inv.clientName.toLowerCase().includes(query)
    );
  }
  
  return invoices.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const stats = computed(() => ({
  total: store.invoices.value.reduce((sum, inv) => sum + inv.total, 0),
  pending: store.invoices.value.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0),
  overdue: store.invoices.value.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
  paid: store.invoices.value.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
}));

const getInvoiceIcon = (status: string) => {
  switch (status) {
    case 'paid': return CheckCircle2;
    case 'overdue': return AlertTriangle;
    default: return Clock;
  }
};

const getInvoiceColor = (status: string) => {
  switch (status) {
    case 'paid': return 'text-primary';
    case 'overdue': return 'text-error';
    default: return 'text-tertiary';
  }
};

const getInvoiceBg = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-primary/20';
    case 'overdue': return 'bg-error/20';
    default: return 'bg-tertiary/20';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const handleDelete = (id: string, event: Event) => {
  event.stopPropagation();
  if (confirm('¿Estás seguro de eliminar esta factura?')) {
    store.deleteInvoice(id);
  }
};

const handleMarkPaid = (id: string, event: Event) => {
  event.stopPropagation();
  store.markInvoiceAsPaid(id);
};

const pages = [1, 2, 3];
</script>

<template>
  <div class="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2 md:mb-4">
      <div>
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Historial de Facturación</p>
        <h2 class="font-headline text-2xl md:text-4xl font-bold tracking-tight text-white">Libro de Facturas</h2>
      </div>
      <button 
        @click="onNewInvoice"
        class="bg-primary-container text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
      >
        <Plus :size="20" />
        Nueva Factura
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="glass-panel p-4 md:p-6 rounded-2xl">
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Emitido</p>
        <span class="text-lg md:text-xl font-headline font-bold text-white">{{ formatCurrency(stats.total) }}</span>
      </div>
      <div class="glass-panel p-4 md:p-6 rounded-2xl">
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pendiente</p>
        <span class="text-lg md:text-xl font-headline font-bold text-tertiary">{{ formatCurrency(stats.pending) }}</span>
      </div>
      <div class="glass-panel p-4 md:p-6 rounded-2xl">
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Vencido</p>
        <span class="text-lg md:text-xl font-headline font-bold text-error">{{ formatCurrency(stats.overdue) }}</span>
      </div>
      <div class="glass-panel p-4 md:p-6 rounded-2xl">
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pagado (Mes)</p>
        <span class="text-lg md:text-xl font-headline font-bold text-primary">{{ formatCurrency(stats.paid) }}</span>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col md:flex-row gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="20" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por cliente o número de factura..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>
      <div class="flex gap-3">
        <button class="glass-panel px-4 md:px-6 py-3 md:py-4 rounded-2xl flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <Filter :size="20" />
          <span class="hidden sm:inline">Filtros</span>
        </button>
        <button class="glass-panel px-4 md:px-6 py-3 md:py-4 rounded-2xl flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <Download :size="20" />
          <span class="hidden sm:inline">Exportar</span>
        </button>
      </div>
    </div>

    <!-- Invoices List -->
    <div class="space-y-4">
      <div 
        v-for="invoice in filteredInvoices"
        :key="invoice.id"
        @click="onViewInvoice(invoice.id)"
        class="glass-panel p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/5 transition-all group cursor-pointer border border-white/5"
      >
        <div class="flex items-center gap-4 md:gap-6 flex-1 w-full md:w-auto">
          <div :class="cn('h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform', getInvoiceBg(invoice.status))">
            <component :is="getInvoiceIcon(invoice.status)" :class="getInvoiceColor(invoice.status)" :size="24" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 flex-1">
            <div>
              <p class="font-bold text-white group-hover:text-primary transition-colors text-sm md:text-base">{{ invoice.id }}</p>
              <p class="text-[10px] md:text-[10px] text-slate-500 uppercase tracking-widest mt-1">{{ invoice.date }}</p>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-300">{{ invoice.clientName }}</p>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{{ invoice.items.length }} items</p>
            </div>
            <div>
              <p class="text-base md:text-lg font-headline font-bold text-white">{{ formatCurrency(invoice.total) }}</p>
              <span :class="cn(
                'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                getInvoiceBg(invoice.status),
                getInvoiceColor(invoice.status)
              )">
                {{ invoice.status === 'pending' ? 'Pendiente' : invoice.status === 'paid' ? 'Pagado' : 'Vencido' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
          <div class="flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              v-if="invoice.status === 'pending'"
              @click="handleMarkPaid(invoice.id, $event)"
              class="p-2 bg-primary/20 rounded-lg text-primary hover:bg-primary/30 transition-all" 
              title="Marcar como pagada"
            >
              <CheckCircle2 :size="16" />
            </button>
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Descargar PDF" @click.stop>
              <Download :size="16" />
            </button>
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Imprimir" @click.stop>
              <Printer :size="16" />
            </button>
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Enviar por Email" @click.stop>
              <Mail :size="16" />
            </button>
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-error hover:bg-error/10 transition-all" title="Eliminar" @click.stop @click="handleDelete(invoice.id, $event)">
              <Trash2 :size="16" />
            </button>
          </div>
          <button class="text-slate-600 hover:text-white transition-colors md:hidden" @click.stop>
            <MoreVertical :size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredInvoices.length === 0" class="glass-panel p-12 rounded-[2rem] text-center">
      <p class="text-slate-400 text-lg">No se encontraron facturas</p>
      <p class="text-slate-500 text-sm mt-2">Crea una nueva factura para comenzar</p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredInvoices.length > 0" class="flex justify-center mt-8">
      <div class="glass-panel p-2 rounded-2xl flex gap-1">
        <button 
          v-for="(page, i) in pages"
          :key="i"
          :class="cn(
            'h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all',
            page === 1 ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'
          )"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>
