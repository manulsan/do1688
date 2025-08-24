<template>
  <q-page class="q-pa-none" style="user-select: none">
    <q-linear-progress v-if="loading" indeterminate />
    <q-scroll-area style="height: calc(100vh - 50px - 50px)">
      <div class="full-width">
        <q-toolbar dense style="user-select: none" class="'q-px-sm'">
          <q-toolbar-title class="q-px-md" dense>
            <q-input
              dense
              v-model="query"
              :label="$t('검색어')"
              class="q-px-xs"
              placeholder="애견+접이식"
              style="color: black; background-color: white; width: 300px"
            >
            </q-input>
          </q-toolbar-title>
          <q-input
            dense
            v-model="mallName"
            :label="$t('몰이름')"
            class="q-px-sm"
            style="color: black; background-color: white; width: 200px"
          >
          </q-input>
          <q-btn class="q-px-md" icon="search" :loading="exportLoading" @click="loadPage()">
          </q-btn>

          <q-item-label class="q-pl-lg text-bold text-h6"
            >{{ $t('순위') }} : {{ myRank }}
          </q-item-label>
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
          :rows="logs"
          row-key="_id"
          :table-row-class-fn="rowClassFn"
        />
        <!-- :body-cell-class="bodyCellClass" -->
      </div>

      <div style="height: 90px" />
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import type { QTableColumn } from 'quasar';
//import {fetch} from 'node-fetch';
import { apiNaver } from 'src/boot/axios';
const { t } = useI18n();

//const query = ref('애견+접이식+유모차');
const query = ref('사자보이즈+의상');
const myRank = ref(0);
const mallName = ref('딜박스');
const selectdMallName = ref(mallName.value);

const logs = ref([]);
const loading = ref(false);
const exportLoading = ref(false);

const show = ref({ contentsView: '' });

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
    name: 'price',
    label: t('Price'),
    field: (row) => {
      return row.lprice;
    },
    align: 'left',
    sortable: true,
  });

  cols.push({
    name: 'mall',
    label: t('Mall'),
    field: (row) => {
      return row.mallName;
    },
    align: 'left',
    sortable: true,
  });

  return cols;
});

function rowClassFn(row: RankItem): string {
  return row.mallName === selectdMallName.value ? 'bg-teal-1 text-bold' : '';
}

const loadPage = async () => {
  try {
    loading.value = true;
    const response = await apiNaver.get(
      //'https://openapi.naver.com/v1/search/shop.json',
      '/search/shop.json',
      {
        params: {
          // query: '사자보이즈+의상',
          //query: '저상형+접이식+유모차',
          query: query.value,
          display: 100,
          start: 1,
          sort: 'sim',
        },
        headers: {
          'X-Naver-Client-Id': 'q_4av_CgXqetHsoPVQq8',
          'X-Naver-Client-Secret': '8IpmpZvDPN',
        },
      },
    );

    console.log(response.data);

    const doundIndex = response.data.items.findIndex(
      (item: RankItem) => item.mallName == selectdMallName.value,
    );

    if (doundIndex === -1) myRank.value = 0;
    else myRank.value = doundIndex + 1;
    logs.value = response.data.items.map((item: RankItem, index: number) => {
      return {
        ...item,
        index: index + 1,
      };
    });
  } catch (error) {
    console.error(JSON.stringify(error));
  } finally {
    loading.value = false;
  }
};
onMounted(async () => {
  show.value.contentsView = localStorage.getItem('view-list-or-chart') || 'chart';
  await loadPage();
});
</script>

<style lang="scss" scoped>
.my-green-row {
  background-color: #b9f6ca !important;
}
</style>
