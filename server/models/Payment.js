const mongoose = require('mongoose');
const moment = require("moment");

const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    }
}, {timestamps: true})

// 검색이 어느 영역을 중심으로 이뤄질지

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }