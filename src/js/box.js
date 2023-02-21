import Item from "./item";
import _ from 'lodash'
import { testBarcode } from './barcodes'

export default class Box extends Item {
    constructor({ code = "", name = "", description = "", tags = {} } = {}) {
        super("box", { code, name, description, tags })
    }

    get isVirtual() {
        return !testBarcode(this.code)
    }
}