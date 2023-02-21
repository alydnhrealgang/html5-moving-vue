<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
const props = defineProps({
    id: { type: String, default: 'qr-code-full-region' },
    scanWidth: { type: Number, default: 200 },
    scanHeight: { type: Number, default: 100 },
    fps: { type: Number, default: 10 }
})

const emits = defineEmits(['scanned'])
let scanner = null;

onMounted(() => {
    scanner = new Html5QrcodeScanner(props.id, {
        fps: props.fps,
        qrbox: {
            width: props.scanWidth,
            height: props.scanHeight,
        }
    })
    scanner.render((t, r) => {
        emits("scanned", t, r)
    })
})

onBeforeUnmount(() => {
    scanner.clear();
})

</script>
<template>
    <div :id="props.id"></div>
</template>