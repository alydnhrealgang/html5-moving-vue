<template>
    <van-popup v-model:show="showSearchTypes" round position="bottom">
        <van-picker title="Choose search type" :columns="searchTypes" @cancel="showSearchTypes = false"
            @confirm="onSearchTypeConfirmed" />
    </van-popup>
    <van-cell-group>
        <van-field :readonly="props.searched" v-model="searchText" :placeholder="`search ${props.itemType}`"
            :label="selectedSearchOption.text" left-icon="arrow-down" @click-left-icon="showSearchTypes = true">
            <template #button>
                <van-icon v-if="props.searched" name="cross" :size="16" @click="cancelSearch" />
                <van-icon v-else name="search" :size="16" @click="doSearch" />
            </template>
        </van-field>
    </van-cell-group>
</template>

<script setup>
import { ref } from 'vue'
import _ from 'lodash'
import tagDefintions from '@/js/tags'
const searchText = ref("")
const showSearchTypes = ref(false)
const selectedSearchOption = ref({ text: "Keyword", value: "keyword", children: [] })
const searchTypes = [
    selectedSearchOption.value,
    ..._.map(_.filter(tagDefintions,
        p => _.some(p.types, t => t === props.itemType)),
        p => ({ text: p.text, value: p.name, children: _.filter(p.options, o => !_.isEmpty(o.value)) }))
]
const props = defineProps({
    itemType: { type: String, required: true },
    searcher: { type: [Function, Promise], default: _.noop },
    modelValue: { type: String, required: true },
    searchType: { type: String, required: true },
    searched: { type: Boolean, required: true }
})
const emits = defineEmits(["reset", "update:modelValue", "update:searchType", "update:searched"])

function onSearchTypeConfirmed(options) {
    selectedSearchOption.value = options.selectedOptions[0]
    showSearchTypes.value = false
    if (options.selectedOptions.length > 1 && options.selectedOptions[1]) {
        searchText.value = options.selectedOptions[1].value
    }
}

function cancelSearch() {
    searchText.value = ""
    emits("update:searched", false)
    emits("update:searchType", "keyword")
    emits("update:modelValue", "")
    emits("reset")
    console.log(searchTypes)
}

async function doSearch() {
    emits("update:modelValue", searchText.value)
    emits("update:searchType", selectedSearchOption.value.value)

    if (props.searcher.constructor.name === "AsyncFunction") {
        emits("update:searched", await props.searcher(searchText.value, selectedSearchOption.value) || false)
    } else {
        emits("update:searched", props.searcher(searchText.value, selectedSearchOption.value) || false)
    }

}
</script>