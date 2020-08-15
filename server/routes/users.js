const express = require('express');
const router = express.Router();
const async = require('async')

const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const {Product} = require('../models/Product');
const {Payment} = require('../models/Payment')

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.post("/addToCart", auth, (req, res) => {
    
    // user collection에서 해당 user 정보 가져오기
    User.findOne({_id: req.user._id}, (err, userInfo) => {
        // 이미 해당 상품이 들어있는지 확인하기
        let duplicate = false
        userInfo.cart.forEach((item) => {
            if(item._id === req.body.productId){
                duplicate = true
            }
        })
        
        if(duplicate){
            User.findOneAndUpdate(
                {_id: req.user._id, 'cart._id': req.body.productId},
                {$inc: {'cart.$.quantity': 1}}, // increment
                {new: true}, // 업데이트된 정보를 받기 위해서 필요
                (err, userInfo) => {
                    if(err) return res.status(200).json({success: false, err})
                    res.status(200).send(userInfo.cart) // cart 부분만 프론트엔드로
                }
            )
        }else{
            User.findOneAndUpdate(
                {_id: req.user._id},
                {$push: {cart: {
                    _id: req.body.productId,
                    quantity: 1,
                    date: Date.now()
                }}},
                {new: true},
                (err, userInfo) => {
                    if(err) return res.status(400).json({success:false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        }
    })
});

router.get('/removeFromCart', auth, (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            $pull:{
                cart:{
                    _id: req.query.id
                }
            }
        },
        {new: true},
        (err, userInfo) => {
            let cart = userInfo.cart
            let array = cart.map(item => {
                return item.id
            })
            
            Product.find({_id: {$in: array}}) // array에 있는 모든 id에 해당하는 상품 가져옴
                .populate('writer')
                .exec((err, productInfo) => {
                    return res.status(200).json({productInfo, cart})
                })
        }
    )
})


router.get('/successBuy', auth, (req, res) => {
    // user의 history 넣기
    let history = []
    let transactionData = {}

    req.vody.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            _id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentId
        })
    })

    // payment에 저장할 transaction
    transactionData.user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history

    User.findOneAndUpdate( // history 넣기
        {_id: req.user._id},
        {$push:{history: history}, $set:{cart: []}},
        {new: true},
        (err, userInfo) => {
            if(err) return res.status(400).json({success: false, err})
            const payment = new Payment(transactionData)

            // payment에 transaction 넣기
            payment.save((err, doc) => {
                if(err) return res.status(400).json({success: false, err})

                // product의 sold 넣기
                let products = []
                doc.product.forEach(item => {
                    products.push({_id: item._id, quantity: item.quantity})
                })

                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        {_id: item._id},
                        {$inc: {
                            sold: item.quantity
                        }},
                        {new: false}, // 새 document를 frontend에 안 보내도 됨
                        callback
                    )
                }, (err) => {
                    if(err) return res.json({success:false, err})
                    res.status(200).json({
                        success:true,
                        cart: userInfo.cart,
                        cartDetail:[]
                    })
                })
            })
        }
    )

    // product의 sold 넣기
    
})

module.exports = router;