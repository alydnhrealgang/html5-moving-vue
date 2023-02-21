import tagDefinitions from '@/js/tags.js'
import _ from 'lodash'
import { testBarcode } from './barcodes'


export default class Item {
    constructor(type = undefined, { serverID = "", code = "", name = "", description = "", tags = {}, props = {} } = {}) {
        this._code = code
        this._name = name
        this._description = description
        this._type = type
        this._definitions = _.filter(tagDefinitions, p => _.isUndefined(p.types) || _.some(p.types, i => i === type))
        this._serverID = serverID
        this._props = props
        this.applyTags(tags)
    }

    get code() {
        return this._code
    }

    set code(value) {
        this._code = value
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value
    }

    get description() {
        return this._description
    }

    set description(value) {
        this._description = value
    }

    get tags() {
        return this._tags
    }

    get type() {
        return this._type
    }

    get photos() {
        return this._photos
    }

    get images() {
        return this._images
    }

    set images(value) {
        console.log(value)
        this._images = value
    }

    get serverID() {
        return this._serverID
    }

    set serverID(value) {
        this._serverID = value
    }

    get saved() {
        return !_.isEmpty(this._serverID)
    }

    get type() {
        return this._type
    }

    getPropValue(name) {
        return this._props[name] || ""
    }

    setPropValue(name, value) {
        if (!value || _.isEmpty(value)) {
            delete this._props[name]
        }
        this._props[name] = value
    }

    get propKeys() {
        return _.keys(this._props)
    }

    get hasTags() {
        return _.some(this._tags, p => !_.isEmpty(p.value))
    }

    get props() {
        return this._props
    }

    // getTagValue(name){
    //     const tag = _.find(this._tags, p=>p.name === name)
    //     return tag ? tag.value : ""
    // }

    isCodeValid() {
        return testBarcode(this._code)
    }

    apply(item) {
        this._name = item.name
        this._description = item.description
        this._serverID = item.serverID || ""
        this._code = item.code
        this.applyTags(item.tags || {})
        this._props = _.cloneDeep(item.props || {})
    }

    applyTags(tags) {
        this._tags = _.map(this._definitions, p => {
            const tag = { definition: p, value: "", show: false }
            const tagValue = tags[p.name]
            if (tagValue && !_.isEmpty(tagValue)) {
                tag.value = tagValue
            }
            return tag
        })
    }

    reset() {
        this._name = ""
        this._description = ""
        this.applyTags({})
        this._serverID = ""
    }

    toObject() {
        return {
            type: this.type,
            serverID: this._serverID,
            name: this._name,
            description: this._description,
            code: this._code,
            tags: _.reduce(this._tags, (o, p) => {
                if (!_.isEmpty(p.value)) {
                    o[p.definition.name] = p.value
                }
                return o
            }, {}),
            props: _.cloneDeep(this._props),
        }
    }
}