const mongoose = require('mongoose');
const moment = require("moment");
const Schema = mongoose.Schema

const productSchema = mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type:String,
        maxlength:50
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        maxLength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    types: {
        type: Number,
        default: 1
    }
}, {timestamps: true})

// 검색이 어느 영역을 중심으로 이뤄질지
productSchema.index({
    title:'text',
    description:'text'
}, {
    weights:{
        title:5,
        description:1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }