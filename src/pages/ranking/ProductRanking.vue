<template>
  <q-page class="q-pa-none" style="user-select: none">
    <q-linear-progress v-if="loading" indeterminate />
    <q-scroll-area style="height: calc(100vh - 50px - 50px)">
      <div class="full-width">
        <q-toolbar dense style="user-select: none" class="'q-px-sm'">
          <q-toolbar-title class="q-px-md" dense>
            <q-item>
              <q-item-section avatar>
                <q-select
                  v-model="searchKey"
                  :options="searchKeyOptions"
                  :label="$t('Search Keys')"
                  dense
                  clearable
                  use-input
                  fill-input
                  aria-placeholder="Search"
                  hide-selected
                  input-debounce="0"
                  new-value-mode="add-unique"
                  @new-value="addSearchKeyOption"
                  style="color: black; background-color: white; width: 400px"
                >
                  <template v-if="searchKey.length" v-slot:append>
                    <q-icon
                      name="close"
                      @click.stop.prevent="deleterchKeyOption(searchKey)"
                      class="cursor-pointer"
                    >
                      <q-tooltip>{{ $t('Delete') }}</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>
              </q-item-section>

              <q-item-section avatar>
                <q-select
                  v-model="selectedMallName"
                  :options="myMallList"
                  dense
                  :label="$t('Mall Name')"
                  input-debounce="0"
                  style="color: black; background-color: white; width: 150px"
                />
              </q-item-section>

              <q-item-section avatar>
                <q-select
                  v-model="searchStartIndex"
                  :options="searchPointOptions"
                  dense
                  class="q-pl-md"
                  style="width: 100px"
                  :label="$t('Start Point')"
                />
              </q-item-section>

              <q-item-section avatar>
                <q-btn
                  class="q-px-md"
                  icon="search"
                  @click="onSearch()"
                  :disable="!checkInputsValid()"
                  size="md"
                >
                  <q-tooltip>{{ searchTooltip }}</q-tooltip>
                </q-btn>
              </q-item-section>

              <q-item-section avatar class="q-pl-md">
                <q-item-label class="text-bold text-body1" side
                  >{{ $t('Ranking') }} : {{ myRankingNo === -1 ? '' : myRankingNo }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-toolbar-title>

          <q-item> </q-item>
        </q-toolbar>

        <!-- virtual-scroll -->
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
        />
      </div>

      <div style="height: 90px" />
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiNaver } from 'src/boot/axios';
import type { QTableColumn } from 'quasar';
import { useUserAccountStore } from 'src/stores/user-account';

const loading = ref(false);

const { t } = useI18n();
const userAccountStore = useUserAccountStore();

const productItems = ref([]);
const show = ref({ contentsView: '' });
const myRankingNo = ref(-1);
const selectedMallName = ref();
const myMallList = ref<string[]>([]);

const searchKeyOptions = ref<string[]>([]);
const searchKey = ref('사자보이즈+의상');

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
  const found = searchKeyOptions.value.find((item: string) => item === val);
  if (!found) searchKeyOptions.value.push(val);
  done(val);
}
function deleterchKeyOption(val: string) {
  searchKeyOptions.value = searchKeyOptions.value.filter((item: string) => item !== val);
  userAccountStore.setSearchKeyList(searchKeyOptions.value);
  searchKey.value = '';
}
function rowClassFn(row: RankItem): string {
  return row.mallName === selectedMallName.value ? 'bg-teal-1 text-bold' : '';
}

const searchTooltip = computed(() => {
  if (!searchKey.value) return t('Search Key Missed');
  else if (!selectedMallName.value) return t('Mall Name Missed');
  else if (!userAccountStore.id) return t('Client ID Missed');
  else if (!userAccountStore.secret) return t('Client Secret Missed');
  else return t('Search');
});
const checkInputsValid = () => {
  if (!searchKey.value || !selectedMallName.value) return false;
  if (userAccountStore.id.length <= 0 || userAccountStore.secret.length <= 0) return false;
  return true;
};
const onSearch = async () => {
  try {
    loading.value = true;
    const existingKey = searchKeyOptions.value.find((item: string) => item === searchKey.value);
    if (!existingKey) {
      searchKeyOptions.value.push(searchKey.value);
      userAccountStore.setSearchKeyList(searchKeyOptions.value);
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
onMounted(() => {
  show.value.contentsView = localStorage.getItem('view-list-or-chart') || 'chart';
  searchKeyOptions.value = userAccountStore.searchKeyList;
  myMallList.value = userAccountStore.malls.map((mall) => mall.name);
  if (myMallList.value.length > 0) selectedMallName.value = myMallList.value[0];
});
</script>
<style lang="scss" scoped></style>
