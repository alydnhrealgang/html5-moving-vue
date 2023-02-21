<template>
    <van-field v-model="text" :label="$attrs.label" :name="$attrs.name"
        @update:model-value="emits('update:modelValue', text)" :placeholder="$attrs.placeholder">
        <template #button>
            <van-icon name="search" :size="16" @click="onSearch" />
        </template>
    </van-field>
    <van-popup v-model:show="showPopup" round position="bottom">
        <van-picker :title="props.pickerTitle" :columns="columns" @cancel="showPopup = false" @confirm="onConfirm" />
    </van-popup>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import _ from 'lodash';
const props = defineProps({
    iconName: { type: String, default: "search" },
    iconSize: { type: Number, default: 16 },
    pickerTitle: { type: String, default: "Choose" },
    suggestor: { type: [Promise, Function], required: true },
    modelValue: { type: String, default: "", required: true }
})

const text = ref("")
const showPopup = ref(false)
const columns = ref([])
const emits = defineEmits(["update:modelValue"])
async function onSearch() {
    let texts = []
    if (props.suggestor.constructor.name === "AsyncFunction") {
        texts = await props.suggestor(text.value)
    } else {
        texts = props.suggestor(text.value)
    }
    columns.value = _.map(texts, p => ({ text: p, value: p }))
    if (_.isArray(columns.value) && columns.value.length > 0) {
        showPopup.value = true
    }
    return
}

function onConfirm(selected) {
    const value = selected.selectedValues[0]
    if (value !== props.modelValue) {
        text.value = value
        emits("update:modelValue", value);
    }
    showPopup.value = false
}

onMounted(() => {
    text.value = props.modelValue
})

</script>