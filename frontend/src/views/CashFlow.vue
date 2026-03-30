<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar as CalendarIcon,
  Download,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);

const lineData = {
  labels: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'],
  datasets: [
    {
      label: 'Ingresos',
      data: [45000, 52000, 48000, 61000, 55000, 68000],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#4f46e5',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
    },
    {
      label: 'Gastos',
      data: [32000, 35000, 31000, 38000, 34000, 41000],
      borderColor: '#d2bbff',
      backgroundColor: 'rgba(210, 187, 255, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#d2bbff',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
    }
  ]
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      },
      ticks: {
        color: '#94a3b8',
        font: {
          size: 10,
          weight: 'bold' as const
        },
        callback: (value: any) => `${value / 1000}k €`
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          size: 10,
          weight: 'bold' as const
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      usePointStyle: true,
    }
  }
};

const transactions = [
  { id: 1, type: 'income', client: 'Creative Agency S.A.', amount: '+12.800,00 €', date: 'Hoy, 14:30', status: 'completed', icon: ArrowUpRight, color: 'text-primary', bg: 'bg-primary/20' },
  { id: 2, type: 'expense', client: 'AWS Cloud Services', amount: '-1.240,00 €', date: 'Hoy, 09:15', status: 'completed', icon: ArrowDownRight, color: 'text-error', bg: 'bg-error/20' },
  { id: 3, type: 'income', client: 'TechSolutions Ltd', amount: '+8.200,00 €', date: 'Ayer', status: 'pending', icon: ArrowUpRight, color: 'text-tertiary', bg: 'bg-tertiary/20' },
  { id: 4, type: 'expense', client: 'Marketing Campaign', amount: '-4.500,00 €', date: 'Ayer', status: 'completed', icon: ArrowDownRight, color: 'text-error', bg: 'bg-error/20' },
  { id: 5, type: 'income', client: 'Global Logistics', amount: '+3.450,00 €', date: '12 May, 2024', status: 'completed', icon: ArrowUpRight, color: 'text-primary', bg: 'bg-primary/20' },
];

const stats = [
  { label: 'Balance Total', value: '1,2M €', trend: '+12%', icon: DollarSign, color: 'text-white' },
  { label: 'Ingresos (Mes)', value: '68.000,00 €', trend: '+8%', icon: TrendingUp, color: 'text-primary' },
  { label: 'Gastos (Mes)', value: '41.000,00 €', trend: '+5%', icon: TrendingDown, color: 'text-error' },
];
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-20">
    <!-- Header -->
    <div class="flex justify-between items-end mb-4">
      <div>
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Análisis de Tesorería</p>
        <h2 class="font-headline text-4xl font-bold tracking-tight text-white">Flujo de Caja</h2>
      </div>
      <div class="flex gap-3">
        <button class="glass-panel px-6 py-4 rounded-2xl flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <CalendarIcon :size="20" />
          <span>Últimos 6 Meses</span>
        </button>
        <button class="bg-primary-container text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl">
          <Download :size="20" />
          Descargar Reporte
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(stat, i) in stats" :key="i" class="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-6">
            <div :class="cn('h-12 w-12 rounded-xl flex items-center justify-center bg-white/5', stat.color)">
              <component :is="stat.icon" :size="24" />
            </div>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{{ stat.trend }}</span>
          </div>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <span class="text-3xl font-headline font-bold text-white tracking-tighter">{{ stat.value }}</span>
        </div>
      </div>
    </div>

    <!-- Main Chart -->
    <div class="glass-panel rounded-[2.5rem] p-10 h-[450px] flex flex-col">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h3 class="text-xl font-bold text-white tracking-tight">Evolución de Ingresos vs Gastos</h3>
          <p class="text-xs text-slate-500 mt-1">Comparativa semestral de rendimiento financiero.</p>
        </div>
        <div class="flex gap-6">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary" />
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ingresos</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-tertiary" />
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gastos</span>
          </div>
        </div>
      </div>
      <div class="flex-1 min-h-0">
        <Line :data="lineData" :options="lineOptions" />
      </div>
    </div>

    <!-- Transactions List -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8 space-y-6">
        <div class="flex justify-between items-center px-4">
          <h3 class="text-lg font-bold text-white">Transacciones Recientes</h3>
          <button class="text-primary text-xs font-bold hover:underline">Ver todo el historial</button>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="tx in transactions"
            :key="tx.id"
            class="glass-panel p-6 rounded-3xl flex items-center justify-between hover:bg-white/5 transition-all group border border-white/5"
          >
            <div class="flex items-center gap-5">
              <div :class="cn('h-12 w-12 rounded-2xl flex items-center justify-center', tx.bg)">
                <component :is="tx.icon" :class="tx.color" :size="24" />
              </div>
              <div>
                <p class="font-bold text-white group-hover:text-primary transition-colors">{{ tx.client }}</p>
                <p class="text-xs text-slate-500">{{ tx.date }} • {{ tx.type === 'income' ? 'Cobro de Factura' : 'Pago de Servicio' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="cn('font-headline font-bold', tx.type === 'income' ? 'text-primary' : 'text-error')">{{ tx.amount }}</p>
              <div class="flex items-center justify-end gap-1.5 mt-1">
                <component :is="tx.status === 'completed' ? CheckCircle2 : Clock" :class="cn('w-3 h-3', tx.status === 'completed' ? 'text-primary' : 'text-tertiary')" />
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ tx.status === 'completed' ? 'Completado' : 'Pendiente' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions / Summary -->
      <div class="lg:col-span-4 space-y-6">
        <div class="glass-panel p-8 rounded-[2rem] space-y-8">
          <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-6">Próximos Cobros</h3>
          
          <div class="space-y-6">
            <div v-for="i in 3" :key="i" class="flex gap-4">
              <div class="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                <Clock :size="20" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <p class="text-xs font-bold text-white">Factura #INV-2024-008</p>
                  <span class="text-xs font-bold text-primary">1.200 €</span>
                </div>
                <p class="text-[10px] text-slate-500 mt-1">Vence en 4 días • Creative Agency</p>
                <div class="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                  <div class="bg-primary h-full w-[75%]" />
                </div>
              </div>
            </div>
          </div>

          <button class="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all mt-8">
            <Filter :size="20" />
            Configurar Alertas
          </button>
        </div>

        <div class="glass-panel p-8 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
          <div class="flex items-center gap-3 mb-4">
            <AlertTriangle class="text-primary" :size="20" />
            <h3 class="text-sm font-bold text-white uppercase tracking-widest">Alerta de Liquidez</h3>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Se prevé un pico de gastos para el próximo mes debido a renovaciones de licencias anuales. Considera adelantar algunos cobros pendientes.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
