<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">Image Translation (Chinese → Korean)</div>

      <!-- Drop Zone -->
      <div
        class="drop-zone flex column items-center justify-center q-pa-lg q-mb-md"
        @dragover.prevent
        @drop.prevent="onDrop"
        @click="fileInput?.click()"
      >
        <q-icon name="cloud_upload" size="48px" />
        <div class="text-subtitle2 q-mt-sm">Drop image or click to choose</div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
      </div>

      <canvas
        ref="canvas"
        :width="canvasW"
        :height="canvasH"
        class="rounded-borders shadow-2 full-width q-mb-md"
        style="background: #fafafa"
      />

      <div class="q-gutter-sm q-mt-md">
        <q-btn
          label="Translate Image (CN→KR)"
          color="primary"
          @click="runImageTranslation"
          :loading="loading"
        />
      </div>

      <q-card flat bordered class="q-pa-md q-mt-md" v-if="ocrText">
        <div class="text-subtitle1">OCR Result (Chinese)</div>
        <q-separator class="q-my-sm" />
        <pre>{{ ocrText }}</pre>
      </q-card>

      <q-card flat bordered class="q-pa-md q-mt-md" v-if="translatedText">
        <div class="text-subtitle1">Translation (Korean)</div>
        <q-separator class="q-my-sm" />
        <pre>{{ translatedText }}</pre>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import Tesseract from 'tesseract.js';

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const canvasW = 800;
const canvasH = 500;

const img = new Image();
const ocrText = ref('');
const translatedText = ref('');
const loading = ref(false);

watch(canvas, async (el) => {
  if (el) {
    await nextTick();
    ctx.value = el.getContext('2d');
    clearCanvas();
  }
});

function onDrop(e: DragEvent) {
  if (!e.dataTransfer) return;
  const file = [...e.dataTransfer.files].find((f) => f.type.startsWith('image/'));
  if (file) loadImageFile(file);
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  loadImageFile(target.files[0] as File);
  target.value = '';
}

function loadImageFile(file: File) {
  const url = URL.createObjectURL(file);
  img.onload = () => {
    drawOriginal();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function clearCanvas() {
  if (!ctx.value) return;
  ctx.value.clearRect(0, 0, canvasW, canvasH);
  ctx.value.fillStyle = '#ffffff';
  ctx.value.fillRect(0, 0, canvasW, canvasH);
}

function drawOriginal() {
  if (!ctx.value) return;
  clearCanvas();
  ctx.value.drawImage(img, 0, 0, canvasW, canvasH);
}

// OCR + Translation (중국어 → 한국어)
async function runImageTranslation() {
  if (!canvas.value) return;
  loading.value = true;
  ocrText.value = '';
  translatedText.value = '';

  try {
    // 1. OCR (중국어)
    const result = await Tesseract.recognize(canvas.value.toDataURL('image/png'), 'chi_sim');
    ocrText.value = result.data.text.trim();

    // 2. 번역 (예: 여기선 "테스트 번역"으로 대체)
    // 실제 구현에서는 Papago API or OpenAI 번역 모델 연결 필요
    translatedText.value = '[예시 번역] ' + ocrText.value.replace(/./g, '한');

    // 3. 이미지 위에 번역 텍스트 그리기
    if (ctx.value) {
      drawOriginal();
      ctx.value.font = '20px sans-serif';
      ctx.value.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.value.fillRect(10, canvasH - 60, canvasW - 20, 50);
      ctx.value.fillStyle = 'white';
      ctx.value.fillText(translatedText.value, 20, canvasH - 30);
    }
  } catch (err) {
    console.error(err);
    ocrText.value = 'OCR/번역 오류';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed var(--q-primary);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
  min-height: 140px;
  text-align: center;
}
.hidden {
  display: none;
}
</style>
