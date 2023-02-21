import _ from 'lodash'

export default {
    lastBarcode(state) {
        return _.last(state.scannedBarCodes) || ""
    },
    hasBarcode(state) {
        return state.scannedBarCodes.length > 0
    },
    hasNavRightActions(state) {
        return state.navRightActions.length > 0
    },
    navRightActionText(state) {
        return state.navRightActions.length > 0 ? _.last(state.navRightActions).text : ''
    },
    hasArticlesState(state) {
        return state.articlesStack.length > 0
    },
    hasBoxesState(state) {
        return state.boxesStack.length > 0
    }
}