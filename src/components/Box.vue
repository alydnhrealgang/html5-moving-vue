<template>
    <div class="box-container">
        <van-cell class="box-cell" :title="box.code" :value="box.name" :label="box.description" icon="idcard"
            size="large" center />
        <van-pull-refresh v-model="refreshing" @refresh="onRefreshArticles">
            <van-list v-model:loading="loading" @load="onLoadArticles" :finished="finished"
                :finished-text="finshedText">
                <van-cell v-for="article in articles" :key="article.code" :value="`x${article.count}`"
                    :title="article.name" :label="article.code" icon="goods-collect-o" size="large" center is-link
                    @click="onViewArticle(article)" />
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script setup>
import Box from '@/js/box'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const store = useStore()
const articles = ref([])
const router = useRouter()

const props = defineProps({
    box: { type: Box, required: true }
})

const finshedText = computed(() => {
    return `There're ${articles.value.length}(s) articles`
})

watch(() => props.box.code, onRefreshArticles)
watch(() => props.box, onRefreshArticles)

async function onLoadArticles() {
    try {
        articles.value = await store.dispatch("loadArticles", props.box.code)
    } catch (e) { console.error(e) }
    finished.value = true
    loading.value = false
}

async function onRefreshArticles() {
    finished.value = false
    loading.value = true
    await onLoadArticles()
    refreshing.value = false
}

function onViewArticle(article) {
    router.push(`/articles/view/${article.code}`)
}

</script>