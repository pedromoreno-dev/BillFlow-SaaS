<script setup lang="ts">
import { ref } from 'vue';
import { 
  Building, 
  Bell, 
  Plus,
  MoreVertical,
  Link2,
  RefreshCw,
  UserPlus
} from 'lucide-vue-next';
import { cn } from '../lib/utils';
import CustomSelect from '../components/CustomSelect.vue';

const notifications = ref({
  payment: true,
  monthly: false
});

const language = ref('es');
const timezone = ref('europe-madrid');

const languages = [
  { value: 'es', label: 'Español (ES)' },
  { value: 'en', label: 'English (US)' },
  { value: 'fr', label: 'Français (FR)' },
];

const timezones = [
  { value: 'europe-madrid', label: '(GMT+01:00) Madrid, España' },
  { value: 'europe-london', label: '(GMT+00:00) London, UK' },
  { value: 'america-new_york', label: '(GMT-05:00) New York, USA' },
];

const integrations = [
  { name: 'Stripe', status: 'CONECTADO', active: true, icon: 'https://cdn.brandfetch.io/stripe.com/fallback/lettermark/theme/dark/h/512/w/512/v/1667504513511' },
  { name: 'Banco Santander', status: 'DESCONECTADO', active: false, icon: 'https://cdn.brandfetch.io/santander.com/fallback/lettermark/theme/dark/h/512/w/512/v/1667504513511' },
  { name: 'PayPal Business', status: 'ACTIVO', active: true, icon: 'https://cdn.brandfetch.io/paypal.com/fallback/lettermark/theme/dark/h/512/w/512/v/1667504513511' },
  { name: 'Holded API', status: 'SINCRONIZANDO', active: 'sync', icon: 'https://cdn.brandfetch.io/holded.com/fallback/lettermark/theme/dark/h/512/w/512/v/1667504513511' },
];

const team = [
  { name: 'Elena Martínez', role: 'Administrador', isMe: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Javier Ruiz', role: 'Editor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'invitacion@monto.es', role: 'Pendiente...', isPending: true },
];

const toggleNotification = (type: 'payment' | 'monthly') => {
  notifications.value[type] = !notifications.value[type];
};
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-10">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div>
        <p class="text-slate-500 font-black tracking-widest text-[10px] uppercase mb-1">Sistema</p>
        <h2 class="font-headline text-5xl font-bold tracking-tight text-white">Configuración del Sistema</h2>
      </div>
      <div class="flex gap-4">
        <button class="px-8 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Descartar
        </button>
        <button class="bg-primary-container text-white px-8 py-3 rounded-xl font-bold text-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:brightness-110 transition-all">
          Guardar cambios
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column - Company Profile -->
      <div class="lg:col-span-8 glass-panel rounded-[2rem] p-10 relative overflow-hidden group">
        <div class="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <Building :size="120" />
        </div>
        
        <div class="relative z-10 space-y-10">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">Perfil de Empresa</h3>
            <p class="text-slate-500 text-sm">Información fiscal y de contacto legal.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Razón Social</label>
              <input 
                type="text" 
                value="Innovación Digital S.L."
                class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">NIF / CIF</label>
              <input 
                type="text" 
                value="B87654321"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dirección Fiscal</label>
            <input 
              type="text" 
              value="Paseo de la Castellana 259"
              class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ciudad</label>
              <input 
                type="text" 
                value="Madrid"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Código Postal</label>
              <input 
                type="text" 
                value="28046"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">País</label>
              <input 
                type="text" 
                value="España"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Billing & Regional -->
      <div class="lg:col-span-4 glass-panel rounded-[2rem] p-10 space-y-8 relative z-20">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">Facturación</h3>
            <p class="text-slate-500 text-sm">Parámetros por defecto.</p>
          </div>
          <button class="bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/30">
            Plan Premium Activo
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/5 rounded-xl text-slate-400">
                <span class="font-bold text-lg">%</span>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">IVA Predeterminado</p>
                <p class="text-white font-bold">21%</p>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-4">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Serie de Facturas</label>
            <input 
              type="text" 
              value="INV-2024-"
              class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
            />
          </div>

          <div class="h-px bg-white/5 my-4"></div>

          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Idioma de la Interfaz</label>
              <CustomSelect 
                :options="languages"
                v-model="language"
              />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zona Horaria</label>
              <CustomSelect 
                :options="timezones"
                v-model="timezone"
              />
            </div>
          </div>

          <button class="w-full flex items-center justify-between text-slate-400 hover:text-white transition-colors pt-4 group">
            <span class="text-sm font-bold">Gestionar plazos de pago</span>
            <Plus :size="18" class="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      <!-- Middle Row - Integrations -->
      <div class="lg:col-span-8 glass-panel rounded-[2rem] p-10 space-y-8 relative z-10">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">Pasarelas e Integraciones</h3>
            <p class="text-slate-500 text-sm">Conecta tus servicios financieros.</p>
          </div>
          <button class="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            Ver todas
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in integrations" :key="item.name" class="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center p-2">
                <img :src="item.icon" :alt="item.name" class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ item.name }}</p>
                <p :class="cn(
                  'text-[8px] font-black tracking-widest uppercase',
                  item.active === true ? 'text-primary' : item.active === 'sync' ? 'text-tertiary' : 'text-slate-500'
                )">
                  {{ item.status }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div v-if="item.active === true" class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(195,192,255,0.8)]" />
              <RefreshCw v-else-if="item.active === 'sync'" :size="14" class="text-tertiary animate-spin" />
              <Link2 v-else :size="14" class="text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Row - Team Management -->
      <div class="lg:col-span-4 glass-panel rounded-[2rem] p-10 space-y-8 relative z-10">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">Gestión de Equipo</h3>
            <p class="text-slate-500 text-sm">Roles y accesos.</p>
          </div>
          <button class="p-2 bg-primary/20 text-primary rounded-xl hover:scale-110 transition-transform">
            <UserPlus :size="20" />
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="member in team" :key="member.name" class="flex items-center justify-between group">
            <div class="flex items-center gap-4">
              <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-10 w-10 rounded-xl object-cover border border-white/10" />
              <div v-else class="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                <Plus :size="18" />
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ member.name }}</p>
                <p class="text-[10px] text-slate-500 font-medium">{{ member.role }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="member.isMe" class="text-[8px] font-black bg-white/10 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-widest">Tú</span>
              <button v-if="member.isPending" class="text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Reenviar</button>
              <button v-if="!member.isMe && !member.isPending" class="text-slate-600 hover:text-white transition-colors">
                <MoreVertical :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row - Notifications -->
      <div class="lg:col-span-12 glass-panel rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex items-center gap-6">
          <div class="h-14 w-14 bg-tertiary/20 text-tertiary rounded-2xl flex items-center justify-center">
            <Bell :size="24" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Preferencias de Notificaciones</h3>
            <p class="text-sm text-slate-500">Recibe alertas críticas de cobros y facturas vencidas directamente en tu email.</p>
          </div>
        </div>

        <div class="flex items-center gap-12">
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-white">Alertas de Pago</span>
            <button 
              @click="toggleNotification('payment')"
              :class="cn(
                'w-12 h-6 rounded-full relative transition-all duration-300',
                notifications.payment ? 'bg-primary' : 'bg-white/10'
              )"
            >
              <div :class="cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300',
                notifications.payment ? 'left-7' : 'left-1'
              )" />
            </button>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-white">Resumen Mensual</span>
            <button 
              @click="toggleNotification('monthly')"
              :class="cn(
                'w-12 h-6 rounded-full relative transition-all duration-300',
                notifications.monthly ? 'bg-primary' : 'bg-white/10'
              )"
            >
              <div :class="cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300',
                notifications.monthly ? 'left-7' : 'left-1'
              )" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Status -->
    <div class="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 font-bold uppercase tracking-widest gap-4 border-t border-white/5">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-1.5 rounded-full bg-primary" />
        <span>Último cambio realizado por Elena Martínez hace 12 minutos</span>
      </div>
      <div class="flex items-center gap-8">
        <span>IP de acceso: 192.168.1.144 (Madrid, ES)</span>
        <button class="hover:text-white transition-colors">Ver registro de auditoría completo</button>
      </div>
    </div>
  </div>
</template>
