<script setup lang="ts">
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Printer, 
  FileEdit, 
  CheckCircle2, 
  Send
} from 'lucide-vue-next';
import { cn } from '../lib/utils';

interface InvoiceDetailProps {
  onBack: () => void;
}

defineProps<InvoiceDetailProps>();

const timeline = [
  { 
    title: 'Emitida el 24 Oct, 2024', 
    description: 'Por: Administrador de Sistema', 
    icon: FileEdit, 
    color: 'text-primary', 
    bg: 'bg-primary/20' 
  },
  { 
    title: 'Enviada el 25 Oct, 2024', 
    description: 'Visto por el cliente: 25 Oct, 14:30', 
    icon: Send, 
    color: 'text-secondary', 
    bg: 'bg-secondary/20' 
  },
  { 
    title: 'Pagada el 28 Oct, 2024', 
    description: 'Confirmación de transferencia bancaria', 
    icon: CheckCircle2, 
    color: 'text-primary', 
    bg: 'bg-primary/20' 
  },
];
</script>

<template>
  <div class="max-w-7xl mx-auto py-6">
    <button 
      @click="onBack"
      class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-8"
    >
      <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
      <span class="font-bold text-sm uppercase tracking-widest">Volver al Listado</span>
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Left Column - Details -->
      <div class="lg:col-span-7 space-y-10">
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <h2 class="text-5xl font-bold text-white tracking-tight">INV-2024-001</h2>
            <span class="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/30">
              Pagada
            </span>
          </div>
          <p class="text-slate-500 text-sm">Gestiona los detalles y acciones de este comprobante.</p>
        </div>

        <!-- Client Card -->
        <div class="glass-panel p-8 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <div class="h-16 w-16 rounded-2xl overflow-hidden border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150&h=150" 
              alt="Client" 
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Starlight Media Group</h3>
            <p class="text-sm text-slate-400">billing@starlight-media.com</p>
            <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">CIF: B12345678</p>
          </div>
        </div>

        <!-- Timeline -->
        <div class="space-y-6">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Línea de Tiempo</h4>
          <div class="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
            <div v-for="(item, i) in timeline" :key="i" class="flex gap-6 relative z-10">
              <div :class="cn('h-12 w-12 rounded-2xl flex items-center justify-center shrink-0', item.bg)">
                <component :is="item.icon" :class="item.color" :size="20" />
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ item.title }}</p>
                <p class="text-xs text-slate-500">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Financials Summary -->
        <div class="pt-10 border-t border-white/5 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-slate-400 font-medium">Subtotal</span>
            <span class="text-white font-bold">2.450,00 €</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-400 font-medium">IVA (21%)</span>
            <span class="text-white font-bold">514,50 €</span>
          </div>
          <div class="flex justify-between items-end pt-4">
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total del Comprobante</span>
            <span class="text-5xl font-bold text-white tracking-tighter">2.964,50 €</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-4 pt-6">
          <button class="bg-primary-container text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-lg">
            <Download :size="20" />
            Descargar PDF
          </button>
          <button class="bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
            <Mail :size="20" />
            Enviar Email
          </button>
          <button class="bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
            <FileEdit :size="20" />
            Rectificar
          </button>
          <button class="bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
            <Printer :size="20" />
            Imprimir
          </button>
        </div>
      </div>

      <!-- Right Column - Preview -->
      <div class="lg:col-span-5">
        <Transition
          appear
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-x-10"
          enter-to-class="opacity-100 translate-x-0"
        >
          <div class="invoice-paper bg-white text-[#1a1a1a] p-10 rounded-sm shadow-2xl sticky top-24">
            <div class="flex justify-between items-start mb-12">
              <div class="h-12 w-12 bg-primary-container rounded-lg flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div class="text-right">
                <h1 class="text-4xl font-black text-slate-200 tracking-widest uppercase">Factura</h1>
                <p class="text-xs font-bold mt-1"># INV-2024-001</p>
                <p class="text-[10px] text-slate-500">24 Octubre 2024</p>
              </div>
            </div>

            <div class="mb-12">
              <h2 class="text-lg font-black uppercase">Monto Ltd.</h2>
              <p class="text-[10px] text-slate-500">Calle Innovación 42, 28001 Madrid, España</p>
            </div>

            <div class="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Facturado a:</p>
                <p class="text-xs font-bold">Starlight Media Group</p>
                <p class="text-[10px] text-slate-500 leading-relaxed">Avenida de la Galaxia 15<br/>Barcelona, 08001<br/>CIF: B12345678</p>
              </div>
              <div>
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Plazo de pago:</p>
                <p class="text-xs font-bold">Net 30 días</p>
                <p class="text-[10px] text-slate-500 mt-2">Vencimiento: 23 Noviembre 2024</p>
              </div>
            </div>

            <table class="w-full text-left mb-12">
              <thead>
                <tr class="border-b-2 border-slate-900">
                  <th class="py-2 text-[8px] font-black uppercase tracking-widest">Concepto</th>
                  <th class="py-2 text-[8px] font-black uppercase tracking-widest text-center">Cant.</th>
                  <th class="py-2 text-[8px] font-black uppercase tracking-widest text-right">Precio</th>
                  <th class="py-2 text-[8px] font-black uppercase tracking-widest text-right">Importe</th>
                </tr>
              </thead>
              <tbody class="text-[10px]">
                <tr class="border-b border-slate-100">
                  <td class="py-4 pr-4">
                    <p class="font-bold">Desarrollo Web</p>
                    <p class="text-slate-400 text-[8px] mt-1">Implementación de arquitectura Micro-frontend y SSR.</p>
                  </td>
                  <td class="py-4 text-center">1</td>
                  <td class="py-4 text-right">1.850,00 €</td>
                  <td class="py-4 text-right font-bold">1.850,00 €</td>
                </tr>
                <tr class="border-b border-slate-100">
                  <td class="py-4 pr-4">
                    <p class="font-bold">Consultoría UX/UI</p>
                    <p class="text-slate-400 text-[8px] mt-1">Revisión de flujos de usuario y prototipado avanzado.</p>
                  </td>
                  <td class="py-4 text-center">12h</td>
                  <td class="py-4 text-right">50,00 €</td>
                  <td class="py-4 text-right font-bold">600,00 €</td>
                </tr>
              </tbody>
            </table>

            <div class="border-t-2 border-slate-900 pt-4 flex justify-end">
              <div class="text-right">
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                <p class="text-2xl font-black">2.964,50 €</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
