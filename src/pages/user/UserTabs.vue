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
          <q-separator class="q-my-md" />
          <q-input
            v-model="userName"
            :label="$t('Name')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your name')]"
          />

          <q-input
            v-model="userEmail"
            :label="$t('Email')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your email')]"
          />

          <q-btn
            :label="$t('Save')"
            type="submit"
            color="primary"
            class="q-mt-md"
            icon="save"
            :disable="!clientId || !clientSecret || !userName || !userEmail"
          >
            <q-tooltip>{{ $t('Save') }}</q-tooltip>
          </q-btn>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="malls">
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
                <q-item-label>{{ element.description }}</q-item-label>
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
            :rules="[(val) => (val && val.length > 0) || $t('Please enter mall name')]"
            style="width: 300px"
          />
          <q-input
            v-model="mallDescription"
            dense
            :label="$t('Description')"
            style="width: 300px"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter mall description')]"
          />
          <q-btn
            :label="$t('Add Mall')"
            icon="add"
            color="primary"
            class="q-mt-md"
            :disable="!isMallInputsValid()"
          >
            <q-tooltip>{{ $t(tooltipAddMall) }}</q-tooltip>
          </q-btn>
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

const userName = ref('');
const userEmail = ref('');

const mallName = ref('');
const mallDescription = ref('');
import draggable from 'vuedraggable';
import type { SortableEvent } from 'sortablejs';
import { useUserAccountStore } from 'src/stores/user-account';

const userAccountStore = useUserAccountStore();
const mallList = ref([] as { name: string; description: string }[]);

const deleteMallName = (name: string) => userAccountStore.deleteMallName(name);
const onRegisterMall = () => userAccountStore.addMallName(mallName.value, mallDescription.value);
const onSaveAccount = () => {
  userAccountStore.setClientId(clientId.value);
  userAccountStore.setClientSecret(clientSecret.value);

  userAccountStore.setUserName(userName.value);
  userAccountStore.setUserEmail(userEmail.value);
};
const tooltipAddMall = computed(() => {
  if (!mallName.value) return 'Please enter mall name';
  else if (!mallDescription.value) return 'Please enter mall description';
  else return 'Add Mall';
});
const isMallInputsValid = () => {
  if (mallName.value.length > 0 && mallDescription.value.length > 0) {
    const dup = myMalls.value.find((mall) => mall.name === mallName.value);
    return dup === undefined;
  }
  return false;
};

function onDragEnd(evt: SortableEvent) {
  if ((evt.oldIndex, evt.newIndex === undefined)) return;
  else userAccountStore.updateMallNameOrders(evt.oldIndex as number, evt.newIndex);
}
const myMalls = computed(() => userAccountStore.malls);
onMounted(() => {
  console.log('userAccountStore.id=', userAccountStore.id);
  clientId.value = userAccountStore.id;
  clientSecret.value = userAccountStore.secret;

  mallName.value = '';
  mallDescription.value = '';

  mallList.value = userAccountStore.malls;
});
</script>
