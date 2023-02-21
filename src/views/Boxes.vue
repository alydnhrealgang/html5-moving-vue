<template>
    <item-search-input v-model="searchText" v-model:search-type="searchType" v-model:searched="searched" item-type="box"
        :searcher="async () => await onQueryBoxes(0)" @reset="onStopSearch"></item-search-input>
    <div class="box-container">
        <van-pull-refresh v-model="refreshing" @refresh="onRefreshBoxes">
            <van-list v-model:loading="loading" @load="onLoadBoxes" :finished="finished" :finished-text="finshedText">
                <van-cell v-for="box in boxes" :key="box.code" :title="box.code" :value="box.name"
                    :label="box.description" icon="idcard" center is-link @click="gotoBox(box)"></van-cell>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import _ from 'lodash'
const boxes = ref([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const store = useStore()
const router = useRouter()
const finshedText = computed(() => {
    return `There're ${boxes.value.length} box(es)`
})

const searched = ref(false)
const searchText = ref("")
const searchType = ref("")


async function onLoadBoxes() {
    const boxState = await store.dispatch("popBoxesStack")
    if (boxState) {
        boxes.value = boxState.boxes
        finished.value = boxState.finished
        searchText.value = boxState.searchText
        searchType.value = boxState.searchType
        searched.value = boxState.searched
        return
    }
    await onQueryBoxes(boxes.value.length)
    loading.value = false
}

async function onRefreshBoxes() {
    finished.value = false
    loading.value = true
    await onQueryBoxes(0)
    refreshing.value = false
}

function gotoBox(box) {
    store.commit("pushBoxesStack", {
        boxes: boxes.value,
        finished: finished.value,
        searchText: searchText.value,
        searchType: searchType.value,
        searched: searched.value,
    })
    router.push(`/boxes/view/${box.code}`)
}

async function onQueryBoxes(startIndex) {
    const result = await store.dispatch("scanBoxes", {
        tagName: searchType.value === 'keyword' ? "" : searchType.value,
        keyword: searchText.value,
        startIndex: startIndex,
        fetchSize: 20,
    })
    if (startIndex === 0) {
        boxes.value = []
    }
    _.forEach(result, p => boxes.value.push(p))
    finished.value = result.length < 20
    return true
}

async function onStopSearch() {
    await onQueryBoxes(0)
}
</script>