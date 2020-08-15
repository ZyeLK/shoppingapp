import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Icon, Col, Row, Card, Button } from 'antd'
import Meta from 'antd/lib/card/Meta'

import ImageSlider from '../../utils/ImageSlider'
import { types, price } from './Sections/Datas'
import CheckBox from './Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import SearchFeature from './Sections/SearchFeature'


function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0) // 몇번째 상품부터 가져올지
    const [Limit, setLimit] = useState(4) // 한번에 몇 개 가져올지
    const [PostSize, setPostSize] = useState(2)
    const [Filters, setFilters] = useState({
        types: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState('')

    

    const getProducts = (body) => {
        Axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success){
                    if(body.loadMore){
                        setProducts([...Products, ...response.data.productsInfo])
                    }else{
                        setProducts(response.data.productsInfo)
                    }
                    setPostSize(response.data.postSize)
                }else{
                    alert('상품 정보를 가져오는 데 실패했습니다.')
                }
            })
    }

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }
        getProducts(body)        
    }, [])

    
    const loadMoreHandler = () => {
        let newSkip = Skip + Limit
        let body = {
            skip: newSkip,
            limit: Limit,
            loadMore: true
        }
        getProducts(body)
        setSkip(newSkip)
    }


    const renderCards = Products.map((product, index) => {

        return(
            <Col lg={6} md={8} xs={12} key={index}>
                <Card cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>} >
                    <Meta 
                        title={product.title}
                        description={`$${product.price}`}
                    />
                </Card>
            </Col>
        )
    })


    const showFilteredResults = (filters) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price
        let array = []

        // 최소, 최대 가격 가져오기
        for(let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }

        return array
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}
        newFilters[category] = filters

        if(category === 'price'){
            let priceValues = handlePrice(filters) // filters에 숫자가 들어있음
            newFilters[category] = priceValues // 최소, 최대 가격이 들어있음
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }


    const updateSearchTerm = (newSearchTerm) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }



    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2>컬러쇼퍼 만들고싶다 <Icon type='rocket'/></h2>
            </div>

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    <CheckBox list={types} handleFilters={filters => handleFilters(filters, 'types')}/>    
                </Col>

                <Col lg={12} xs={24}>
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, 'price')} />
                </Col>
            </Row>

            <div style={{display:'flex', justifyContent:'flex-end', margin:'1rem auto'}}>
                <SearchFeature refreshFunction={updateSearchTerm} />
            </div>            


            <Row gutter={16, 16}>
                {renderCards}
            </Row>
            
            <br />

            {PostSize >= Limit &&
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Button onClick={loadMoreHandler}>더보기</Button>
                </div>
            }
            
        </div>
    )
}

export default LandingPage
