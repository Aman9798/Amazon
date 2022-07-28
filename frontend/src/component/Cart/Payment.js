import React,{Fragment, useState, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { useAlert } from 'react-alert'
import axios from "axios";
import {Typography} from "@material-ui/core"
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CheckOutSteps from './CheckOutSteps.js'
import MetaData from '../layout/MetaData.js'
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
  } from "@stripe/react-stripe-js";
import "./Payment.css"

const Payment = ({history}) => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const payBtn = useRef(null);

    const {shippingInfo, cartItems} = useSelector(state => state.cart)
    const {user} = useSelector(state => state.user)
  //  const {error} = useSelector(state => state.newOrder)

    const PaymentData = { amount : Math.round(orderInfo.totalPrice * 100) }  // for paise

    const submitHandler = async(e) => {
        e.preventDefault();
        payBtn.current.disabled = true;

        try{
            const config = {headers : {"Content-Type" : "application/json"}}

            const {data} = await axios.post(
                "/api/v1/payment/process",
                PaymentData,
                config
            )

            const client_secret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method : {
                    card : elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                          line1: shippingInfo.address,
                          city: shippingInfo.city,
                          state: shippingInfo.state,
                          postal_code: shippingInfo.pinCode,
                          country: shippingInfo.country,
                        },
                      },
                }
            })

            if(result.error){
                payBtn.current.disabled = false
                alert.error(result.error.message);
            }else{
                if (result.paymentIntent.status === "succeeded"){
                    history.push("/success");
                }else {
                    alert.error("There's some issue while processing payment ");
                }
            }

        }catch(error){
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }
    }

    return (
        <Fragment>
            
            <MetaData title="Payment" />
            <CheckOutSteps step={2} />

            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCardIcon />
                        <CardNumberElement className="paymentInput" />
                    </div>
                    <div>
                        <EventIcon />
                        <CardExpiryElement className="paymentInput" />
                    </div>
                    <div>
                        <VpnKeyIcon />
                        <CardCvcElement className="paymentInput" />
                    </div>

                    <input
                        type="submit"
                        value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                        ref={payBtn}
                        className="paymentFormBtn"
                    />
                </form>
            </div>
        </Fragment>
    )
}

export default Payment
