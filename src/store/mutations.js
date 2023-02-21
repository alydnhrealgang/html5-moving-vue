import { testBarcode } from "@/js/barcodes"
import _ from "lodash"
export default {
    pushBarcode(state, code) {
        if (_.isEmpty(code) || !testBarcode(code)) {
            this.dispatch("playError")
            return
        }
        if (this.getters.lastBarcode != code) {
            state.scannedBarCodes.push(code)
        }
    },
    clearBarcodes(state) {
        state.scannedBarCodes.splice(0, state.scannedBarCodes.length)
    },
    initialized(state, virtualBox) {
        state.virtualBox = virtualBox
        state.currentBox = virtualBox
        state.initialised = true
    },
    setCurrentRouteTitle(state, title) {
        state.routeTitle = title
    },
    setPreviousRoute(state, from) {
        state.previousRoute = from
    },
    processingWithServer(state) {
        state.processingWithServer = true
    },
    processedWithServer(state) {
        state.processingWithServer = false
    },
    toggleScanner(state) {
        state.switchOnScanner = !state.switchOnScanner
    },
    setCurrentBox(state, box) {
        if (state.currentBox.code === box.code) {
            return
        }
        state.previousBox = state.currentBox
        state.currentBox = box || {}
    },
    pushNavRightAction(state, { text, action }) {
        state.navRightActions.push({ text, action })
    },
    popNavRightAction(state) {
        state.navRightActions.pop()
    },
    pushArticlesStack(state, value) {
        state.articlesStack.push(value)
    },
    popArticlesStack(state) {
        state.articlesStack.pop()
    },
    pushBoxesStack(state, value) {
        state.boxesStack.push(value)
    },
    popBoxesStack(state) {
        state.boxesStack.pop()
    },
    pushUnknowBarcodeHandler(state, handle) {
        state.unknownBarcodeHandlerStack.push(handle)
    },
    showScanButton(state, value) {
        state.showScanButton = value
    }
}