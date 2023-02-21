<template>
    <van-cell-group inset>
        <van-cell v-if="props.viewMode" v-for="tag in props.tags" :key="tag.definition.name"
            :title="tag.definition.text" :value="tag.value" v-show="tag.value.length > 0" />
        <template v-else>
            <van-field :key="tag.definition.name" v-for="tag in props.tags" v-model="tag.value"
                :label="tag.definition.text" readonly placeholder="choose..." is-link @click="tag.show = true" />
            <van-popup :key="tag.definition.name" v-for="tag in props.tags" v-model:show="tag.show" round
                position="bottom">
                <van-picker :title="'Choose ' + tag.definition.text" :columns="tag.definition.options"
                    @cancel="tag.show = false" @confirm="(value) => onConfirmTagValue(tag, value)" />
            </van-popup>
        </template>
    </van-cell-group>
</template>
<script setup>
const props = defineProps({
    tags: { type: Array, required: true },
    viewMode: { type: Boolean, default: false }
})
function onConfirmTagValue(tag, value) {
    tag.value = value.selectedValues[0]
    tag.show = false
}
</script>