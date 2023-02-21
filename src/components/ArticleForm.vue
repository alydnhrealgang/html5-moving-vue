<template>
    <van-form @submit="onSaveArticle">
        <h2>Basic information:</h2>
        <template v-if="viewMode">
            <van-cell title="Barcode" :value="props.article.code" />
            <van-cell title="In(box)" :value="props.article.boxCode" />
            <van-cell title="Count" :value="`x${props.article.count}`" />
            <van-cell title="Name" :value="props.article.name" v-show="!_.isEmpty(props.article.name)" />
            <van-cell title="Material" :value="props.article.material" v-show="!_.isEmpty(props.article.material)" />
            <van-cell title="Brand" :value="props.article.brand" v-show="!_.isEmpty(props.article.brand)" />
            <van-cell title="Description" :value="props.article.description"
                v-show="!_.isEmpty(props.article.description)" />
        </template>
        <van-cell-group v-else inset>
            <van-field v-model="props.article.code" label="Barcode" name="barcode" placeholder="barcode" required
                :rules="[{ required: true, message: 'the barcode is required' }, { pattern: barCodePattern, message: 'the barcode is invalid' }]"
                @blur="onBarcodeBlur" :maxlength="9" readonly />
            <van-field v-model="props.article.name" label="Name" name="name" placeholder="name" />
            <van-cell title="Count">
                <van-stepper v-model="props.article.count" theme="round" :button-size="22" />
            </van-cell>
            <popup-suggestion-field v-model="props.article.material" label="Material"
                :suggestor="async (v) => onSuggestMaterialOptions('material', v)"
                placeholder="material"></popup-suggestion-field>
            <popup-suggestion-field v-model="props.article.brand" label="Brand"
                :suggestor="async (v) => onSuggestMaterialOptions('brand', v)" placeholder="brand"></popup-suggestion-field>
            <van-field v-model="props.article.description" label="Description" name="description" type="textarea" autosize
                :rows="2" placeholder="description" />
        </van-cell-group>
        <h2 v-if="!viewMode || hasPhotos">Photos:</h2>
        <item-photo-uploader v-model:has-photos="hasPhotos" :view-mode="viewMode" :item="props.article"
            v-model:count="photoCount" />
        <div class="submit-container" v-if="!viewMode && hasPhotos && article.count != photoCount">
            <van-button type="danger" round block @click="setCountAsPhotoCount">
                Set article quantity as {{ photoCount }}
            </van-button>
        </div>
        <h2 v-if="!viewMode || props.article.hasTags">Tags:</h2>
        <tag-form :view-mode="props.viewMode" :tags="props.article.tags" />
    </van-form>
</template>
<script setup>
import Article from '@/js/article';
import { useStore } from 'vuex';
import TagForm from './TagForm.vue';
import { watch, ref, onMounted, onBeforeUnmount } from 'vue'
import _ from 'lodash'
import { barCodePattern } from '@/js/barcodes'
import PopupSuggestionField from './PopupSuggestionField.vue';
import ItemPhotoUploader from './ItemPhotoUploader.vue';
import { showNotify } from 'vant';

const photoCount = ref(0)
const hasPhotos = ref(false)
const store = useStore()
const lastBarcode = ref("")
const props = defineProps({
    article: { type: Article, default: () => new Article() },
    viewMode: { type: Boolean, default: false }
})
const emits = defineEmits(["save", "edit"])

watch(() => props.viewMode, () => {
    store.commit("popNavRightAction")
    processNavRightAction()
})

function setCountAsPhotoCount() {
    props.article.count = photoCount.value
    showNotify({
        type: "success",
        message: `The quantity of articles has been setted to ${photoCount.value}`,
        position: "bottom"
    })
}

async function onBarcodeBlur() {
    if (props.article.isCodeValid() && lastBarcode.value != props.article.code) {
        try {
            if (!await store.dispatch("parseItem", props.article)) {
                props.article.reset();
            }
            lastBarcode.value = props.article.code
        } catch (e) { console.error(e) }
    }
}

function onSaveArticle() {
    emits("save")
}

function onEditArticle() {
    emits("edit")
}

async function onSuggestMaterialOptions(name, text) {
    return await store.dispatch("suggestOptions", { name, text })
}

function processNavRightAction() {
    const text = props.viewMode ? "Edit" : "Save"
    const action = props.viewMode ? onEditArticle : onSaveArticle
    store.commit("pushNavRightAction", { text, action })
}

onMounted(() => {
    processNavRightAction()
})

onBeforeUnmount(() => {
    store.commit("popNavRightAction")
})
</script>