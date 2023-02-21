<template>
    <van-form @submit="onSaveBox">
        <h2>Basic information:</h2>
        <template v-if="viewMode">
            <van-cell title="Barcode" :value="props.box.code" />
            <van-cell title="Name" :value="props.box.name" v-show="!_.isEmpty(props.box.name)" />
            <van-cell title="Description" :value="props.box.description" v-show="!_.isEmpty(props.box.description)" />
        </template>
        <van-cell-group v-else inset>
            <van-field v-model="props.box.code" label="Barcode" name="barcode" placeholder="barcode" required
                :rules="[{ required: true, message: 'the barcode is required' }, { pattern: barCodePattern, message: 'the barcode is invalid' }]"
                @blur="onBarcodeBlur" :maxlength="9" readonly />
            <van-field v-model="props.box.name" label="Name" name="name" placeholder="name" />
            <van-field v-model="props.box.description" label="Description" name="description" type="textarea" autosize
                :rows="2" placeholder="description" />
        </van-cell-group>
        <h2 v-if="!viewMode || hasPhotos">Photos</h2>
        <item-photo-uploader v-model:has-photos="hasPhotos" :view-mode="viewMode" :item="box" />
        <h2 v-if="!viewMode || box.hasTags">Tags:</h2>
        <tag-form :tags="props.box.tags" :view-mode="viewMode" />
    </van-form>
</template>
<script setup>
import Box from '@/js/box';
import { useStore } from 'vuex';
import TagForm from './TagForm.vue';
import { watch, ref, onMounted, onBeforeUnmount } from 'vue'
import _ from 'lodash'
import { barCodePattern } from '@/js/barcodes'
import ItemPhotoUploader from './ItemPhotoUploader.vue';

const hasPhotos = ref(false)
const store = useStore()
const lastBarcode = ref("")
const props = defineProps({
    box: { Type: Box, default: () => new Box() },
    viewMode: { type: Boolean, default: false }
})
const emits = defineEmits(["save", "edit"])

watch(() => props.viewMode, () => {
    store.commit("popNavRightAction")
    processNavRightAction()
})

watch(() => props.box.isVirtual, (v) => {
    store.commit("popNavRightAction")
    processNavRightAction()
})

async function onBarcodeBlur() {
    if (props.box.isCodeValid() && lastBarcode.value != props.box.code) {
        try {
            if (!await store.dispatch("parseItem", props.box)) {
                props.box.reset();
            }
            lastBarcode.value = props.box.code
        } catch (e) { console.error(e) }
    }
}

function onSaveBox() {
    emits("save")
}

function onEditBox() {
    emits("edit")
}

function processNavRightAction() {
    if (props.box.isVirtual) {
        return
    }
    const text = props.viewMode ? "Edit" : "Save"
    const action = props.viewMode ? onEditBox : onSaveBox
    store.commit("pushNavRightAction", { text, action })
}

onMounted(() => {
    processNavRightAction()
})

onBeforeUnmount(() => {
    if (props.box.isVirtual) {
        return
    }
    store.commit("popNavRightAction")
})
</script>