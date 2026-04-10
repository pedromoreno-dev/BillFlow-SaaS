<script setup lang="ts">
import { computed } from 'vue';
import { 
  Wallet, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  UserPlus,
  FilePlus
} from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { useStore } from '../composables/useStore';
import { Radar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

interface DashboardProps {
  onNewClient: () => void;
  onNewInvoice: () => void;
  onViewInvoice: (id: string) => void;
  onViewAllInvoices: () => void;
}

const props = defineProps<DashboardProps>();

const store = useStore();

const radarData = computed(() => ({
  labels: ['SOFTWARE', 'NOMINA', 'MARKETING', 'PERSONAL'],
  datasets: [
    {
      label: 'Gastos',
      data: [120, 98, 86, 99],
      backgroundColor: 'rgba(210, 187, 255, 0.4)',
      borderColor: '#d2bbff',
      pointBackgroundColor: '#d2bbff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#d2bbff'
    }
  ]
}));

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      pointLabels: {
        color: '#94a3b8',
        font: {
          size: 10,
          weight: 'bold' as const
        }
      },
      ticks: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

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

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k €`;
  }
  return `${value} €`;
};
</script>

<template>
  <div class="space-y-6 md:space-y-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2 md:mb-4">
      <div>
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Resumen Financiero</p>
        <h2 class="font-headline text-2xl md:text-4xl font-bold tracking-tight text-white">Panel de Control</h2>
      </div>
      <div class="glass-panel px-4 md:px-6 py-3 md:py-4 rounded-2xl flex flex-col items-end">
        <p class="text-slate-400 text-[10px] md:text-xs font-semibold mb-1 uppercase">Ingresos Reales (Mes)</p>
        <p class="text-secondary font-headline text-xl md:text-2xl font-bold">{{ formatCurrency(store.stats.value.monthlyRevenue) }}</p>
      </div>
    </div>

    <!-- Bento Grid -->
    <div class="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 lg:auto-rows-[200px]">
      <!-- Cash Flow Widget -->
      <div class="col-span-12 lg:col-span-8 row-span-2 glass-panel rounded-2xl md:rounded-[2rem] overflow-hidden relative group">
        <div class="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800')] bg-cover" />
        <div class="relative z-10 p-4 md:p-8 h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="p-2 bg-primary/20 rounded-lg">
                <Wallet class="text-primary" :size="20" />
              </div>
              <span class="text-sm font-semibold text-slate-300">Flujo de Caja</span>
            </div>
            <h3 class="font-headline text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter">{{ formatNumber(store.stats.value.totalRevenue) }} <span class="hidden md:inline text-lg font-medium text-slate-500 ml-2">Total Histórico</span></h3>
          </div>
          
          <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mt-4 md:mt-0">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex flex-col">
                  <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pendiente</span>
                  <span class="text-base md:text-lg font-bold text-white">{{ formatCurrency(store.stats.value.pendingAmount) }}</span>
                </div>
                <div class="w-px h-8 bg-white/10 hidden md:block" />
                <div class="flex flex-col">
                  <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Vencido</span>
                  <span class="text-base md:text-lg font-bold text-error">{{ formatCurrency(store.stats.value.overdueAmount) }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="onViewAllInvoices" class="px-3 md:px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white hover:bg-white/10 transition-colors">Ver Ledger</button>
                <button class="px-3 md:px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white hover:bg-white/10 transition-colors hidden md:block">Configurar</button>
              </div>
            </div>
            
            <!-- Simple Bar Chart Visualization -->
            <div class="w-full md:w-64 h-24 md:h-32 flex items-end gap-1.5">
              <div 
                v-for="(h, i) in [40, 60, 50, 90, 45, 80]"
                :key="i" 
                class="flex-1 bg-primary/40 rounded-t-lg transition-all duration-500 hover:bg-primary/60" 
                :style="{ height: `${h}%` }" 
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Radar Chart -->
      <div class="col-span-12 lg:col-span-4 row-span-2 glass-panel rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col">
        <div class="flex justify-between items-center mb-4 md:mb-6">
          <h3 class="text-base md:text-lg font-bold text-white">Categorías de Gastos</h3>
          <button class="text-slate-500 hover:text-white transition-colors">
            <MoreVertical :size="20" />
          </button>
        </div>
        
        <div class="flex-1 min-h-0">
          <Radar :data="radarData" :options="radarOptions" />
        </div>

        <div class="mt-4 md:mt-6 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-400">Mayor Gasto</span>
            <span class="text-xs font-bold text-secondary">Cloud Hosting</span>
          </div>
          <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div class="bg-secondary h-full w-[65%]" />
          </div>
        </div>
      </div>

      <!-- Recent Invoices -->
      <div class="lg:col-span-9 lg:row-span-2 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-base md:text-lg font-bold text-white">Facturas Recientes</h3>
          <button 
            @click="onViewAllInvoices"
            class="text-primary text-xs font-bold hover:underline"
          >
            Ver todo
          </button>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="invoice in store.recentInvoices.value"
            :key="invoice.id"
            @click="onViewInvoice(invoice.id)"
            class="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-4">
              <div :class="cn('h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center', getInvoiceBg(invoice.status))">
                <component :is="getInvoiceIcon(invoice.status)" :class="getInvoiceColor(invoice.status)" :size="20" />
              </div>
              <div>
                <p class="font-bold text-white group-hover:text-primary transition-colors text-sm md:text-base">{{ invoice.id }} - {{ invoice.clientName }}</p>
                <p class="text-[10px] md:text-xs text-slate-500">{{ invoice.date }} • {{ invoice.items[0]?.description }}</p>
              </div>
            </div>
            <div class="text-right ml-14 md:ml-0">
              <p class="font-headline font-bold text-white">{{ formatCurrency(invoice.total) }}</p>
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
      </div>

      <!-- Activity Feed -->
      <div class="lg:col-span-3 lg:row-span-2 glass-panel rounded-2xl md:rounded-[2rem] p-4 md:p-8 mt-4 md:mt-0">
        <h3 class="text-sm font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">Actividad</h3>
        <div class="space-y-4 md:space-y-6">
          <div v-for="(item, i) in store.activities.value.slice(0, 3)" :key="item.id" class="flex gap-4">
            <div :class="cn('w-1 h-6 md:h-8 rounded-full mt-1', item.color + '/20')" />
            <div>
              <p class="text-[11px] md:text-xs text-on-surface leading-snug">{{ item.text }}</p>
              <p class="text-[10px] text-slate-500 mt-1">{{ item.time }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 md:mt-12 bg-surface-container-highest/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
          <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Próximo Vencimiento</p>
          <p class="text-xs md:text-sm font-bold text-white">Revisar facturas pendientes</p>
          <p class="text-[10px] text-slate-500">{{ store.pendingInvoices.value.length }} facturas por cobrar</p>
        </div>
      </div>
    </div>

    <!-- Floating Actions -->
    <div class="fixed bottom-4 right-4 md:bottom-10 md:right-10 flex flex-col gap-3 md:gap-4 z-30">
      <button 
        @click="onNewClient"
        class="flex items-center gap-2 md:gap-3 bg-secondary text-surface py-3 px-4 md:py-4 md:px-6 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform active:scale-95 text-sm md:text-base"
      >
        <UserPlus :size="18" />
        <span class="hidden sm:inline">Agregar Cliente</span>
      </button>
      <button 
        @click="onNewInvoice"
        class="flex items-center gap-2 md:gap-3 bg-primary-container text-white py-3 px-5 md:py-4 md:px-8 rounded-full font-bold shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] hover:scale-105 transition-transform active:scale-95 text-sm md:text-base"
      >
        <FilePlus :size="18" />
        <span class="hidden sm:inline">Nueva Factura</span>
      </button>
    </div>
  </div>
</template>
