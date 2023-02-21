import Box from "@/js/box"
import _ from 'lodash'

const beep = new Audio("/sound/beep.mp3")
const error = new Audio("/sound/error.wav")

export default {
    async playBeep(context) {
        await beep.play();
    },

    async playError(context) {
        await error.play();
    },

    async initialise(context, code) {
        beep.play().then(() => error.play())
        const box = new Box({ code: `${code}'s cart`, name: 'CART' })
        await context.dispatch("saveItem", box)
        context.commit("initialized", box)
    },

    onNavRightAction(context) {
        if (context.getters.hasNavRightActions) {
            _.last(context.state.navRightActions).action()
        }
    },

    popArticlesStack(context) {
        if (context.getters.hasArticlesState) {
            const value = _.last(context.state.articlesStack)
            context.commit("popArticlesStack")
            return value
        }
        return undefined
    },

    popBoxesStack(context) {
        if (context.getters.hasBoxesState) {
            const value = _.last(context.state.boxesStack)
            context.commit("popBoxesStack")
            return value
        }
    },

    async onUnknownBarcodeScanned(context, code) {
        for (let i = context.state.unknownBarcodeHandlerStack.length - 1; i >= 0; i--) {
            const action = context.state.unknownBarcodeHandlerStack[i]
            if (!await action(code)) {
                break
            }
        }
    }
}