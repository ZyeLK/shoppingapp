import React, {useEffect, useState} from 'react'
import ImageGallery from 'react-image-gallery'
// npm install react-image-gallery --save
// npm gm 모듈 사용시 썸네일 사용도 가능

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            let images = []

            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })

            setImages(images)
            console.log(images)

        }
    }, [props.detail])


    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
