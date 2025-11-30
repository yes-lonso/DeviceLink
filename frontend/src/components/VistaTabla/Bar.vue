<template>
  <div class="row q-gutter-sm items-center">
    <template v-for="(action, index) in actions" :key="index">
      <q-input
        v-if="action.type === 'input'"
        dense        
        outlined
        v-model="action.value"        
        :placeholder="action.placeholder"
        :disable="action.disabled"
        class="q-mr-sm"
        v-bind="action.inputConfig"
        @keyup.enter.prevent="action.handler($event.target.value)"
      >
        <template v-slot:append>
          <q-icon 
            name="search" 
            class="cursor-pointer" 
            @click="action.handler(action.value)" 
          />
        </template>
      </q-input>

      <q-select
        v-else-if="action.type === 'select'"
        dense
        outlined
        v-model="action.value"
        :disable="action.disabled"
        :options="action.options"
        :label="action.placeholder"
        class="q-mr-sm"
        style="min-width: 150px"
        @update:model-value="action.handler"
      />

      <q-btn-dropdown
        v-else-if="action.type === 'dropdown'"
        :disable="action.disabled"
        :icon="action.icon"
        :label="action.label"
        :color="action.color || 'white'"
        :flat="action.flat !== false"
        :class="action.class"
        class="q-mr-sm"
      >
        <q-list>
          <q-item
            v-for="(item, i) in action.items"
            :key="i"
            clickable
            v-close-popup
            @click="item.handler"
          >
            <q-item-section avatar v-if="item.icon">
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn
        v-else
        :disable="action.disabled"
        :icon="action.icon"
        :label="action.label"
        :color="action.color || 'white'"
        :flat="action.flat !== false"
        :class="action.class"
        @click="action.type !== 'menu' ? action.handler() : null"
        class="q-mr-sm"
      >
        <q-tooltip v-if="action.tooltip">{{ action.tooltip }}</q-tooltip>
        <q-menu v-if="action.type === 'menu'">
          <q-list style="min-width: 100px">
            <q-item
              v-for="(item, i) in action.items"
              :key="i"
              clickable
              v-close-popup
              @click="item.handler"
            >
              <q-item-section avatar v-if="item.icon">
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Action } from './types';

defineProps({
  actions: {
    type: Array as PropType<Action[]>,
    default: () => [],
  },
});
</script>
