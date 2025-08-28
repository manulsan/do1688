<template>
  <q-page class="q-pa-none">
    <q-linear-progress v-if="loading" indeterminate />
    <div class="row full-width q-pa-sm" v-if="!isMobile">
      <div class="col-5">
        <q-select
          v-model="searchKey"
          filled
          dense
          use-input
          hide-selected
          fill-input
          :options="filteredOptions"
          input-debounce="0"
          :label="$t('Search Keys')"
          @filter="filterFn"
          @input-value="setModel"
          @new-value="addSearchKeyOption"
        >
          <q-tooltip>{{ $t('if edited, hit enter key') }}</q-tooltip>
        </q-select>
      </div>
      <div class="col-2 q-pl-md">
        <q-select
          v-model="selectedMallName"
          :options="myMallList"
          dense
          :label="$t('Mall Name')"
          input-debounce="0"
          style="col-2"
        />
      </div>
      <div class="col-2 q-pl-md">
        <q-select
          v-model="searchStartIndex"
          :options="searchPointOptions"
          dense
          :label="$t('Start Point')"
        />
      </div>

      <div class="col-2 flex justify-center items-center">
        <q-btn
          icon="search"
          @click="onSearch()"
          :disable="!checkInputsValid()"
          :label="$t('Search')"
          color="primary"
        >
          <q-tooltip>{{ searchTooltip }}</q-tooltip>
        </q-btn>
      </div>
      <div class="col-1 flex justify-center items-center q-pt-xs">
        <span class="text-bold text-body1 text-grey-9">
          {{ $t('Ranking') }} : {{ myRankingNo === -1 ? '?' : myRankingNo }}
        </span>
      </div>
    </div>
    <!------------------   mobile window ------------------>
    <div v-else class="full-width q-pa-sm">
      <div class="row q-pa-none">
        <div class="col-9">
          <q-select
            v-model="searchKey"
            filled
            use-input
            dense
            hide-selected
            fill-input
            :options="filteredOptions"
            input-debounce="0"
            :label="$t('Search Keys')"
            @filter="filterFn"
            @input-value="setModel"
            @new-value="addSearchKeyOption"
          >
            <q-tooltip>{{ $t('if edited, hit enter key') }}</q-tooltip>
          </q-select>
        </div>
        <div class="col-3 q-pl-md">
          <q-select
            v-model="selectedMallName"
            :options="myMallList"
            dense
            :label="$t('Mall Name')"
            input-debounce="0"
          />
        </div>
      </div>
      <div class="row q-pa-none q-pt-sm">
        <div class="col-4 q-ml-xs">
          <q-select
            v-model="searchStartIndex"
            :options="searchPointOptions"
            dense
            :label="$t('Start Point')"
          />
        </div>

        <div class="col-4 flex justify-center items-center">
          <q-btn
            icon="search"
            @click="onSearch()"
            :disable="!checkInputsValid()"
            color="primary"
            :label="$t('Search')"
          >
            <q-tooltip>{{ searchTooltip }}</q-tooltip>
          </q-btn>
        </div>
        <div class="col-3 flex justify-center items-center q-pt-xs">
          <span class="text-bold text-body1 text-grey-9">
            {{ $t('Ranking') }} : {{ myRankingNo === -1 ? '?' : myRankingNo }}
          </span>
        </div>
      </div>
    </div>
    <q-scroll-area style="height: calc(100vh - 50px - 50px)">
      <q-table
        flat
        square
        hide-no-data
        hide-pagination
        :rows-per-page-options="[0]"
        separator="horizontal"
        class="sticky-column-table sticky-header-table q-px-sm"
        :columns="columns"
        :rows="productItems"
        row-key="_id"
        :table-row-class-fn="rowClassFn"
      >
        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <span v-html="props.row.title"></span>
          </q-td>
        </template>
      </q-table>
      <!-- <div style="height: 90px" /> -->
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiNaver } from 'src/boot/axios';
import type { QTableColumn } from 'quasar';
import { useUserAccountStore } from 'src/stores/user-account';
import { useScreenUtil } from 'src/composables/useScreenUtil';

const loading = ref(false);

const { t } = useI18n();
const userAccountStore = useUserAccountStore();
const { isMobile } = useScreenUtil();

const productItems = ref([]);

const myRankingNo = ref(-1);
const selectedMallName = ref();
const myMallList = ref<string[]>([]);

const searchKey = ref('사자보이즈+의상');
const searchOptions = ref<string[]>([]);
const filteredOptions = ref<string[]>([]);
function normalizeKorean(str: string): string {
  return str.normalize('NFC').toLowerCase().trim();
}

