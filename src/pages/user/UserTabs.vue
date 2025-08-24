<template>
  <q-page>
    <q-tabs v-model="tab" dense align="left" class="text-teal q-pl-md q-pt-sm">
      <q-tab name="user_account" icon="lock" :label="$t('User Account')" />
      <q-tab name="malls" icon="shopping_cart" :label="$t('User Malls')" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="user_account">
        <!-- {{ 'userAccountStore.id=' + userAccountStore.id }} -->
        <q-form @submit="onSaveAccount">
          <q-input
            v-model="clientId"
            :label="$t('Client ID')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your client ID')]"
          />
          <!-- type="password" -->
          <q-input
            v-model="clientSecret"
            :label="$t('Client Secret')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your client secret')]"
          />
          <q-btn
            :label="$t('Save')"
            type="submit"
            color="primary"
            class="q-mt-"
            :disable="!clientId || !clientSecret"
          />
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="malls">
        <!-- <q-list padding class="q-mb-md" separator bordere style="min-height: 200px">
          <q-item v-for="(mall, index) in myMalls" :key="index" clickable v-ripple>
            <q-item-section avatar class="drag-handle">
              <q-icon name="drag_indicator" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ mall.name }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>{{ mall.description }}</q-item-label>
            </q-item-section>

            <q-item-section avatar side>
              <q-icon name="delete" @click="deleteMallName(mall.name)" />
            </q-item-section>
          </q-item>
        </q-list> -->
        <draggable
          v-model="myMalls"
          item-key="name"
          animation="200"
          handle=".drag-handle"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <q-item clickable v-ripple>
              <q-item-section avatar class="drag-handle">
                <q-icon name="drag_indicator" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ element.name }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption>{{ element.description }}</q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-icon name="delete" color="red" @click="deleteMallName(element.name)" />
              </q-item-section>
            </q-item>
          </template>
        </draggable>

        <q-form @submit="onRegisterMall" class="q-mx-lg" dense>
          <q-separator class="q-my-md" />
          <q-input
            v-model="mallName"
            :label="$t('Mall Name')"
            dense
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter mall name']"
            style="width: 300px"
          />
          <q-input
            v-model="mallDescription"
            dense
            :label="$t('Description')"
            style="width: 300px"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter mall description']"
          />
          <q-btn :label="$t('Add Mall')" type="submit" color="primary" :disable="!isValidVall()" />
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const tab = ref('user_account');
const clientId = ref('');
const clientSecret = ref('');
const mallName = ref('');
const mallDescription = ref('');
import draggable from 'vuedraggable';
import type { SortableEvent } from 'sortablejs';

import { useUserAccountStore } from 'src/stores/user-account';

const userAccountStore = useUserAccountStore();
// interface UserMall {
//   name: number;
//   description: string;
// }
//const mallList = ref<UserMall[]>([]);
//const mallList = ref<UserMall[]>([]) as [] as { name: string; description: string }[],
const mallList = ref([] as { name: string; description: string }[]);
const onSaveAccount = () => {
  userAccountStore.setClientId(clientId.value);
  userAccountStore.setClientSecret(clientSecret.value);
};

const onRegisterMall = () => {
  // Handle malls logic here
  userAccountStore.addUMallName(mallName.value, mallDescription.value);
};
const deleteMallName = (name: string) => {
  console.log('deleteMallName name=', name);
  userAccountStore.deleteMallName(name);
};

const isValidVall = () => {
  if (mallName.value.length > 0 && mallDescription.value.length > 0) {
    const dup = myMalls.value.find((mall) => mall.name === mallName.value);
    return dup === undefined;
  }
  return false;
};

function onDragEnd(evt: SortableEvent) {
  console.log('Drag ended!');
  console.log('Old index:', evt.oldIndex);
  console.log('New index:', evt.newIndex);
  console.log('Updated order:', myMalls.value);
  if ((evt.oldIndex, evt.newIndex === undefined)) return;
  else userAccountStore.updateMallNameOrders(evt.oldIndex as number, evt.newIndex);
}
const myMalls = computed(() => userAccountStore.malls);
onMounted(() => {
  console.log('userAccountStore.id=', userAccountStore.id);
  clientId.value = userAccountStore.id;
  clientSecret.value = userAccountStore.secret;

  mallName.value = '?';
  mallDescription.value = '';

  mallList.value = userAccountStore.malls;
});
</script>
