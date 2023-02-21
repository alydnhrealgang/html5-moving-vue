import Item from "./item";

export default class Article extends Item {
    constructor({ boxCode = "", code = "", name = "", description = "", tags = {}, count = 1, props = {} } = {}) {
        super("article", { code, name, description, tags, props })
        this._count = count
        this._boxCode = boxCode
    }

    get count() {
        return this._count
    }

    set count(value) {
        this._count = value
    }

    get material() {
        return this.getPropValue("material")
    }

    set material(value) {
        this.setPropValue("material", value)
    }

    get brand() {
        return this.getPropValue("brand")
    }

    set brand(value) {
        this.setPropValue("brand", value)
    }

    get boxCode() {
        return this._boxCode
    }

    set boxCode(code) {
        this._boxCode = code
    }

    apply(item) {
        super.apply(item)
        this._count = item.count
        this._boxCode = item.boxCode
    }

    toObject() {
        const obj = super.toObject()
        obj.count = this._count
        obj.boxCode = this._boxCode
        return obj
    }
}