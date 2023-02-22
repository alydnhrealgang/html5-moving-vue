import _ from 'lodash'
import { showConfirmDialog } from 'vant'
async function moveArticlesFromVirtualBoxTo(store, box) {
    if (!_.isEmpty(store.state.currentBox) && store.state.currentBox.isVirtual) {
        const virtualBoxCode = store.state.virtualBox.code
        if (virtualBoxCode !== box.code) {
            try {
                const articles = await store.dispatch("loadArticles", virtualBoxCode)
                if (!_.isEmpty(articles)) {
                    try {
                        await showConfirmDialog({
                            title: `Moving articles`,
                            message: `Do you want moving ${articles.length} article(s) from ${virtualBoxCode} to this box?`,
                        })
                    } catch {
                        return false
                    }
                    await store.dispatch("moveArticlesTo", { articles, boxCode: box.code })
                    return true
                }
            } catch (e) { console.error(e) }
        }
    }
    return false
}

async function moveArticlesTo(store, article, box) {
    try {
        await showConfirmDialog({
            title: `Moving article`,
            message: `Do you want moving ${article.code} from box: ${article.boxCode} to box: ${box.code}?`,
        })
    } catch {
        return false
    }
    await store.dispatch("moveArticlesTo", { articles: [article], boxCode: box.code })
    return true
}

async function confirmSetCurrentBox(store, box) {
    try {
        await showConfirmDialog({
            title: `Moving articles`,
            message: `Would like to set box ${box.code} to this box?`,
        })
        store.commit("setCurrentBox", box)
        return true
    } catch { }
    return false
}

export { moveArticlesFromVirtualBoxTo, moveArticlesTo, confirmSetCurrentBox }