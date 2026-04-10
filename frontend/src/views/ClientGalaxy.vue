<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { useStore } from '../composables/useStore';

interface ClientGalaxyProps {
  onNewClient: () => void;
}

defineProps<ClientGalaxyProps>();

const store = useStore();

const searchQuery = ref('');

const filteredClients = computed(() => {
  if (!searchQuery.value) return store.clients.value;
  
  const query = searchQuery.value.toLowerCase();
  return store.clients.value.filter(client => 
    client.name.toLowerCase().includes(query) ||
    client.email.toLowerCase().includes(query) ||
    client.location.toLowerCase().includes(query)
  );
});

const stats = computed(() => ({
  total: store.clients.value.length,
  revenue: store.clients.value.reduce((sum, c) => sum + c.revenue, 0),
  pending: store.invoices.value.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0)
}));

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k €`;
  }
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-primary/20 text-primary';
    case 'pending': return 'bg-tertiary/20 text-tertiary';
    default: return 'bg-error/20 text-error';
  }
};

const handleDelete = (id: string, event: Event) => {
  event.stopPropagation();
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    store.deleteClient(id);
  }
};
</script>

<template>
  <div class="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2 md:mb-4">
      <div>
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Gestión de Relaciones</p>
        <h2 class="font-headline text-2xl md:text-4xl font-bold tracking-tight text-white">Galaxia de Clientes</h2>
      </div>
      <button 
        @click="onNewClient"
        class="bg-secondary text-surface px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
      >
        <Plus :size="20" />
        Nuevo Cliente
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="glass-panel p-4 md:p-6 rounded-2xl flex items-center gap-4">
        <div class="h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center bg-white/5 text-primary">
          <Users :size="20" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Clientes</p>
          <span class="text-xl font-headline font-bold text-white">{{ stats.total }}</span>
        </div>
      </div>
      <div class="glass-panel p-4 md:p-6 rounded-2xl flex items-center gap-4">
        <div class="h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center bg-white/5 text-secondary">
          <TrendingUp :size="20" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ingresos Totales</p>
          <span class="text-xl font-headline font-bold text-white">{{ formatCurrency(stats.revenue) }}</span>
        </div>
      </div>
      <div class="glass-panel p-4 md:p-6 rounded-2xl flex items-center gap-4">
        <div class="h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center bg-white/5 text-tertiary">
          <Clock :size="20" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pendiente Cobro</p>
          <span class="text-xl font-headline font-bold text-white">{{ formatCurrency(stats.pending) }}</span>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="20" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre, email o ubicación..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>
    </div>

    <!-- Clients Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div 
        v-for="client in filteredClients"
        :key="client.id"
        class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/5 hover:bg-white/5 transition-all group relative overflow-hidden"
      >
        <!-- Background Accent -->
        <div class="absolute -right-10 -top-10 w-24 md:w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4 md:mb-6">
            <div class="h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
              <img 
                v-if="client.avatar"
                :src="client.avatar" 
                :alt="client.name" 
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
              <div v-else class="w-full h-full bg-white/5 flex items-center justify-center text-slate-500">
                <Users :size="24" />
              </div>
            </div>
            <button class="text-slate-600 hover:text-white transition-colors" @click.stop @click="handleDelete(client.id, $event)">
              <Trash2 v-if="$parent" :size="20" />
              <MoreVertical v-else :size="20" />
            </button>
          </div>

          <div class="space-y-3 md:space-y-4">
            <div>
              <h3 class="text-base md:text-xl font-bold text-white group-hover:text-primary transition-colors">{{ client.name }}</h3>
              <div class="flex items-center gap-2 text-slate-500 mt-1">
                <MapPin :size="12" />
                <span class="text-[10px] font-bold uppercase tracking-widest">{{ client.location }}</span>
              </div>
            </div>

            <div class="space-y-1 md:space-y-2">
              <div class="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs md:text-sm">
                <Mail :size="14" />
                <span class="truncate">{{ client.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs md:text-sm">
                <Phone :size="14" />
                <span>{{ client.phone }}</span>
              </div>
            </div>

            <div class="pt-4 md:pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Facturación Total</p>
                <div class="flex items-center gap-2">
                  <span class="text-lg md:text-xl font-headline font-bold text-white">{{ formatCurrency(client.revenue) }}</span>
                  <component :is="client.trend === 'up' ? TrendingUp : TrendingDown" :class="cn('w-4 h-4', client.trend === 'up' ? 'text-primary' : 'text-error')" />
                </div>
              </div>
              <span :class="cn(
                'text-[8px] md:text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest',
                getStatusColor(client.status)
              )">
                {{ client.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredClients.length === 0" class="glass-panel p-12 rounded-[2rem] text-center">
      <p class="text-slate-400 text-lg">No se encontraron clientes</p>
      <p class="text-slate-500 text-sm mt-2">Agrega un nuevo cliente para comenzar</p>
    </div>
  </div>
</template>
