const express = require('express');
const router = express.Router();
const multer  = require('multer')
// npm install multer --save

const { Product } = require('../models/Product')

router.post("/", (req, res) => {
    const product = new Product(req.body)
    product.save(err => {
        if(err) return res.status(400).json({success:false, err})

        return res.status(200).json({success:true})
    })
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // 파일 저장되는 곳
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`) // 저장할 이름
    }
})
   
var upload = multer({ storage: storage }).single('file')

router.post("/image", (req, res) => {
    upload(req, res, (err) => {
        if(err){
            return res.json({success:false, err})
        }

        return res.json({success:true, filePath:res.req.file.path, fileName:res.req.file.filename})
    })
});


router.post("/products", (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    let term = req.body.searchTerm


    let findArgs = {};
    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0){ // 체크된 게 하나라도 있어야 검색 제한

            if(key === 'price'){
                findArgs[key] = {
                    $gte: req.body.filters[key][0], // mongoDB 용어, greater than / equal
                    $lte: req.body.filters[key][1]  // less than / equal
                }
            }else{
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    if(term){
        Product.find(findArgs)
            .find({$text: {$search: term}}) // text가 search term과 일치하는 것만 찾기
            .populate('writer') // writer 항목에는 Id만 들어있는데, 이러면 writer 정보도 다 가져올 수 있음
            .skip(skip) // mongoDB의
            .limit(limit) // 제공 메소드
            .exec((err, productsInfo) => {
                if(err) return res.status(400).json({success: false, err})
                return res.status(200).json({success:true, productsInfo, postSize:productsInfo.length })
            })
    }else{
        Product.find(findArgs)
            .populate('writer') // writer 항목에는 Id만 들어있는데, 이러면 writer 정보도 다 가져올 수 있음
            .skip(skip) // mongoDB의
            .limit(limit) // 제공 메소드
            .exec((err, productsInfo) => {
                if(err) return res.status(400).json({success: false, err})
                return res.status(200).json({success:true, productsInfo, postSize:productsInfo.length })
            })
    }
});


router.get("/products_by_id", (req, res) => {
    let productIds = req.query.id // 도메인의 ?id=
    let type = req.query.type // single

    if(type === 'array'){
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }
    Product.find({_id: {$in: productIds}})
        .populate('writer')
        .exec((err, product) => {
            if(err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
});

module.exports = router;