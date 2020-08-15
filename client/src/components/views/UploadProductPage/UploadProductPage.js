import React, {useState} from 'react'
import { Typography, Button, Form, Input } from 'antd'

import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';

const { Title } = Typography
const { TextArea } = Input

const Types = [
    {key:1, value:'Shirt'},
    {key:2, value:'Sweater'},
    {key:3, value:'Hoodie'},
    {key:4, value:'Coat'},
    {key:5, value:'Pants'},
    {key:6, value:'Skirt'}
]

function UploadProductPage(props) {

    const [ProductTitle, setProductTitle] = useState('')
    const [ProductDesc, setProductDesc] = useState('')
    const [ProductPrice, setProductPrice] = useState(0)
    const [ProductType, setProductType] = useState(1)
    const [Images, setImages] = useState([])


    const titleChangeHandler = (event) => {
        setProductTitle(event.currentTarget.value)
    }
    const descChangeHandler = (event) => {
        setProductDesc(event.currentTarget.value)
    }
    const priceChangeHandler = (event) => {
        setProductPrice(event.currentTarget.value)
    }
    const TypeChangeHandler = (event) => {
        setProductType(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if(!ProductTitle || !ProductDesc || !ProductPrice || !ProductType || !Images){
            return alert('이미지를 포함해 모든 정보를 입력해주세요.')
        }

        const body = {
            writer: props.user.userData._id, // 로그인한 아이디
            title: ProductTitle,
            description: ProductDesc,
            price: ProductPrice,
            continent: ProductType,
            images: Images
        }

        Axios.post('/api/product', body)
            .then(response => {
                if(response.data.success){
                    alert('상품 등록을 완료했습니다.')
                    props.history.push('/')
                }else{
                    alert('상품 등록에 실패했습니다.')
                }
            })
    }



    return (
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>상품 등록하기</Title>
            </div>

            <Form onSubmit={submitHandler}>

                <FileUpload refreshFunction={updateImages} />

                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={ProductTitle} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descChangeHandler} value={ProductDesc} />
                <br />
                <br />
                <label>가격 ($)</label>
                <Input onChange={priceChangeHandler} value={ProductPrice} />
                <br />
                <br />
                <select onChange={TypeChangeHandler} value={ProductType}>
                    {Types.map(item => (
                        <option key={item.key} value={item.key}> {item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button htmlType='submit'>
                    확인
                </Button>
            </Form>
        </div>
    )
}

export default UploadProductPage
