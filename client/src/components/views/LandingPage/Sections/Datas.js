const types = [
    {_id:1, name:'Shirt'},
    {_id:2, name:'Sweater'},
    {_id:3, name:'Hoodie'},
    {_id:4, name:'Coat'},
    {_id:5, name:'Pants'},
    {_id:6, name:'Skirt'}
]

const price = [
    {_id:0, name:'Any', array:[]},
    {_id:1, name:'$0 - $19', array:[0, 19]},
    {_id:2, name:'$20 - $39', array:[20, 39]},
    {_id:3, name:'$40 - $59', array:[40, 59]},
    {_id:4, name:'$60 - $79', array:[60, 79]},
    {_id:5, name:'$80 -', array:[80, 100000]}
]

export { types, price }