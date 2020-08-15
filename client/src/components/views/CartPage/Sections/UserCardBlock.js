import React from 'react'
import './UserCardBlock.css'

function UserCardBlock(props) {

    const renderCartImage = (images) => {
        if(images.length > 0){
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                <td>
                    <img style={{width:'70px'}} src={renderCartImage(product.images)} alt='product'/>
                </td>
                <td>
                    {product.quantity} 개
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    <button onClick={() => props.removeItem(product._id)}>
                        삭제
                    </button>
                </td>
            </tr>
        ))
    )


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>상품 이미지</th>
                        <th>개수</th>
                        <th>가격</th>
                        <th>Product Image</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
