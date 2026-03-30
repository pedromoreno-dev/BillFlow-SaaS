<script setup lang="ts">
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

interface InvoiceLedgerProps {
  onNewInvoice: () => void;
  onViewInvoice: (id: string) => void;
}

defineProps<InvoiceLedgerProps>();

const invoices = [
  { id: 'INV-2024-001', client: 'Creative Agency S.A.', date: '14 May, 2024', amount: '12.800,00 €', status: 'pending', icon: Clock, color: 'text-tertiary', bg: 'bg-tertiary/20' },
  { id: 'INV-2024-002', client: 'TechSolutions Ltd', date: '12 May, 2024', amount: '8.200,00 €', status: 'paid', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/20' },
  { id: 'INV-2024-003', client: 'Global Logistics', date: '10 May, 2024', amount: '3.450,00 €', status: 'overdue', icon: AlertTriangle, color: 'text-error', bg: 'bg-error/20' },
  { id: 'INV-2023-998', client: 'Design Studio 42', date: '28 Abr, 2024', amount: '12.800,00 €', status: 'paid', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/20' },
  { id: 'INV-2023-997', client: 'EcoFriendly Corp', date: '25 Abr, 2024', amount: '3.450,00 €', status: 'paid', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/20' },
  { id: 'INV-2023-996', client: 'Amazon MX', date: '20 Abr, 2024', amount: '45.200,00 €', status: 'pending', icon: Clock, color: 'text-tertiary', bg: 'bg-tertiary/20' },
];

const stats = [
  { label: 'Total Emitido', value: '452.800,00 €', color: 'text-white' },
  { label: 'Pendiente Cobro', value: '124.500,00 €', color: 'text-tertiary' },
  { label: 'Vencido', value: '8.200,00 €', color: 'text-error' },
  { label: 'Pagado (Mes)', value: '45.200,00 €', color: 'text-primary' },
];

const pages = [1, 2, 3, '...', 12];
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-20">
    <!-- Header -->
    <div class="flex justify-between items-end mb-4">
      <div>
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Historial de Facturación</p>
        <h2 class="font-headline text-4xl font-bold tracking-tight text-white">Libro de Facturas</h2>
      </div>
      <button 
        @click="onNewInvoice"
        class="bg-primary-container text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
      >
        <Plus :size="20" />
        Nueva Factura
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="(stat, i) in stats" :key="i" class="glass-panel p-6 rounded-2xl">
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ stat.label }}</p>
        <span :class="cn('text-xl font-headline font-bold', stat.color)">{{ stat.value }}</span>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="20" />
        <input 
          type="text" 
          placeholder="Buscar por cliente, número de factura o monto..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>
      <div class="flex gap-3">
        <button class="glass-panel px-6 py-4 rounded-2xl flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <Filter :size="20" />
          <span>Filtros</span>
        </button>
        <button class="glass-panel px-6 py-4 rounded-2xl flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <Download :size="20" />
          <span>Exportar</span>
        </button>
      </div>
    </div>

    <!-- Invoices List -->
    <div class="space-y-4">
      <div 
        v-for="invoice in invoices"
        :key="invoice.id"
        @click="onViewInvoice(invoice.id)"
        class="glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer border border-white/5"
      >
        <div class="flex items-center gap-6 flex-1">
          <div :class="cn('h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform', invoice.bg)">
            <component :is="invoice.icon" :class="invoice.color" :size="28" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
            <div>
              <p class="font-bold text-white group-hover:text-primary transition-colors">{{ invoice.id }}</p>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{{ invoice.date }}</p>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-300">{{ invoice.client }}</p>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Cliente Premium</p>
            </div>
            <div>
              <p class="text-lg font-headline font-bold text-white">{{ invoice.amount }}</p>
              <span :class="cn(
                'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                invoice.bg,
                invoice.color
              )">
                {{ invoice.status === 'pending' ? 'Pendiente' : invoice.status === 'paid' ? 'Pagado' : 'Vencido' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 ml-8">
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Descargar PDF" @click.stop>
              <Download :size="16" />
            </button>
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Imprimir" @click.stop>
              <Printer :size="16" />
            </button>
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Enviar por Email" @click.stop>
              <Mail :size="16" />
            </button>
            <button class="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-error hover:bg-error/10 transition-all" title="Eliminar" @click.stop>
              <Trash2 :size="16" />
            </button>
          </div>
          <div class="h-8 w-px bg-white/10 mx-2" />
          <button class="text-slate-600 hover:text-white transition-colors" @click.stop>
            <MoreVertical :size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination Placeholder -->
    <div class="flex justify-center mt-12">
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
