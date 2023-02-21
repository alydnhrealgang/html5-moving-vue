const unsetOption = { text: "Unset", value: "" }
const definitions = [
    {
        name: "category",
        text: "Category",
        types: ["article"],
        options: [
            unsetOption,
            { text: 'Books', value: 'Books' },
            { text: 'Bowls', value: 'Bowls' },
            { text: 'Charger', value: 'Charger' },
            { text: 'Cheongsam', value: 'Cheongsam' },
            { text: 'Clothes', value: 'Clothes' },
            { text: 'Coffee set', value: 'Coffee set' },
            { text: 'Cosmetics', value: 'Cosmetics' },
            { text: 'Cutter', value: 'Cutter' },
            { text: 'Dress', value: 'Dress' },
            { text: 'Electric equipment', value: 'Electric' },
            { text: 'Essential oils DIY materials', value: 'Diy Tools' },
            { text: 'Folks, Knives, Spoons, Chopsticks', value: 'Tableware' },
            { text: 'Gift', value: ' Gift' },
            { text: 'Medicine', value: 'Medicine' },
            { text: 'Plates', value: 'Plates' },
            { text: 'Pots', value: 'Pots' },
            { text: 'Quilt & Pillow Suits', value: 'Beddings' },
            { text: 'Scarf & Hat', value: 'Scarf & Hat' },
            { text: 'Shoes', value: 'Shoes' },
            { text: 'Slippery', value: 'Slippery' },
            { text: 'Stationary', value: 'Stationary' },
            { text: 'Tea set', value: "Tea set" },
            { text: 'Towel', value: 'Towel' },
            { text: 'Trousers(Pants)', value: 'Trousers' }
        ]
    },
    {
        name: "color",
        text: "Color",
        types: ["article"],
        options: [
            unsetOption,
            { text: "Red", value: "Red" },
            { text: "Green", value: "Green" },
            { text: "Blue", value: "Blue" },
            { text: "White", value: "White" },
            { text: "Black", value: "Black" },
            { text: "Gray", value: "Gray" },
            { text: "Purpple", value: "Purpple" },
            { text: "Pink", value: "Pink" },
        ]
    },
    {
        name: "High value",
        text: "High value",
        types: ["article"],
        options: [
            unsetOption,
            { text: "Yes", value: "Yes" },
        ]
    },
    {
        name: "Senistive",
        text: "Senistive",
        types: ["article"],
        options: [
            unsetOption,
            { text: "Yes", value: "Yes" },
        ]
    },
    {
        name: "fragile",
        text: "Fragile",
        types: ["box", "article"],
        options: [
            unsetOption,
            {
                text: "Yes",
                value: "Yes"
            }
        ]
    },
    {
        name: "size",
        text: "Size",
        types: ["box"],
        options: [
            unsetOption,
            {
                text: "XXL",
                value: "XXL",
            },
            {
                text: "XL",
                value: "XL",
            },
            {
                text: "X",
                value: "X",
            },
            {
                text: "L",
                value: "L",
            },
            {
                text: "M",
                default: true,
                value: "M",
            },
            {
                text: "S",
                value: "S",
            },
            {
                text: "XS",
                value: "XS",
            },
            {
                text: "XXS",
                value: "XXS",
            }
        ]
    },
    {
        name: "weight",
        text: "Weight",
        types: ["box"],
        options: [
            unsetOption,
            {
                value: "10KG",
                text: "10KG"
            },
            {
                value: "20KG",
                text: "20KG",
                default: true,
            },
            {
                value: "30KG",
                text: "30KG",
            },
        ]
    }
]
export default definitions