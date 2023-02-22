<template>
    <div>
        <van-cell-group v-if="viewMode">
            <van-field v-model="barcode" placeholder="barcode">
                <template #button>
                    <van-icon name="success" :size="16" @click="onBarcodeConfirmed" />
                </template>
            </van-field>
        </van-cell-group>
        <div class="submit-container" v-if="viewMode">
            <van-button type="primary" round block @click="onPickup">This box is in my hand</van-button>
        </div>
        <box-form :box="box" @save="onSaveBox" @edit="onEditBox" :view-mode="viewMode" />
    </div>
</template>
<script setup>
import BoxForm from '@/components/BoxForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, computed, watch, ref } from 'vue'
import Box from '@/js/box';
import { useStore } from 'vuex'
import _ from 'lodash'
import { moveArticlesFromVirtualBoxTo, moveArticlesTo, confirmSetCurrentBox } from '@/js/viewHelper'

const route = useRoute()
const router = useRouter()
const store = useStore()
const box = reactive(new Box())
const barcode = ref("")

const viewMode = computed(() => {
    return route.name === 'viewBox'
})

onMounted(async () => {
    const code = route.params['code']
    if (code) {
        box.code = code
        try {
            await store.dispatch("parseItem", box)
        } catch (e) { console.error(e) }
    }
})

async function onBarcodeConfirmed() {
    await analyseBarCode(barcode.value)
}

async function analyseBarCode(code) {
    if (code === box.code) {
        return
    }
    try {
        const item = await store.dispatch("getItem", code)
        if (!item) {
            store.dispatch("onUnknownBarcodeScanned", code)
        }
        if (item.type === 'article') {
            if (box.code !== item.boxCode) {
                if (await moveArticlesTo(store, item, box)) {
                    store.commit("setCurrentBox", box)
                    router.replace({ name: 'home' })
                }
            } else {
                router.replace(`/articles/view/${item.code}`)
            }
        } else if (item.type === 'box') {
            box.apply(item)
        }
    } catch (e) { console.log(e) }
}

watch(() => store.getters.lastBarcode, analyseBarCode)

async function onSaveBox() {
    const isNewBox = !box.saved
    try {
        await store.dispatch("saveItem", box)
        if (isNewBox && !_.isEmpty(store.state.previousRoute) && store.state.previousRoute.name === 'viewArticle' && isNewBox) {
            const code = store.state.previousRoute.params.code
            const article = await store.dispatch("getItem", code)
            if (article.boxCode !== box.code && await moveArticlesTo(store, article, box)) {
                onPickup()
                return
            }
        }
        if (await moveArticlesFromVirtualBoxTo(store, box)) {
            onPickup()
            return
        }
        if (isNewBox && confirmSetCurrentBox(store, box)) {
            router.replace({ name: 'home' })
            return
        }
        router.back()
    } catch (e) { console.error(e) }
}

function onEditBox() {
    router.push(`/boxes/edit/${box.code}`)
}

function onPickup() {
    store.commit("setCurrentBox", box)
    router.replace({ name: 'home' })
}
</script>