import { saveItem, getItem, getSuggestionTexts, moveItems, queryItems, deleteItem } from '@/js/api.js'
import Article from '@/js/article'
import Box from '@/js/box'
import { showNotify } from 'vant'
import _ from 'lodash'

function showErrorNotify(result) {
    showNotify({
        type: "danger",
        message: result.data || result.message || "unknown error"
    })
}

class RemoteServer {
    async saveItem(context, item) {
        const result = await saveItem(item.toObject())
        if (!result.success) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
        item.serverID = result.data
    }

    async parseItem(context, item) {
        const result = await getItem(item.code)
        if (!result.success && result.status != 404) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
        const remoteItem = result.data[0]
        if (remoteItem.type === item.type) {
            item.apply(remoteItem)
            return true
        }
        return false
    }

    async getItem(context, code) {
        const result = await getItem(code)
        if (!result.success && result.status != 404) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
        const remoteItem = result.data[0]
        if (remoteItem.type === "box") {
            return new Box(remoteItem)
        }
        if (remoteItem.type === "article") {
            return new Article(remoteItem)
        }
        return undefined
    }

    async deleteItem(context, code) {
        let result = await deleteItem(code)
        if (!result.success) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
    }

    async suggestOptions(context, { name = "", text = "" } = {}) {
        const result = await getSuggestionTexts(name, text)
        if (!result.success) {
            showErrorNotify(result)
            return []
        }
        return result.data
    }

    async loadArticles(context, boxCode) {
        const result = await getItem(boxCode, true)
        if (!result.success) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
        return _.map(result.data, p => new Article(p))
    }

    async getBoxArticles(context, boxCode) {
        return await this.loadArticles(context, boxCode)
    }

    async moveArticlesTo(context, { articles, boxCode }) {
        const codesToMove = _.map(articles, p => p.code)
        const result = await moveItems(codesToMove, boxCode)
        if (!result.success) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
    }

    async scanBoxes(context, { tagName = "", keyword = "", startIndex = 0, fetchSize = 10 } = {}) {
        if (_.isEmpty(keyword)) {
            keyword = "*"
        }
        const result = await queryItems({ type: "box", tagName, keyword, startIndex, fetchSize })
        if (!result.success) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
        return _.map(result.data, p => new Box(p))
    }

    async scanArticles(context, { tagName = "", keyword = "", startIndex = 0, fetchSize = 10 } = {}) {
        if (_.isEmpty(keyword)) {
            keyword = "*"
        }
        const result = await queryItems({ type: "article", tagName, keyword, startIndex, fetchSize })
        if (!result.success) {
            showErrorNotify(result)
            throw new Error(result.data || result.message)
        }
        return _.map(result.data, p => new Article(p))
    }

    install(actions) {
        actions.saveItem = this.saveItem
        actions.parseItem = this.parseItem
        actions.getItem = this.getItem
        actions.suggestOptions = this.suggestOptions
        actions.loadArticles = this.loadArticles
        actions.getBoxArticles = this.getBoxArticles
        actions.moveArticlesTo = this.moveArticlesTo
        // actions.loadBoxes = this.loadBoxes
        actions.scanArticles = this.scanArticles
        actions.scanBoxes = this.scanBoxes
        actions.deleteItem = this.deleteItem
    }
}

export default new RemoteServer()