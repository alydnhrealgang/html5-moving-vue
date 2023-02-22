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
            <van-button v-if="store.state.currentBox.code !== article.boxCode" type="primary" round block
                @click="onMove(store.state.currentBox)">Move to box {{ store.state.currentBox.code }}</van-button>
        </div>
        <div class="submit-container"
            v-if="viewMode && !_.isEmpty(store.state.previousBox.code) && store.state.previousBox.isVirtual">
            <van-button v-if="store.state.previousBox.code !== article.boxCode" type="primary" round block
                @click="onMove(store.state.previousBox)">Move to box {{ store.state.previousBox.code }}</van-button>
        </div>
        <article-form :article="article" @save="onSaveArticle" @edit="onEditArticle" :view-mode="viewMode" />
        <div class="submit-container" v-if="viewMode">
            <van-button type="danger" round block @click="onDelete">Delete</van-button>
        </div>
    </div>
</template>
<script setup>

import ArticleForm from '@/components/ArticleForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, computed, watch, ref } from 'vue'
import Article from '@/js/article'
import { useStore } from 'vuex'
import { moveArticlesTo } from '@/js/viewHelper'
import { deleteAsset } from '@/js/api'
import _ from 'lodash'
import { showConfirmDialog, showNotify } from 'vant'
const route = useRoute()
const router = useRouter()
const store = useStore()
const article = reactive(new Article())
const barcode = ref("")

const viewMode = computed(() => {
    return route.name === 'viewArticle'
})

async function onBarcodeConfirmed() {
    await analyseBarCode(barcode.value)
}

async function analyseBarCode(code) {
    if (code === article.code) {
        return
    }
    try {
        const item = await store.dispatch("getItem", code)
        if (!item) {
            store.dispatch("onUnknownBarcodeScanned", code)
        }
        if (item.type === 'box') {
            if (article.boxCode !== item.code) {
                if (await moveArticlesTo(store, article, item)) {
                    store.commit("setCurrentBox", item)
                    router.replace({ name: 'home' })
                }
            } else {
                router.replace(`/boxes/view/${item.code}`)
            }
        } else if (item.type === 'article') {
            article.apply(item)
        }
    } catch (e) { console.log(e) }
}

watch(() => store.getters.lastBarcode, analyseBarCode)

onMounted(async () => {
    const code = route.params['code']
    if (code) {
        article.code = code
        try {
            await store.dispatch("parseItem", article)
        } catch (e) { console.error(e) }
    }
})

async function onDelete() {
    try {
        await showConfirmDialog({
            title: `Delete article`,
            message: `Do you comfirm to delete this article and its photos?`,
        })
    } catch { return }

    try {
        await store.dispatch("deleteItem", article.code)
    } catch (e) {
        console.log(e)
        return
    }

    try {
        await deleteAsset(article.code, "*")
    } catch (e) {
        showNotify({
            type: "warning",
            message: "error occuried after article deleted."
        })
    }

    router.replace({ name: 'home' })
}


async function onMove(box) {
    try {
        if (await moveArticlesTo(store, article, box)) {
            store.commit("setCurrentBox", box)
            router.replace({ name: 'home' })
        }
    } catch (e) { console.error(e) }
}

async function onSaveArticle() {
    if (_.isEmpty(article.boxCode)) {
        article.boxCode = store.state.currentBox.code
    }
    try {
        await store.dispatch("saveItem", article)
    } catch (e) { console.error(e) }
    router.back()
}

function onEditArticle() {
    router.push(`/articles/edit/${article.code}`)
}

</script>