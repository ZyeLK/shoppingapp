import React, {useState} from 'react'
import Dropzone from 'react-dropzone'
// npm install react-dropzone --save
import Axios from 'axios'
import {Icon} from 'antd'

function FileUpload(props) {

    const [Images, setImages] = useState([])

    const dropHandler = (files) => {

        let formData = new FormData()
        const config = {
            header:{'content-type':'multipart/form-data'}
        }
        formData.append('file', files[0])

        Axios.post('/api/product/image', formData, config)
            .then(response => {
                if(response.data.success){
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath])
                }else{
                    alert('파일 저장에 실패했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image)

        let newImages = [...Images]
        newImages.splice(currentIndex, 1) // currentIndex부터 1개의 image를 지워줌

        setImages(newImages)
        props.refreshFunction(newImages)
    }



    return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div style={{
                            width:300, height:240, border:'1px solid lightgray',
                            display:'flex', alignItems:'center', justifyContent:'center'
                        }} {...getRootProps()}>
                        
                        <input {...getInputProps()} />
                        <Icon type='plus' style={{fontSize:'3rem'}} />

                    </div>
                    </section>
                )}
            </Dropzone>

            <div style={{display:'flex', width:'350px', height:'240px', overflowX:'scroll'}}>
                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{minWidth:'300px', width:'300px', height:'240px'}}
                            src={`http://localhost:5000/${image}`} alt='상품 이미지'/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload
