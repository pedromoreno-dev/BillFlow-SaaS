<script setup lang="ts">
import { ref } from 'vue';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-vue-next';
import { cn } from '../lib/utils';

interface ClientGalaxyProps {
  onNewClient: () => void;
}

defineProps<ClientGalaxyProps>();

const clients = [
  { id: 1, name: 'Creative Agency S.A.', email: 'billing@creative-agency.com', phone: '+34 912 345 678', location: 'Madrid, ES', revenue: '45.200,00 €', trend: 'up', status: 'active', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 2, name: 'TechSolutions Ltd', email: 'finance@techsolutions.com', phone: '+44 20 7123 4567', location: 'London, UK', revenue: '124.500,00 €', trend: 'up', status: 'active', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 3, name: 'Global Logistics', email: 'accounts@global-logistics.com', phone: '+34 934 567 890', location: 'Barcelona, ES', revenue: '8.200,00 €', trend: 'down', status: 'pending', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 4, name: 'EcoFriendly Corp', email: 'billing@ecofriendly.com', phone: '+49 30 1234567', location: 'Berlin, DE', revenue: '32.800,00 €', trend: 'up', status: 'active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 5, name: 'Starlight Media', email: 'finance@starlight.com', phone: '+34 912 888 999', location: 'Madrid, ES', revenue: '12.800,00 €', trend: 'down', status: 'inactive', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 6, name: 'Amazon MX', email: 'billing-mx@amazon.com', phone: '+52 55 1234 5678', location: 'CDMX, MX', revenue: '2.4M €', trend: 'up', status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
];

const stats = [
  { label: 'Total Clientes', value: '124', icon: Users, color: 'text-primary' },
  { label: 'Ingresos Totales', value: '4.2M €', icon: TrendingUp, color: 'text-secondary' },
  { label: 'Pendiente Cobro', value: '124.5k €', icon: Clock, color: 'text-tertiary' },
];
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-20">
    <!-- Header -->
    <div class="flex justify-between items-end mb-4">
      <div>
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Gestión de Relaciones</p>
        <h2 class="font-headline text-4xl font-bold tracking-tight text-white">Galaxia de Clientes</h2>
      </div>
      <button 
        @click="onNewClient"
        class="bg-secondary text-surface px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
      >
        <Plus :size="20" />
        Nuevo Cliente
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(stat, i) in stats" :key="i" class="glass-panel p-6 rounded-2xl flex items-center gap-5">
        <div :class="cn('h-12 w-12 rounded-xl flex items-center justify-center bg-white/5', stat.color)">
          <component :is="stat.icon" :size="24" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <span class="text-xl font-headline font-bold text-white">{{ stat.value }}</span>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="20" />
        <input 
          type="text" 
          placeholder="Buscar por nombre, email o ubicación..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>
    </div>

    <!-- Clients Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="client in clients"
        :key="client.id"
        class="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:bg-white/5 transition-all group relative overflow-hidden"
      >
        <!-- Background Accent -->
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-6">
            <div class="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
              <img 
                :src="client.avatar" 
                :alt="client.name" 
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
            <button class="text-slate-600 hover:text-white transition-colors">
              <MoreVertical :size="20" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-primary transition-colors">{{ client.name }}</h3>
              <div class="flex items-center gap-2 text-slate-500 mt-1">
                <MapPin :size="12" />
                <span class="text-[10px] font-bold uppercase tracking-widest">{{ client.location }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Mail :size="14" />
                <span class="text-xs">{{ client.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Phone :size="14" />
                <span class="text-xs">{{ client.phone }}</span>
              </div>
            </div>

            <div class="pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Facturación Total</p>
                <div class="flex items-center gap-2">
                  <span class="text-xl font-headline font-bold text-white">{{ client.revenue }}</span>
                  <component :is="client.trend === 'up' ? TrendingUp : TrendingDown" :class="cn('w-4 h-4', client.trend === 'up' ? 'text-primary' : 'text-error')" />
                </div>
              </div>
              <span :class="cn(
                'text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest',
                client.status === 'active' ? 'bg-primary/20 text-primary' : client.status === 'pending' ? 'bg-tertiary/20 text-tertiary' : 'bg-error/20 text-error'
              )">
                {{ client.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
