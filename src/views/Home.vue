<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import Box from '@/components/Box.vue'
import _ from 'lodash'
import { moveArticlesFromVirtualBoxTo } from '@/js/viewHelper'
import { useRouter } from 'vue-router'

const barcode = ref("")

const store = useStore()
const router = useRouter()

function onBarcodeConfirmed() {
    store.commit("pushBarcode", barcode.value)
}

watch(() => store.getters.lastBarcode, async (code) => {
    if (_.isEmpty(code)) {
        return
    }

    try {
        const item = await store.dispatch("getItem", code)
        if (!item) {
            store.dispatch("onUnknownBarcodeScanned", code)
        } else if (item.type === "box") {
            if (await moveArticlesFromVirtualBoxTo(store, item)) {
                store.commit("setCurrentBox", item)
            } else {
                store.commit("clearBarcodes")
            }
        } else if (item.type === "article") {
            router.push(`/articles/view/${item.code}`)
        }
    } catch (e) { console.error(e) }
})

</script>
<template>
    <van-cell-group>
        <van-field v-model="barcode" placeholder="barcode">
            <template #button>
                <van-icon name="success" :size="16" @click="onBarcodeConfirmed" />
            </template>
        </van-field>
    </van-cell-group>
    <box class="box" v-if="!_.isEmpty(store.state.currentBox)" :box="store.state.currentBox"></box>
</template>

<style scoped lang="scss">
.box {
    position: absolute;
    top: 50PX;
    bottom: 1PX;
}
</style>

