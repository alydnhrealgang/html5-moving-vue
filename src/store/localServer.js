import { markRaw, toRaw } from "vue";
import _ from 'lodash'
import Article from "@/js/article";
import Box from "@/js/box";

const serverIDPrefix = "LSID"
const suggestOptions = {}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 1000))
}

function setupProxy(server) {
    return new Proxy(server, {
        get(target, propKey, receiver) {
            const method = target[propKey];
            if (method.name === "install") {
                return method
            }
            if (method.name === "loadArticles" ||
                method.name === "scanArticles") {
                return async function (...args) {
                    return method.apply(server, args)
                }
            }
            return async function (...args) {
                try {
                    args[0].commit("processingWithServer")
                    return await method.apply(server, args)
                } catch (e) {
                    throw e
                } finally {
                    args[0].commit("processedWithServer")
                }
            }
        }
    })
}

class LocalServer {

    constructor() {
        this._items = markRaw([])
    }

    async saveItem(context, item) {
        await sleep()
        const index = _.findIndex(this._items, p => p.code == item.code)
        if (index > -1) {
            this._items[index] = item.toObject()
        } else {
            item.serverID = _.uniqueId(serverIDPrefix)
            this._items.push(item.toObject())
        }

        _.each(item.props, k => {
            let values = item.props[k]
            if (_.isUndefined(values)) {
                values = []
                item.props[k] = values
            }
            values.push(item.getPropValue(k))
        })
    }

    async moveArticlesTo(context, { articles, boxCode }) {
        await sleep()
        const items = []
        _.forEach(articles, p => {
            const item = _.find(this._items, i => i.code === p.code)
            if (_.isUndefined(item)) {
                throw new Error(`Cannot found the ${p.code} of article`)
            }
            if (item.type !== 'article') {
                throw new Error(`The barcode ${p.code} is not a article`)
            }
            items.push(item)
        })
        _.forEach(items, p => p.boxCode = boxCode)
        _.forEach(articles, p => p.boxCode = boxCode)
    }

    async parseItem(context, item) {
        await sleep()
        const localItem = _.find(this._items, p => p.code == item.code)
        if (localItem && localItem.type == item.type) {
            item.apply(localItem)
            return true
        }
        return false
    }

    async getItem(context, code) {
        await sleep()
        const result = _.find(this._items, p => p.code == code)
        if (!result) {
            return undefined
        }
        if (result.type === 'box') {
            return new Box(result)
        }
        if (result.type === 'article') {
            return new Article(result)
        }
        return undefined
    }

    async suggestOptions(context, { name = "", text = "" } = {}) {
        await sleep()
        const options = suggestOptions[name] || []
        return _.filter(options, p => p.indexOf(text) >= 0)
    }

    async loadArticles(context, boxCode) {
        await sleep()
        const result = _.filter(this._items, p => p.type === 'article' && p.boxCode === boxCode)
        return _.map(result, p => new Article(p))
    }

    async scanItems(context, type, { tagName = "", keyword = "", startIndex = 0, fetchSize = 10 } = {}, itemFactory) {
        await sleep()
        const articles = _.filter(this._items, p => {
            if (p.type !== type) {
                return false
            }
            if (!_.isEmpty(keyword)) {
                if (!_.isEmpty(tagName)) {
                    if (!p.tags || p.tags[tagName] !== keyword) {
                        return false
                    }
                } else if (p.name.indexOf(keyword) < 0 &&
                    p.description.indexOf(keyword) < 0 &&
                    p.brand.indexOf(keyword) &&
                    p.material.indexOf(keyword)) {
                    return false
                }
            }
            return true
        })
        const result = []
        for (let i = startIndex; i < articles.length && result.length < fetchSize; i++) {
            result.push(itemFactory(articles[i]))
        }
        return result
    }

    async scanBoxes(context, { tagName = "", keyword = "", startIndex = 0, fetchSize = 10 } = {}) {
        return await this.scanItems(context, "box", { tagName, keyword, startIndex, fetchSize }, p => new Box(p))
    }

    async scanArticles(context, { tagName = "", keyword = "", startIndex = 0, fetchSize = 10 } = {}) {
        return await this.scanItems(context, "article", { tagName, keyword, startIndex, fetchSize }, p => new Article(p))
    }

    async getBoxArticles(context, boxCode) {
        return await this.loadArticles(context, boxCode)
    }

    async loadBoxes(context) {
        await sleep()
        const result = _.filter(this._items, p => p.type === 'box')
        return _.map(result, p => new Box(p))
    }

    install(actions) {
        actions.saveItem = this.saveItem
        actions.parseItem = this.parseItem
        actions.getItem = this.getItem
        actions.suggestOptions = this.suggestOptions
        actions.loadArticles = this.loadArticles
        actions.getBoxArticles = this.getBoxArticles
        actions.moveArticlesTo = this.moveArticlesTo
        actions.loadBoxes = this.loadBoxes
        actions.scanArticles = this.scanArticles
        actions.scanBoxes = this.scanBoxes
    }

    createProxy() {
        return setupProxy(this)
    }
}

export default new LocalServer()