import axios from "axios";
import _ from 'lodash'
const baseUrl = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:8081/v1"
const apiInstance = axios.create({
    baseURL: baseUrl,
    timeout: 60000,
})

async function uploadAsset(path, name, file, store) {
    const formData = new FormData()
    formData.append("path", path)
    formData.append("name", name)
    formData.append("contentType", file.type)
    formData.append("file", file)
    return await apiInstance.post("/assets", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

async function getAsset(path, name) {
    const url = `assets/${encodeURIComponent(path)}/${encodeURIComponent(name)}`
    return await apiInstance.get(url)
}

async function getAssets(path) {
    const url = `assets/${encodeURIComponent(path)}/*`
    const result = await apiInstance.get(url)
    return result.success ? result.data : []
}

async function deleteAsset(path, name) {
    const url = `/assets/${encodeURIComponent(path)}/${encodeURIComponent(name)}`
    return await apiInstance.delete(url)
}

function getAssetUrl(path, name) {
    return `${baseUrl}/assets/download/${encodeURIComponent(path)}/${encodeURIComponent(name)}`
}

async function saveItem(item) {
    const url = `/items`
    return await apiInstance.post(url, item)
}

async function deleteItem(code) {
    return await apiInstance.delete(`/item/${encodeURIComponent(code)}`)
}

async function getItem(code, childrenOnly = false) {
    let url = `item/${encodeURIComponent(code)}`
    return await apiInstance.get(url, { params: { childrenOnly } })
}

async function getSuggestionTexts(name, value) {
    const text = _.isEmpty(value) ? "*" : value
    const url = `suggest/${encodeURIComponent(name)}/${encodeURIComponent(text)}`
    return await apiInstance.get(url)
}

async function moveItems(codes, to) {
    const url = `items/move`
    return await apiInstance.post(url, { codes, to })
}

async function queryItems({ type = "", tagName = "", keyword = "", startIndex = 0, fetchSize = 10 } = {}) {
    const url = `items/query`
    return await apiInstance.get(url, { params: { type, tagName, keyword, startIndex, fetchSize } })
}

function registerStore(store) {
    apiInstance.interceptors.request.use((config) => {
        store.commit("processingWithServer")
        return config
    }, (e) => {
        store.commit("processedWithServer")
        return Promise.reject(e)
    })

    apiInstance.interceptors.response.use((response) => {
        store.commit("processedWithServer")
        return {
            status: response.status,
            success: true,
            data: response.data
        }
    }, (e) => {
        store.commit("processedWithServer")
        return Promise.resolve({
            status: e.response.status,
            message: e.message,
            data: e.response.data,
            code: e.code,
            success: false
        })
    })
}

export { uploadAsset, getAssets, getAsset, getAssetUrl, registerStore, deleteAsset, saveItem, getItem, getSuggestionTexts, moveItems, queryItems, deleteItem }