<script setup lang="ts">
import { computed } from 'vue';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Printer, 
  FileEdit, 
  CheckCircle2, 
  Send,
  Clock,
  AlertTriangle
} from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { useStore } from '../composables/useStore';

interface InvoiceDetailProps {
  onBack: () => void;
  invoiceId: string | null;
}

const props = defineProps<InvoiceDetailProps>();
const store = useStore();

const invoice = computed(() => {
  if (!props.invoiceId) return null;
  return store.getInvoiceById(props.invoiceId);
});

const client = computed(() => {
  if (!invoice.value) return null;
  return store.getClientById(invoice.value.clientId);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getStatusBadge = computed(() => {
  if (!invoice.value) return null;
  switch (invoice.value.status) {
    case 'paid':
      return { label: 'Pagada', class: 'bg-primary/20 text-primary border-primary/30' };
    case 'overdue':
      return { label: 'Vencida', class: 'bg-error/20 text-error border-error/30' };
    default:
      return { label: 'Pendiente', class: 'bg-tertiary/20 text-tertiary border-tertiary/30' };
  }
});

const getStatusIcon = computed(() => {
  if (!invoice.value) return Clock;
  switch (invoice.value.status) {
    case 'paid': return CheckCircle2;
    case 'overdue': return AlertTriangle;
    default: return Clock;
  }
});

const timeline = computed(() => {
  if (!invoice.value) return [];
  
  const items = [
    { 
      title: `Emitida el ${formatDate(invoice.value.date)}`, 
      description: 'Factura creada en el sistema',
      icon: FileEdit, 
      color: 'text-primary', 
      bg: 'bg-primary/20' 
    }
  ];

  if (invoice.value.status === 'paid') {
    items.push({ 
      title: 'Pagada', 
      description: 'Pago confirmado',
      icon: CheckCircle2, 
      color: 'text-primary', 
      bg: 'bg-primary/20' 
    });
  } else if (invoice.value.status === 'overdue') {
    items.push({ 
      title: 'Vencida', 
      description: `Fecha de vencimiento: ${formatDate(invoice.value.dueDate)}`,
      icon: AlertTriangle, 
      color: 'text-error', 
      bg: 'bg-error/20' 
    });
  } else {
    items.push({ 
      title: 'Pendiente', 
      description: `Vence el ${formatDate(invoice.value.dueDate)}`,
      icon: Clock, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary/20' 
    });
  }

  return items;
});

const handleMarkPaid = () => {
  if (invoice.value) {
    store.markInvoiceAsPaid(invoice.value.id);
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto py-6">
    <button 
      @click="onBack"
      class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-6 md:mb-8"
    >
      <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
      <span class="font-bold text-sm uppercase tracking-widest">Volver al Listado</span>
    </button>

    <div v-if="!invoice" class="glass-panel p-12 rounded-[2rem] text-center">
      <p class="text-slate-400 text-lg">Factura no encontrada</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
      <!-- Left Column - Details -->
      <div class="lg:col-span-7 space-y-6 md:space-y-10">
        <div class="space-y-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <h2 class="text-3xl md:text-5xl font-bold text-white tracking-tight">{{ invoice.id }}</h2>
            <span :class="cn('px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border', getStatusBadge?.class)">
              {{ getStatusBadge?.label }}
            </span>
          </div>
          <p class="text-slate-500 text-sm">Gestiona los detalles y acciones de este comprobante.</p>
        </div>

        <!-- Client Card -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5 flex items-center gap-4 md:gap-6">
          <div class="h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-2xl overflow-hidden border border-white/10">
            <img 
              v-if="client?.avatar"
              :src="client.avatar" 
              alt="Client" 
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
            <div v-else class="w-full h-full bg-white/5 flex items-center justify-center text-slate-500">
              {{ client?.name?.charAt(0) || 'C' }}
            </div>
          </div>
          <div>
            <h3 class="text-lg md:text-xl font-bold text-white">{{ client?.name || invoice.clientName }}</h3>
            <p class="text-sm text-slate-400">{{ client?.email || 'Email no disponible' }}</p>
            <p v-if="client?.phone" class="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{{ client.phone }}</p>
          </div>
        </div>

        <!-- Timeline -->
        <div class="space-y-6">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Línea de Tiempo</h4>
          <div class="space-y-6 md:space-y-8 relative before:absolute before:left-5 md:before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
            <div v-for="(item, i) in timeline" :key="i" class="flex gap-4 md:gap-6 relative z-10">
              <div :class="cn('h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0', item.bg)">
                <component :is="item.icon" :class="item.color" :size="18" />
              </div>
              <div class="pt-1">
                <p class="text-sm font-bold text-white">{{ item.title }}</p>
                <p class="text-xs text-slate-500">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Conceptos</h4>
          <div class="space-y-3">
            <div v-for="(item, i) in invoice.items" :key="i" class="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
              <div>
                <p class="text-sm font-bold text-white">{{ item.description }}</p>
                <p class="text-xs text-slate-500">{{ item.quantity }} × {{ formatCurrency(item.price) }}</p>
              </div>
              <p class="text-sm font-bold text-white">{{ formatCurrency(item.quantity * item.price) }}</p>
            </div>
          </div>
        </div>

        <!-- Financials Summary -->
        <div class="pt-6 md:pt-10 border-t border-white/5 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-slate-400 font-medium">Subtotal</span>
            <span class="text-white font-bold">{{ formatCurrency(invoice.subtotal) }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-400 font-medium">IVA (21%)</span>
            <span class="text-white font-bold">{{ formatCurrency(invoice.tax) }}</span>
          </div>
          <div class="flex justify-between items-end pt-4">
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total del Comprobante</span>
            <span class="text-3xl md:text-5xl font-bold text-white tracking-tighter">{{ formatCurrency(invoice.total) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <button v-if="invoice.status !== 'paid'" @click="handleMarkPaid" class="bg-primary text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm">
            <CheckCircle2 :size="18" />
            <span class="hidden md:inline">Marcar Pagada</span>
          </button>
          <button class="bg-primary-container text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm">
            <Download :size="18" />
            <span class="hidden md:inline">PDF</span>
          </button>
          <button class="bg-white/5 border border-white/10 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm">
            <Mail :size="18" />
            <span class="hidden md:inline">Email</span>
          </button>
          <button class="bg-white/5 border border-white/10 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm">
            <Printer :size="18" />
            <span class="hidden md:inline">Imprimir</span>
          </button>
        </div>
      </div>

      <!-- Right Column - Preview -->
      <div class="lg:col-span-5">
        <div class="invoice-paper bg-white text-[#1a1a1a] p-6 md:p-10 rounded-sm shadow-2xl sticky top-24">
          <div class="flex justify-between items-start mb-8 md:mb-12">
            <div class="h-10 w-10 md:h-12 md:w-12 bg-primary-container rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl">
              M
            </div>
            <div class="text-right">
              <h1 class="text-2xl md:text-4xl font-black text-slate-200 tracking-widest uppercase">Factura</h1>
              <p class="text-xs font-bold mt-1"># {{ invoice.id }}</p>
              <p class="text-[10px] text-slate-500">{{ formatDate(invoice.date) }}</p>
            </div>
          </div>

          <div class="mb-8 md:mb-12">
            <h2 class="text-base md:text-lg font-black uppercase">Monto</h2>
            <p class="text-[10px] md:text-xs text-slate-500">SaaS de Facturación</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
            <div>
              <p class="text-[8px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Facturado a:</p>
              <p class="text-xs md:text-sm font-bold">{{ client?.name || invoice.clientName }}</p>
              <p class="text-[10px] text-slate-500 leading-relaxed">{{ client?.location || '' }}</p>
            </div>
            <div>
              <p class="text-[8px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Plazo de pago:</p>
              <p class="text-xs md:text-sm font-bold">Net 30 días</p>
              <p class="text-[10px] text-slate-500 mt-2">Vencimiento: {{ formatDate(invoice.dueDate) }}</p>
            </div>
          </div>

          <table class="w-full text-left mb-8 md:mb-12">
            <thead>
              <tr class="border-b-2 border-slate-900">
                <th class="py-2 text-[8px] font-black uppercase tracking-widest">Concepto</th>
                <th class="py-2 text-[8px] font-black uppercase tracking-widest text-center">Cant.</th>
                <th class="py-2 text-[8px] font-black uppercase tracking-widest text-right">Precio</th>
                <th class="py-2 text-[8px] font-black uppercase tracking-widest text-right">Importe</th>
              </tr>
            </thead>
            <tbody class="text-[10px] md:text-[10px]">
              <tr v-for="(item, i) in invoice.items" :key="i" class="border-b border-slate-100">
                <td class="py-3 md:py-4 pr-2 md:pr-4">
                  <p class="font-bold">{{ item.description }}</p>
                </td>
                <td class="py-3 md:py-4 text-center">{{ item.quantity }}</td>
                <td class="py-3 md:py-4 text-right">{{ formatCurrency(item.price) }}</td>
                <td class="py-3 md:py-4 text-right font-bold">{{ formatCurrency(item.quantity * item.price) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="border-t-2 border-slate-900 pt-3 md:pt-4 flex justify-end">
            <div class="text-right">
              <div class="flex justify-between gap-8 text-[10px] md:text-[10px] text-slate-500 mb-1">
                <span>Subtotal:</span>
                <span>{{ formatCurrency(invoice.subtotal) }}</span>
              </div>
              <div class="flex justify-between gap-8 text-[10px] md:text-[10px] text-slate-500 mb-2">
                <span>IVA 21%:</span>
                <span>{{ formatCurrency(invoice.tax) }}</span>
              </div>
              <p class="text-[8px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</p>
              <p class="text-xl md:text-2xl font-black">{{ formatCurrency(invoice.total) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
