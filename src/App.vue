<script setup>

import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import QrCodeScanner from './components/QrCodeScanner.vue';
import Draggable from './components/Draggable.vue';
import _ from 'lodash'

const router = useRouter();
const route = useRoute();
const store = useStore();
const showInitializeDialog = ref(false)
const cartName = ref("")
const showTypeSelector = ref(false)
const types = [
  { text: "Box", value: "box" },
  { text: "Article", value: "article" }
]
const showRealBoxNav = computed(() => {
  if (store.state.currentBox && !_.isEmpty(store.state.currentBox.code)) {
    if (!store.state.currentBox.isVirtual) {
      return true
    }
    return store.state.previousBox && store.state.previousBox.isVirtual === false
  }
  return false
})
const realBoxCode = computed(() => {
  if (!store.state.currentBox.isVirtual) {
    return store.state.currentBox.code
  }
  return store.state.previousBox.code
})

async function onInitialise() {
  try {
    await store.dispatch("initialise", cartName.value)
  } catch (e) {
    console.error(e)
    return
  }
  showInitializeDialog.value = !store.state.initialised
  localStorage.setItem("cartName", cartName.value)
  return true
}

function onTypeSelected(v) {
  showTypeSelector.value = false
  const type = v.selectedValues[0]
  if (type === "box") {
    router.push(`/boxes/edit/${store.getters.lastBarcode}`)
  } else if (type === "article") {
    router.push(`/articles/edit/${store.getters.lastBarcode}`)
  }
}

function onSwtichOnScanner() {
  store.commit("toggleScanner")
}

function onCodeScanned(text, result) {
  store.commit("pushBarcode", text)
  store.commit("toggleScanner")
}

function onNavBack() {
  router.go(-1)
}

const showLeftNavArrow = computed(() => {
  return window.history.length > 1
})

function gotoCart() {
  store.commit('setCurrentBox', store.state.virtualBox)
  if (route.name !== 'home') {
    router.replace({ name: 'home' })
  }
}

function gotoRealBox() {
  if (store.state.currentBox.isVirtual) {
    store.commit('setCurrentBox', store.state.previousBox)
  }
  if (route.name !== 'home') {
    router.replace({ name: 'home' })
  }
}

function onCancelTypeSelection() {
  showTypeSelector.value = false
  store.commit("clearBarcodes")
}

async function onUnknownBarcodeScanned(code) {
  store.commit("pushBarcode", code)
  showTypeSelector.value = true
}

watch(() => store.getters.lastBarcode, async (v) => {
  if (!_.isEmpty(v)) {
    await store.dispatch("playBeep")
  }
})

onMounted(() => {
  showInitializeDialog.value = !store.state.initialised
  cartName.value = localStorage.getItem("cartName") || ""
  store.commit("pushUnknowBarcodeHandler", onUnknownBarcodeScanned)
})

</script>
<template>
  <van-nav-bar :title="store.state.routeTitle" :left-arrow="showLeftNavArrow" @click-left="onNavBack"
    @click-right="store.dispatch('onNavRightAction')" :right-text="store.getters.navRightActionText" fixed>
  </van-nav-bar>
  <div class="main-container">
    <router-view></router-view>
  </div>
  <draggable v-if="store.state.showScanButton" :start-right="10" :start-bottom="10" :z-index="10000">
    <van-button type="primary" round icon="scan" @click="onSwtichOnScanner" class="scan-float-button" />
  </draggable>
  <van-popup v-model:show="store.state.switchOnScanner" class="scanner-popup" round :close-on-click-overlay="false">
    <h2 class="center">Scan</h2>
    <qr-code-scanner @scanned="onCodeScanned" v-if="store.state.switchOnScanner"></qr-code-scanner>
  </van-popup>
  <van-popup v-model:show="store.state.processingWithServer" :z-index="10001" round class="processing-popup"
    :close-on-click-overlay="false">
    <van-loading type-="spinner" vertical>Processing...</van-loading>
  </van-popup>
  <van-action-bar>
    <van-action-bar-icon icon="idcard" text="Boxes" @click="router.replace({ name: 'boxes' })" />
    <van-action-bar-icon icon="new-arrival-o" text="Articles" @click="router.replace({ name: 'articles' })" />
    <van-action-bar-icon icon="cart-o" text="Cart" @click="gotoCart" />
    <van-action-bar-icon v-if="showRealBoxNav" icon="bag-o" :text="realBoxCode" @click="gotoRealBox" />
  </van-action-bar>
  <van-dialog v-model:show="showInitializeDialog" title="Typing your cart name:" :z-index="10002"
    :confirm-button-disabled="_.isEmpty(cartName) || cartName.length < 5" @confirm="onInitialise">
    <van-field v-model="cartName" placeholder="cart name" />
  </van-dialog>
  <van-popup v-model:show="showTypeSelector" round position="bottom">
    <van-picker title="Choose type of barcode" :columns="types" @cancel="onCancelTypeSelection"
      @confirm="onTypeSelected" />
  </van-popup>
</template>

<style lang="scss">
.scan-float-button {
  width: 3rem;
  height: 3rem;

  .van-icon {
    font-size: 2rem;
  }
}

.main-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 3.33333rem;
  bottom: 3.33333rem;
  overflow-y: scroll;
}

.processing-popup {
  padding: 16px;
  background-color: #e2e3e3;
}
</style>
