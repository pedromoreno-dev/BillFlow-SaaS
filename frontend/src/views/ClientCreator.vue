<script setup lang="ts">
import { reactive } from 'vue';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Plus
} from 'lucide-vue-next';
import { useStore } from '../composables/useStore';
import CustomSelect from '../components/CustomSelect.vue';

interface ClientCreatorProps {
  onBack: () => void;
}

const props = defineProps<ClientCreatorProps>();
const store = useStore();

const countryOptions = [
  { value: 'España', label: 'España' },
  { value: 'México', label: 'México' },
  { value: 'Reino Unido', label: 'Reino Unido' },
  { value: 'Alemania', label: 'Alemania' },
  { value: 'Francia', label: 'Francia' },
  { value: 'Estados Unidos', label: 'Estados Unidos' },
];

const paymentTermsOptions = [
  { value: 'due', label: 'Al recibir' },
  { value: 'net15', label: 'Net 15 días' },
  { value: 'net30', label: 'Net 30 días' },
  { value: 'net60', label: 'Net 60 días' },
];

const currencyOptions = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dólar Estadounidense ($)' },
  { value: 'MXN', label: 'Peso Mexicano ($)' },
  { value: 'GBP', label: 'Libra Esterlina (£)' },
];

const client = reactive({
  name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  country: '',
  taxId: '',
  location: '',
  paymentTerms: 'net30',
  currency: 'EUR',
  notes: ''
});

const handleSave = () => {
  if (!client.name || !client.email) {
    alert('Por favor completa los campos requeridos');
    return;
  }

  store.addClient({
    name: client.name,
    email: client.email,
    phone: client.phone,
    location: client.location || `${client.city}, ${client.country}`,
    revenue: 0,
    trend: 'up',
    status: 'active'
  });

  props.onBack();
};
</script>

<template>
  <div class="max-w-5xl mx-auto py-6 pb-20">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 md:mb-10">
      <button 
        @click="onBack"
        class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
        <span class="font-bold text-sm uppercase tracking-widest">Cancelar y Volver</span>
      </button>
      
      <div class="text-right">
        <p class="text-secondary font-semibold tracking-widest text-xs uppercase mb-1">Nueva Relación</p>
        <h2 class="font-headline text-2xl md:text-3xl font-bold tracking-tight text-white">Agregar Cliente</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-4 md:space-y-6">
        <!-- Basic Info -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-6">Información Básica</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Building2 :size="14" />
                Nombre de la Empresa
              </label>
              <input 
                type="text" 
                v-model="client.name"
                placeholder="Ej. Creative Agency S.A."
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText :size="14" />
                Identificación Fiscal (CIF/NIF)
              </label>
              <input 
                type="text" 
                v-model="client.taxId"
                placeholder="Ej. B12345678"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Mail :size="14" />
                Email de Facturación
              </label>
              <input 
                type="email" 
                v-model="client.email"
                placeholder="Ej. billing@agency.com"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Phone :size="14" />
                Teléfono de Contacto
              </label>
              <input 
                type="tel" 
                v-model="client.phone"
                placeholder="Ej. +34 912 345 678"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-6">Ubicación y Dirección</h3>
          
          <div class="space-y-4 md:space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin :size="14" />
                Dirección Fiscal
              </label>
              <input 
                type="text" 
                v-model="client.address"
                placeholder="Calle, número, piso, puerta..."
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ciudad</label>
                <input 
                  type="text" 
                  v-model="client.city"
                  placeholder="Ej. Madrid"
                  class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">País</label>
                <CustomSelect 
                  :options="countryOptions"
                  v-model="client.country"
                  placeholder="Seleccionar país..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Terms -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-6">Condiciones de Pago</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CreditCard :size="14" />
                Plazo de Pago Predeterminado
              </label>
              <CustomSelect 
                :options="paymentTermsOptions"
                v-model="client.paymentTerms"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Globe :size="14" />
                Moneda de Facturación
              </label>
              <CustomSelect 
                :options="currencyOptions"
                v-model="client.currency"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Summary -->
      <div class="space-y-6">
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6 sticky top-24">
          <div class="flex flex-col items-center text-center mb-6 md:mb-8">
            <div class="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 mb-4 group cursor-pointer hover:bg-white/10 transition-all">
              <Plus :size="28" class="group-hover:scale-110 transition-transform" />
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subir Logo / Avatar</p>
          </div>
          
          <div class="space-y-4">
            <button 
              @click="handleSave"
              class="w-full bg-secondary text-surface py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl"
            >
              <Save :size="20" />
              Guardar Cliente
            </button>
            <button class="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
              <User :size="20" />
              Ver Perfil Completo
            </button>
          </div>

          <div class="mt-6 md:mt-8 p-4 bg-primary/10 rounded-2xl border border-primary/20">
            <div class="flex gap-3">
              <Building2 class="text-primary shrink-0" :size="18" />
              <p class="text-[10px] text-primary font-medium leading-relaxed">
                Al guardar este cliente, podrás emitir facturas personalizadas y realizar un seguimiento detallado de su facturación histórica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
