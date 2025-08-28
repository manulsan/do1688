<template>
  <q-page>
    <q-tabs v-model="tab" dense align="left" class="text-teal q-pl-md q-pt-sm">
      <q-tab name="user_account" icon="lock" :label="$t('User Account')" />
      <q-tab name="user_mall" icon="shopping_cart" :label="$t('User Malls')" />
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
                {{ $t('If you need clientId hint, click below link') }}
              </span>
            </q-item-label>

            <q-item-label class="q-mt-md">
              <a :href="naverIdHit1" target="_blank"> {{ $t('DAOL Help Center') }} </a>
            </q-item-label>
            <q-item-label class="q-mt-md">
              <a :href="naverIdHit2" target="_blank"> {{ $t('CAFE24 Help Center') }} </a>
            </q-item-label>
          </div>
          <!-- type="password" -->
          <q-input
            v-model="clientSecret"
            :label="$t('Client Secret')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter your client secret')]"
          />
          <!-- <q-separator class="q-my-md" /> -->
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

      <q-tab-panel name="user_mall">
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

        <!------- **** mall tab **** ------->
        <q-form @submit="onRegisterMall" class="q-mx-lg" dense>
          <q-separator class="q-my-md" />
          <q-input
            v-model="mallName"
            :label="$t('Mall Name')"
            dense
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Please enter mall name')]"
            style="width: 300px"
          >
          </q-input>
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
            type="submit"
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
const showClientIdHint = ref(false);
const naverIdHit1 = ref(
  'https://daolcom.com/board/manual/read.html?no=9251&board_no=101&category_no=5&cate_no=5&category_no=5',
);
const naverIdHit2 = ref(
  'https://support.cafe24.com/hc/ko/articles/8467208476569--%EB%8F%99%EC%98%81%EC%83%81%EA%B0%80%EC%9D%B4%EB%93%9C-%EB%84%A4%EC%9D%B4%EB%B2%84-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EC%95%B1-%EC%95%84%EC%9D%B4%EB%94%94%EB%A5%BC-%EB%B0%9C%EA%B8%89%EB%B0%9B%EC%9C%BC%EB%A0%A4%EB%A9%B4-%EC%96%B4%EB%96%BB%EA%B2%8C-%ED%95%B4%EC%95%BC-%ED%95%98%EB%82%98%EC%9A%94',
);
const clientId = ref('');
const clientSecret = ref('');

const userName = ref('');
const userEmail = ref('');

const mallName = ref('');
const mallDescription = ref('');
import draggable from 'vuedraggable';
import type { SortableEvent } from 'sortablejs';
import { useUserAccountStore } from 'src/stores/user-account';
import { useRouter } from 'vue-router';
const router = useRouter();

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
  //if (mallName.value.length > 0 && mallDescription.value.length > 0)
  if (mallName.value.length > 0) {
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

  //----------------------------------------------------------------------------
  const queryData = router.currentRoute.value.query; //const path = router.currentRoute.value.path;
  if (queryData?.tab === 'user_account') tab.value = 'user_account';
  else if (queryData?.tab === 'user_mall') tab.value = 'user_mall';

  const wquery = router.currentRoute.value.query;
  console.log('query:', wquery);

  userName.value = userAccountStore.name;
  userEmail.value = userAccountStore.email;
  mallList.value = userAccountStore.malls;
});
</script>
