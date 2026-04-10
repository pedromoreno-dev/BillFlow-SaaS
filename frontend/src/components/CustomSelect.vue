<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';
import { cn } from '../lib/utils';

interface Option {
  value: string;
  label: string;
}

const props = defineProps<{
  options: Option[];
  modelValue: string;
  placeholder?: string;
  className?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const position = ref({ top: 0, left: 0, width: 0 });

const selectedOption = computed(() => props.options.find(opt => opt.value === props.modelValue));

const updatePosition = () => {
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect();
    position.value = {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width
    };
  }
};

const toggle = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    updatePosition();
  }
};

const selectOption = (value: string) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    triggerRef.value && 
    dropdownRef.value && 
    !triggerRef.value.contains(event.target as Node) &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', updatePosition);
  window.addEventListener('resize', updatePosition);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', updatePosition);
  window.removeEventListener('resize', updatePosition);
});
</script>

<template>
  <div class="relative w-full" :class="className">
    <button
      ref="triggerRef"
      type="button"
      @click="toggle"
      :class="cn(
        'w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-left text-white outline-none transition-all flex items-center justify-between',
        isOpen ? 'ring-1 ring-primary/50 border-primary/30' : 'hover:bg-white/10'
      )"
    >
      <span :class="cn('truncate', !selectedOption && 'text-slate-500')">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <ChevronDown 
        :size="18" 
        :class="cn('text-slate-500 transition-transform duration-300', isOpen && 'rotate-180 text-primary')" 
      />
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="fixed z-[10000] bg-[#151b2d] rounded-xl border border-white/10 shadow-2xl overflow-hidden"
          :style="{
            top: position.top + 'px',
            left: position.left + 'px',
            width: position.width + 'px'
          }"
        >
          <div class="max-h-60 overflow-y-auto custom-scrollbar">
            <button
              v-for="option in options"
              :key="option.value"
              type="button"
              @click="selectOption(option.value)"
              :class="cn(
                'w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between',
                option.value === modelValue 
                  ? 'bg-primary/20 text-primary font-bold' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )"
            >
              <span>{{ option.label }}</span>
              <Check v-if="option.value === modelValue" :size="14" class="text-primary" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
