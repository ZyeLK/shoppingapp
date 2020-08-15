import React from 'react'

function HistoryPage(props) {


    return (
        <div style={{width:'80%', margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h1>결제 내역</h1>
            </div>
            <br/>
            <table>
                <thead>
                    <tr>
                        <th>결제 ID</th>
                        <th>금액</th>
                        <th>수량</th>
                        <th>결제일</th>
                    </tr>
                </thead>
                <tbody>
                    {props.user.userData && props.user.userData.history.map(item => (
                        <tr key={item._id}>
                            <td>{item._id}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.dateOfPurchase}</td>
                        </tr>
                    ))

                    }
                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage
