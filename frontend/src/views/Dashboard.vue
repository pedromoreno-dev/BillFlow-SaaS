<script setup lang="ts">
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

defineProps<DashboardProps>();

const radarData = {
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
};

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

const recentInvoices = [
  { id: 'Inv-2024-001', client: 'Creative Agency S.A.', date: '14 de Mayo, 2024', service: 'Servicios UX/UI', amount: '12.800,00 €', status: 'pending', icon: Clock, color: 'text-tertiary', bg: 'bg-tertiary/20' },
  { id: 'Inv-2024-002', client: 'TechSolutions Ltd', date: '12 de Mayo, 2024', service: 'Licencias Anuales', amount: '8.200,00 €', status: 'paid', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/20' },
  { id: 'Inv-2023-998', client: 'Global Logistics', date: '28 de Abril, 2024', service: 'Consultoría Estratégica', amount: '8.200,00 €', status: 'overdue', icon: AlertTriangle, color: 'text-error', bg: 'bg-error/20' },
];

const activity = [
  { text: 'Cliente Amazon MX agregado.', time: 'Hace 2 horas', color: 'bg-primary' },
  { text: 'Factura #992 descargada como PDF.', time: 'Hace 5 horas', color: 'bg-secondary' },
  { text: 'Cambio de RFC detectado en perfil.', time: 'Ayer', color: 'bg-tertiary' },
];
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-end mb-4">
      <div>
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Resumen Financiero</p>
        <h2 class="font-headline text-4xl font-bold tracking-tight text-white">Panel de Control</h2>
      </div>
      <div class="glass-panel px-6 py-4 rounded-2xl flex flex-col items-end">
        <p class="text-slate-400 text-xs font-semibold mb-1 uppercase">Ingresos Reales (Mes)</p>
        <p class="text-secondary font-headline text-2xl font-bold">124.500,00 <span class="text-xs text-secondary/70 ml-1">€</span></p>
      </div>
    </div>

    <!-- Bento Grid -->
    <div class="grid grid-cols-12 gap-6 auto-rows-[200px]">
      <!-- Cash Flow Widget -->
      <div class="col-span-12 lg:col-span-8 row-span-2 glass-panel rounded-[2rem] overflow-hidden relative group">
        <div class="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800')] bg-cover" />
        <div class="relative z-10 p-8 h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="p-2 bg-primary/20 rounded-lg">
                <Wallet class="text-primary" :size="20" />
              </div>
              <span class="text-sm font-semibold text-slate-300">Flujo de Caja</span>
            </div>
            <h3 class="font-headline text-6xl font-extrabold text-white tracking-tighter">4,2M € <span class="text-lg font-medium text-slate-500 ml-2">Total Histórico</span></h3>
          </div>
          
          <div class="flex items-end justify-between">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex flex-col">
                  <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Retención</span>
                  <span class="text-lg font-bold text-white">21% IVA</span>
                </div>
                <div class="w-px h-8 bg-white/10" />
                <div class="flex flex-col">
                  <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tasa Media</span>
                  <span class="text-lg font-bold text-white">21% IVA</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white hover:bg-white/10 transition-colors">Exportar Ledger</button>
                <button class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white hover:bg-white/10 transition-colors">Configurar Alertas</button>
              </div>
            </div>
            
            <!-- Simple Bar Chart Visualization -->
            <div class="w-64 h-32 flex items-end gap-1.5">
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
      <div class="col-span-12 lg:col-span-4 row-span-2 glass-panel rounded-[2rem] p-8 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-white">Categorías de Gastos</h3>
          <button class="text-slate-500 hover:text-white transition-colors">
            <MoreVertical :size="20" />
          </button>
        </div>
        
        <div class="flex-1 min-h-0">
          <Radar :data="radarData" :options="radarOptions" />
        </div>

        <div class="mt-6 space-y-3">
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
      <div class="col-span-12 lg:col-span-9 row-span-2 space-y-4">
        <div class="flex justify-between items-center px-4">
          <h3 class="text-lg font-bold text-white">Facturas Recientes</h3>
          <button 
            @click="onViewAllInvoices"
            class="text-primary text-xs font-bold hover:underline"
          >
            Ver todo el historial
          </button>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="invoice in recentInvoices"
            :key="invoice.id"
            @click="onViewInvoice(invoice.id)"
            class="glass-panel p-6 rounded-3xl flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-5">
              <div :class="cn('h-12 w-12 rounded-2xl flex items-center justify-center', invoice.bg)">
                <component :is="invoice.icon" :class="invoice.color" :size="24" />
              </div>
              <div>
                <p class="font-bold text-white group-hover:text-primary transition-colors">{{ invoice.id }} - {{ invoice.client }}</p>
                <p class="text-xs text-slate-500">{{ invoice.date }} • {{ invoice.service }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-headline font-bold text-white">{{ invoice.amount }}</p>
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
      </div>

      <!-- Activity Feed -->
      <div class="col-span-12 lg:col-span-3 row-span-2 glass-panel rounded-[2rem] p-8">
        <h3 class="text-sm font-bold text-white mb-6 uppercase tracking-widest">Actividad</h3>
        <div class="space-y-6">
          <div v-for="(item, i) in activity" :key="i" class="flex gap-4">
            <div :class="cn('w-1 h-8 rounded-full mt-1', item.color + '/20')" />
            <div>
              <p class="text-xs text-on-surface leading-snug">{{ item.text }}</p>
              <p class="text-[10px] text-slate-500 mt-1">{{ item.time }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-12 bg-surface-container-highest/50 p-4 rounded-2xl border border-white/5">
          <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Próximo Vencimiento</p>
          <p class="text-sm font-bold text-white">Plazo de Pago: 48h</p>
          <p class="text-xs text-slate-500">Factura #1004 - 1.200,00 €</p>
        </div>
      </div>
    </div>

    <!-- Floating Actions -->
    <div class="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
      <button 
        @click="onNewClient"
        class="flex items-center gap-3 bg-secondary text-surface py-4 px-6 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform active:scale-95"
      >
        <UserPlus :size="20" />
        Agregar Cliente
      </button>
      <button 
        @click="onNewInvoice"
        class="flex items-center gap-3 bg-primary-container text-white py-4 px-8 rounded-full font-bold shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] hover:scale-105 transition-transform active:scale-95"
      >
        <FilePlus :size="20" />
        Nueva Factura
      </button>
    </div>
  </div>
</template>
