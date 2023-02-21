<template>
    <van-uploader v-model="fileList" :after-read="afterPhotoRead" :show-upload="!props.viewMode"
        :deletable="!props.viewMode" :before-delete="beforePhotoDelete"></van-uploader>
</template>
<script setup>
import { ref, watch } from 'vue';
import Item from '@/js/item';
import { uploadAsset, getAssets, getAssetUrl, deleteAsset } from '@/js/api.js'
import _ from 'lodash'
import { showNotify } from 'vant';
const props = defineProps({
    viewMode: { type: Boolean, default: false },
    item: { type: Item, required: true },
    hasPhotos: { type: Boolean },
    count: { type: Number }
})
const emits = defineEmits(["update:hasPhotos", "update:count"])
const fileList = ref([])

async function afterPhotoRead(file) {
    file.path = `${props.item.type}/${props.item.code}`
    file.name = `${new Date().getTime()}-${file.file.name}`
    const result = await uploadAsset(file.path, file.name, file.file)
    if (!result.success) {
        file.message = "Failed"
    }
}

async function beforePhotoDelete(file) {
    const result = await deleteAsset(file.path, file.name)
    if (!result.success) {
        showNotify({
            type: "danger",
            message: result.data || result.message || "unknown error"
        })
        return false
    }
    return true
}

watch(() => props.item.code, async (code) => {
    if (_.isEmpty(code)) {
        return
    }
    const assets = await getAssets(`${props.item.type}/${code}`)
    fileList.value = _.map(assets, p => ({
        url: getAssetUrl(p.path, p.name),
        path: p.path,
        name: p.name
    }))
    emits("update:hasPhotos", assets.length > 0)
    emits("update:count", assets.length)
})

watch(() => fileList.value.length, (v) => {
    emits("update:hasPhotos", v > 0)
    emits("update:count", v)
})
</script>