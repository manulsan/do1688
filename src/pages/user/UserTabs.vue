<template>
  <q-page>
    <q-tabs v-model="tab" dense align="left" class="text-teal q-pl-md q-pt-sm">
      <q-tab name="user_setting" icon="lock" :label="$t('User Settings')" />
      <q-tab name="store_setting" icon="shopping_cart" :label="$t('User Store')" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="user_setting">
        <q-form @submit="onSaveAccount">
          <q-input
            v-model="clientId"
            :label="$t('Client ID')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your client ID')]"
          >
            <template v-slot:append>
              <q-btn
                :label="$t('Hint')"
                icon="help"
                color="primary"
                class="q-mt-md"
                style="cursor: pointer"
                @click="showClientIdHint = !showClientIdHint"
              >
                <q-tooltip>{{ $t('Hint for Client ID') }}</q-tooltip>
              </q-btn>
            </template>
          </q-input>

          <div
            v-if="showClientIdHint"
            class="q-mt-none q-mb-md q-pl-lg"
            style="background-color: #22f2f2; border-radius: 5px; padding: 10px"
          >
            <q-item-label class="text-bold text-body1">
              <span>
                {{ $t('If you need client ID, click below link') }}
              </span>
            </q-item-label>

            <q-item-label class="q-mt-md">
              <a :href="naverIdHit1" target="_blank"> {{ $t('DAOL Help Center') }} </a>
            </q-item-label>
            <q-item-label class="q-mt-md">
              <a :href="naverIdHit2" target="_blank"> {{ $t('CAFE24 Help Center') }} </a>
            </q-item-label>
          </div>
          <q-input
            v-model="clientSecret"
            :label="$t('Client Secret')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your client secret')]"
          />
          <q-input
            v-if="false"
            v-model="userName"
            :label="$t('Name')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your name')]"
          />
          <q-input
            v-if="false"
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

      <q-tab-panel name="store_setting">
        <draggable
          v-model="myStores"
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
                <q-icon name="delete" color="red" @click="deletestoreName(element.name)" />
              </q-item-section>
            </q-item>
          </template>
        </draggable>

        <!------- **** store  tab **** ------->
        <q-form @submit="onRegisterStore" class="q-mx-lg" dense>
          <q-separator class="q-my-md" />

          <q-input
            v-model="storeName"
            :label="$t('Store Name')"
            dense
            lazy-rules
            style="width: 300px"
          >
            <!-- :rules="[(val) => (val && val.length > 0) || $t('Please enter store name')]" -->
          </q-input>
          <q-input
            v-model="storeDescription"
            dense
            :label="$t('Description')"
            style="width: 300px"
            lazy-rules
          />
          <!-- :rules="[(val) => (val && val.length > 0) || $t('Please enter store description')]" -->
          <q-btn
            :label="$t('Add Store')"
            icon="add"
            color="primary"
            class="q-mt-md"
            type="submit"
            :disable="!isStoreInputsValid()"
          >
            <q-tooltip>{{ $t(tooltipAddStore) }}</q-tooltip>
          </q-btn>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const tab = ref('user_setting');
const showClientIdHint = ref(false);
const naverIdHit1 = ref(
  'https://daolcom.com/board/manual/read.html?no=9251&board_no=101&category_no=5&cate_no=5&category_no=5',
);
const naverIdHit2 = ref(
  'https://support.cafe24.com/hc/ko/articles/8467208476569--%EB%8F%99%EC%98%81%EC%83%81%EA%B0%80%EC%9D%B4%EB%93%9C-%EB%84%A4%EC%9D%B4%EB%B2%84-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EC%95%B1-%EC%95%84%EC%9D%B4%EB%94%94%EB%A5%BC-%EB%B0%9C%EA%B8%89%EB%B0%9B%EC%9C%BC%EB%A0%A4%EB%A9%B4-%EC%96%B4%EB%96%BB%EA%B2%8C-%ED%95%B4%EC%95%BC-%ED%95%98%EB%82%98%EC%9A%94',
);
const clientId = ref('');
const clientSecret = ref('');

const userName = ref('...');
const userEmail = ref('^^');

const storeName = ref('');
const storeDescription = ref('');
import draggable from 'vuedraggable';
import type { SortableEvent } from 'sortablejs';
import { useUserSettingStore } from 'src/stores/user-setting';
import { useRouter } from 'vue-router';
const router = useRouter();

const userSettingStore = useUserSettingStore();
const myStores = computed(() => userSettingStore.stores);

const deletestoreName = (name: string) => userSettingStore.deleteStore(name);
const onRegisterStore = () => {
  userSettingStore.addStore(storeName.value, storeDescription.value);
  // storeName.value = '';
  // storeDescription.value = '';
};
const onSaveAccount = () => {
  userSettingStore.setClientId(clientId.value);
  userSettingStore.setClientSecret(clientSecret.value);

  userSettingStore.setUserName(userName.value);
  userSettingStore.setUserEmail(userEmail.value);
};
const tooltipAddStore = computed(() => {
  if (!storeName.value) return 'Please enter store name';
  else if (!storeDescription.value) return 'Please enter store description';
  else return 'Add Store';
});
const isStoreInputsValid = () => {
  try {
    if (storeName.value.length > 0) {
      return true;
      // alex notes: do net check below, in production make exception
      // if (!myStores.value) return true;
      // else if (myStores.value.length !== 0) return true;
      // else {
      //   const dup = myStores.value.find((d) => d.name === storeName.value);
      //   return dup === undefined;
      // }
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};

function onDragEnd(evt: SortableEvent) {
  if ((evt.oldIndex, evt.newIndex === undefined)) return;
  else userSettingStore.updateStoreOrder(evt.oldIndex as number, evt.newIndex);
}

onMounted(() => {
  clientId.value = userSettingStore.id;
  clientSecret.value = userSettingStore.secret;

  const query = router.currentRoute.value.query; //const path = router.currentRoute.value.path;
  if (query?.tab === 'user_setting') tab.value = 'user_setting';
  else if (query?.tab === 'store_setting') tab.value = 'store_setting';

  userName.value = userSettingStore.name;
  userEmail.value = userSettingStore.email;
});
</script>