const searchPointOptions = [
  { value: 1, label: '처음부터' },
  { value: 101, label: '101번째' },
  { value: 201, label: '201번째' },
  { value: 301, label: '301번째' },
  { value: 401, label: '401번째' },
  { value: 501, label: '501번째' },
  { value: 601, label: '601번째' },
  { value: 701, label: '701번째' },
];
const searchStartIndex = ref({ value: 1, label: '처음부터' });

interface RankItem {
  index: number;
  title?: string;
  link?: string;
  image?: string;
  lprice?: string;
  hprice?: string;
  mallName?: string;
  productId?: string;
  productType?: string;
  brand?: string;
  maker?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
}
const columns = computed(() => {
  const cols: QTableColumn<RankItem>[] = [];
  cols.push({
    name: 'No',
    label: t('No.'),
    field: (row) => {
      return row.index;
    },
    align: 'left',
    sortable: true,
  });

  cols.push({
    name: 'title',
    label: t('Title'),
    field: (row) => {
      return row.title;
    },
    align: 'left',
    sortable: true,
  });

  cols.push({
    name: 'Price',
    label: t('Price'),
    field: (row) => {
      return row.lprice;
    },
    align: 'left',
    sortable: true,
  });

  cols.push({
    name: 'mall',
    label: t('Mall Name'),
    field: (row) => {
      return row.mallName;
    },
    align: 'left',
    sortable: true,
  });

  return cols;
});

function addSearchKeyOption(val: string, done: (val: string) => void) {
  val = val.trim();
  if (val.length > 0) {
    const found = searchOptions.value.find((item: string) => item === val);
    if (!found) {
      if (!found && searchOptions.value.length >= 10) searchOptions.value.pop();
      searchOptions.value.unshift(val);
      userAccountStore.setSearchKeyList(searchOptions.value);
    }
  }
  done(val);
}
const setModel = (val: string) => (searchKey.value = val);
function filterFn(val: string, update: (cb: () => void) => void) {
  update(() => {
    if (val === '') {
      filteredOptions.value = [...searchOptions.value];
    } else {
      const needle = normalizeKorean(val);
      filteredOptions.value = searchOptions.value.filter((opt) =>
        normalizeKorean(opt).includes(needle),
      );
    }
  });
}

function rowClassFn(row: RankItem): string {
  return row.mallName === selectedMallName.value ? 'bg-teal-1 text-bold' : '';
}

const checkInputsValid = () => {
  if (!searchKey.value || !selectedMallName.value) return false;
  if (userAccountStore.id.length <= 0 || userAccountStore.secret.length <= 0) return false;
  return true;
};

const searchTooltip = computed(() => {
  if (!searchKey.value) return t('Search Key Missed');
  else if (!selectedMallName.value) return t('Mall Name Missed');
  else if (!userAccountStore.id) return t('Client ID Missed');
  else if (!userAccountStore.secret) return t('Client Secret Missed');
  else return t('Search');
});

const onSearch = async () => {
  try {
    loading.value = true;
    const existingKey = searchOptions.value.find((item: string) => item === searchKey.value);
    if (!existingKey) {
      searchOptions.value.push(searchKey.value);
      userAccountStore.setSearchKeyList(searchOptions.value);
    }
    myRankingNo.value = -1;
    productItems.value = [];
    //'https://openapi.naver.com/v1/search/shop.json',
    //const response = await apiNaver.get('/search/shop.json', {
    let newPath = '';
    if (import.meta.env.DEV) newPath = '/search/shop.json';
    else if (import.meta.env.PROD) newPath = '/naver-search';

    //const response = await apiNaver.get('/naver-search', {
    const response = await apiNaver.get(newPath, {
      params: {
        query: searchKey.value,
        display: 100,
        sort: 'sim',
        start: searchStartIndex.value.value, //1,101,,,
        Client_Id: userAccountStore.id,
        Client_Secret: userAccountStore.secret,
      },
      headers: {
        'X-Naver-Client-Id': userAccountStore.id,
        'X-Naver-Client-Secret': userAccountStore.secret,
      },
    });

    console.log(' response.data=', response.data);
    if ('items' in response.data) {
      productItems.value = response.data.items.map((d: RankItem, index: number) => {
        if (d.mallName === selectedMallName.value)
          myRankingNo.value = index + searchStartIndex.value.value;
        return {
          ...d,
          index: index + searchStartIndex.value.value,
        };
      });
    }
    loading.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(async () => {
  //----------------------------------------------------------------------------
  // if client id or client secret is not set, redirect to user page
  if (userAccountStore.id.length <= 0 || userAccountStore.secret.length <= 0)
    await router.push('/user');

  searchOptions.value = userAccountStore.searchKeyList;
  myMallList.value = userAccountStore.malls.map((mall) => mall.name);
  if (myMallList.value.length > 0) selectedMallName.value = myMallList.value[0];
});
</script>
<style lang="scss" scoped></style>
