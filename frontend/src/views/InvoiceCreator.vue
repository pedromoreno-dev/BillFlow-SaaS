<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  FileText,
  User,
  Calendar as CalendarIcon,
  Euro
} from 'lucide-vue-next';
import { useStore } from '../composables/useStore';
import CustomSelect from '../components/CustomSelect.vue';

interface InvoiceCreatorProps {
  onBack: () => void;
}

const props = defineProps<InvoiceCreatorProps>();
const store = useStore();

const clientOptions = computed(() => 
  store.clients.value.map(c => ({ value: c.id, label: c.name }))
);

const invoice = reactive({
  clientId: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [
    { description: '', quantity: 1, price: 0 }
  ],
  notes: ''
});

const addItem = () => {
  invoice.items.push({
    description: '',
    quantity: 1,
    price: 0
  });
};

const removeItem = (index: number) => {
  if (invoice.items.length > 1) {
    invoice.items.splice(index, 1);
  }
};

const subtotal = computed(() => {
  return invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
});

const tax = computed(() => subtotal.value * (store.company.value.defaultTax / 100));
const total = computed(() => subtotal.value + tax.value);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const handleSave = () => {
  if (!invoice.clientId || !invoice.items[0].description) {
    alert('Por favor completa los campos requeridos');
    return;
  }

  const client = store.getClientById(invoice.clientId);
  
  store.addInvoice({
    clientId: invoice.clientId,
    clientName: client?.name || 'Cliente',
    date: invoice.date,
    dueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: invoice.items,
    subtotal: subtotal.value,
    tax: tax.value,
    total: total.value,
    status: 'pending'
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
        <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-1">Nueva Emisión</p>
        <h2 class="font-headline text-2xl md:text-3xl font-bold tracking-tight text-white">Crear Factura</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-4 md:space-y-6">
        <!-- Client & Date -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User :size="14" />
                Seleccionar Cliente
              </label>
              <CustomSelect 
                :options="clientOptions"
                v-model="invoice.clientId"
                placeholder="Elegir un cliente..."
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarIcon :size="14" />
                Fecha de Emisión
              </label>
              <input 
                type="date" 
                v-model="invoice.date"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold text-white uppercase tracking-widest">Conceptos de Factura</h3>
            <button 
              @click="addItem"
              class="flex items-center gap-2 text-primary text-xs font-bold hover:underline"
            >
              <Plus :size="16" />
              Añadir Línea
            </button>
          </div>

          <div class="space-y-4">
            <div 
              v-for="(item, index) in invoice.items" 
              :key="index"
              class="grid grid-cols-12 gap-2 md:gap-4 items-end group"
            >
              <div class="col-span-12 md:col-span-6 space-y-2">
                <label v-if="index === 0" class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descripción</label>
                <input 
                  type="text" 
                  v-model="item.description"
                  placeholder="Ej. Desarrollo Web Frontend"
                  class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div class="col-span-4 md:col-span-2 space-y-2">
                <label v-if="index === 0" class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cant.</label>
                <input 
                  type="number" 
                  v-model.number="item.quantity"
                  min="1"
                  class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all text-center"
                />
              </div>
              <div class="col-span-6 md:col-span-3 space-y-2">
                <label v-if="index === 0" class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precio (€)</label>
                <input 
                  type="number" 
                  v-model.number="item.price"
                  min="0"
                  step="0.01"
                  class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all text-right"
                />
              </div>
              <div class="col-span-2 md:col-span-1 pb-3">
                <button 
                  @click="removeItem(index)"
                  class="text-slate-600 hover:text-error transition-colors p-1"
                  :disabled="invoice.items.length === 1"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-4">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas Adicionales / Términos</label>
          <textarea 
            v-model="invoice.notes"
            rows="3"
            placeholder="Información bancaria, plazos de pago, etc."
            class="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Sidebar Summary -->
      <div class="space-y-6">
        <div class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6 sticky top-24">
          <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-6">Resumen</h3>
          
          <div class="space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Subtotal</span>
              <span class="text-white font-bold">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">IVA ({{ store.company.value.defaultTax }}%)</span>
              <span class="text-white font-bold">{{ formatCurrency(tax) }}</span>
            </div>
            <div class="pt-4 border-t border-white/10 flex justify-between items-end">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total a Pagar</span>
              <span class="text-2xl md:text-3xl font-bold text-white tracking-tighter">{{ formatCurrency(total) }}</span>
            </div>
          </div>

          <div class="pt-6 space-y-3">
            <button 
              @click="handleSave"
              class="w-full bg-primary-container text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl"
            >
              <Save :size="20" />
              Emitir Factura
            </button>
            <button class="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
              <FileText :size="20" />
              Vista Previa
            </button>
          </div>

          <div class="mt-6 p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
            <div class="flex gap-3">
              <Euro class="text-secondary shrink-0" :size="18" />
              <p class="text-[10px] text-secondary font-medium leading-relaxed">
                Esta factura se emitirá bajo el régimen general de IVA. Asegúrate de que los datos del cliente sean correctos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
