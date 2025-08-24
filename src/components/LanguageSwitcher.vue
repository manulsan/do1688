<template>
  <!-- <div style="max-width: 185px; width: 185px"> -->
  <div style="max-width: 185px; width: 180px">
    <!-- :class="isDark ? 'custom-select-dark' : 'custom-select-light'" -->
    <q-select
      v-model="locale"
      :options="options"
      dense
      borderless
      emit-value
      map-options
      options-dense
      transition-show="flip-up"
      transition-hide="flip-down"
      @update:model-value="(val) => onSelect(val)"
    >
      <template v-slot:prepend>
        <q-icon name="language" size="xs" />
        <!-- <div :class="getClass('text-color') + 'q-pt-none text-body2'">{{ $t('Language') }}:</div> -->
        <div class="q-pt-none text-body2">{{ $t('Language') }}:</div>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
// import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
// import { EventBus } from 'quasar';
import { options } from 'src/i18n';
// import { useScreenUtil } from 'src/composables/useScreenUtil';
const { locale } = useI18n({ useScope: 'global' });
// const { isDark, getClass } = useScreenUtil();

// const eventBus = inject('eventBus') as EventBus;
const onSelect = (value: string) => {
  locale.value = value;
  localStorage.setItem('userLanguage', value);
  // eventBus.emit('evtLanguageChanged');
};
</script>
