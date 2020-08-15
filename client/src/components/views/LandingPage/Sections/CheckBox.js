import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd'
const { Panel } = Collapse

function CheckBox(props) {

    const [Checked, setChecked] = useState([]) // 체크된 체크박스 id만 있는 거

    const handleToggle = (_id) => {
        const currentIndex = Checked.indexOf(_id)
        const newChecked = [...Checked]
        if(currentIndex === -1){
            newChecked.push(_id)
        }else{
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => (
        props.list && props.list.map((value, index) => (
            <React.Fragment key={index}>
                <Checkbox onChange={() => handleToggle(value._id)}
                    checked={Checked.indexOf(value._id) === -1 ? false : true}/>
                <span> {value.name} </span>
            </React.Fragment>
        ))
    )
    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="옷 종류로 검색하기" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
