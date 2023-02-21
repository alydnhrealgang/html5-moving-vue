<template>
    <item-search-input v-model="searchText" v-model:search-type="searchType" v-model:searched="searched"
        item-type="article" :searcher="async () => await onQueryArticles(0)" @reset="onStopSearch"></item-search-input>
    <div class="article-container">
        <van-pull-refresh v-model="refreshing" @refresh="onRefreshArticles">
            <van-list v-model:loading="loading" @load="onLoadArticles" :finished="finished"
                :finished-text="finshedText">
                <van-cell v-for="article in articles" :key="article.code" :title="article.code" :value="article.name"
                    :label="`in ${article.boxCode}`" icon="goods-collect-o" center is-link
                    @click="gotoArticle(article)"></van-cell>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ItemSearchInput from '@/components/ItemSearchInput.vue'
import _ from 'lodash'
const articles = ref([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const store = useStore()
const router = useRouter()
const finshedText = computed(() => {
    return `There're ${articles.value.length} article(es)`
})

const searched = ref(false)
const searchText = ref("")
const searchType = ref("")

async function onLoadArticles() {
    const articleState = await store.dispatch("popArticlesStack")
    if (articleState) {
        articles.value = articleState.articles
        finished.value = articleState.finished
        searchText.value = articleState.searchText
        searchType.value = articleState.searchType
        searched.value = articleState.searched
        return
    }
    await onQueryArticles(articles.value.length)
    loading.value = false
}

async function onRefreshArticles() {
    finished.value = false
    loading.value = true
    await onQueryArticles(0)
    refreshing.value = false
}

function gotoArticle(article) {
    store.commit("pushArticlesStack", {
        articles: articles.value,
        finished: finished.value,
        searchText: searchText.value,
        searchType: searchType.value,
        searched: searched.value,
    })
    router.push(`/articles/view/${article.code}`)
}

async function onQueryArticles(startIndex) {
    const result = await store.dispatch("scanArticles", {
        tagName: searchType.value === 'keyword' ? "" : searchType.value,
        keyword: searchText.value,
        startIndex: startIndex,
        fetchSize: 20,
    })
    if (startIndex === 0) {
        articles.value = []
    }
    _.forEach(result, p => articles.value.push(p))
    finished.value = result.length < 20
    return true
}

async function onStopSearch() {
    await onQueryArticles(0)
}

</script>