import Axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit){
    const request = Axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = Axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = Axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = Axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}


export function addToCart(_id){

    let body = {
        productId: _id
    }
    
    const request = Axios.post(`${USER_SERVER}/addToCart`, body)
    .then(response => response.data);

    return {
        type: ADD_TO_CART,
        payload: request
    }
}


export function getCartItems(cartItems, userCart){

    const request = Axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
        .then(response => {
            //cartItem 정보들을 product collection에서 가져오고 quantity도 넣어주기
            userCart.forEach(cartItems => {
                response.data.forEach((productDetail, index) => {
                    if(cartItems._id === productDetail._id){
                        response.data[index].quantity = cartItems.quantity
                    }
                })
            })
            return response.data
        })

    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}


export function removeCartItem(productId){

    const request = Axios.get(`/api/users/removeFromCart?id=${productId}`)
        .then(response => {
            //cart detail 업데이트하기
            response.data.cart.forEach(item => {
                response.data.productInfo.forEach((product, index) => {
                    if(item.id === product.id){
                        response.data.productInfo[index].quantity = item.quantity
                    }
                })
            })

            return response.data
        })

    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}


export function onSuccessBuy(data){

    const request = Axios.post(`/api/users/successBuy`, data)
        .then(response => response.data)
    return {
        type: ON_SUCCESS_BUY,
        payload: request
    }
}