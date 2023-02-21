<script setup>
import { ref, reactive, onMounted } from 'vue';

const positions = reactive({
    clientX: undefined,
    clientY: undefined,
    top: "0px",
    right: "0px",
})

const props = defineProps({
    zIndex: { type: Number, default: 9999 },
    startTop: { type: Number, default: undefined },
    startLeft: { type: Number, default: undefined },
    startRight: { type: Number, default: undefined },
    startBottom: { type: Number, default: undefined }
})

const containerRef = ref(null)

onMounted(() => {
    if (props.startTop) {
        positions.top = props.startTop + 'px'
    }

    if (props.startLeft) {
        positions.left = props.startLeft + 'px'
    }

    if (props.startRight) {
        positions.left = (window.innerWidth - props.startRight - containerRef.value.offsetWidth) + 'px'
    }

    if (props.startBottom) {
        positions.top = (window.innerHeight - props.startBottom - containerRef.value.offsetHeight) + 'px'
    }
})

let originalDocStyleOverflow = ''

function elementDrag(event) {
    document.documentElement.style.overflow = 'hidden'
    const touch = event.touches[0]
    const movementX = positions.clientX - touch.clientX
    const movementY = positions.clientY - touch.clientY
    positions.clientX = touch.clientX
    positions.clientY = touch.clientY
    positions.top = (containerRef.value.offsetTop - movementY) + 'px'
    positions.left = (containerRef.value.offsetLeft - movementX) + 'px'
}

function recoverDocStyleOverflow() {
    document.documentElement.style.overflow = originalDocStyleOverflow
}

function recordDocStyleOverflow() {
    originalDocStyleOverflow = document.documentElement.style.overflow
}

</script>

<template>
    <div ref="containerRef" class="draggable-container" :style="{
        zIndex: props.zIndex,
        top: positions.top,
        left: positions.left
    }" v-touch:drag="elementDrag" v-touch:release="recoverDocStyleOverflow" v-touch:hold="recordDocStyleOverflow">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.draggable-container {
    position: absolute;
}
</style>