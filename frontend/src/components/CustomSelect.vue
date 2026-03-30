<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { onClickOutside } from '@vueuse/core';

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
const containerRef = ref<HTMLElement | null>(null);

const selectedOption = computed(() => props.options.find(opt => opt.value === props.modelValue));

onClickOutside(containerRef, () => {
  isOpen.value = false;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (value: string) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};
</script>

<template>
  <div :class="cn('relative w-full', className, isOpen && 'z-[100]')" ref="containerRef">
    <button
      type="button"
      @click="toggle"
      :class="cn(
        'w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-left text-white outline-none transition-all flex items-center justify-between group',
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

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-[100] w-full mt-2 bg-[#1e2536] rounded-2xl border border-white/10 shadow-2xl overflow-hidden py-2"
      >
        <div class="max-h-60 overflow-y-auto custom-scrollbar">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            @click="selectOption(option.value)"
            :class="cn(
              'w-full text-left px-6 py-3 text-sm transition-all flex items-center justify-between group',
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
  </div>
</template>
