import React from 'react';
import './subscription.css';
import branelogo from "../../assets/brane-white.svg";
import { useNavigate, useParams } from 'react-router-dom';
import GooglePayButton from '@google-pay/button-react'
import axios from "axios"
import { end_point } from '../../constants/urls';

const SubscriptionPage = () => {
    const { mobileno } = useParams()
    const navigate = useNavigate()
    const handleFreeTier = async (tier) => {
        try {
            const response = await axios.post( `${end_point}/subscribe`, {
                "subscribe_details": {
                    "mobileno": mobileno,
                    "tier": tier,
                    "date": new Date()
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response) {
                if (response && response.statusText === "OK") {
                    if(response?.data?.success){
                        navigate("/login")
                    }
                }
            }
        } catch (error) {
            alert("Something went Wrong")
            navigate(`/subscribe/${mobileno}`)
        }
    }
    return (
        <>
            <section className="subscription">
                <section className="subscription__container">
                    <article className="subscription__container__logo">
                        <img src={branelogo} alt="" />
                    </article>
                    {/* <article className="subscription__container__heading">
                        <div>Subscription Details</div>
                    </article> */}

                    <article className="subscription__container__parentdetails">
                        {/* Drop down of child */}
                    </article>

                    <article className="subscription__container__content">
                        <div className="subscription__container__content__card card1">
                            <div className="subscription__container__content__card__title">
                                Free Tier
                            </div>
                            <div className="subscription__container__content__card__price">
                                &#8377;0
                            </div>
                            <div className="subscription__container__content__card__buy-btn">
                                <button
                                    onClick={()=>handleFreeTier("free")}
                                    className='subscribe-btn'
                                >Subscribe</button>
                            </div>
                            <div className="subscription__container__content__card__text">
                                <ul>
                                    <li>Duration: 15 days</li>
                                    <li>Features Included:
                                        <ul>
                                            <li>Full access to video lectures, quizzes, assignments, and downloadable resources for only Real Numbers Demo Lectures.</li>
                                            <li>Progress tracking and performance analytics.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div className="subscription__container__content__card card2">
                            <div className="subscription__container__content__card__title">
                                Monthly Plan
                            </div>
                            <div className="subscription__container__content__card__price">
                                &#8377;200
                            </div>
                            <div className="subscription__container__content__card__buy-btn">
                                {/* <button>Subscribe</button> */}
                                <GooglePayButton
                                    environment="TEST"
                                    paymentRequest={{
                                        apiVersion: 2,
                                        apiVersionMinor: 0,
                                        allowedPaymentMethods: [
                                            {
                                                type: 'CARD',
                                                parameters: {
                                                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                                },
                                                tokenizationSpecification: {
                                                    type: 'PAYMENT_GATEWAY',
                                                    parameters: {
                                                        gateway: 'example',
                                                        gatewayMerchantId: 'exampleGatewayMerchantId',
                                                    },
                                                },
                                            },
                                        ],
                                        merchantInfo: {
                                            merchantId: '12345678901234567890',
                                            merchantName: 'Demo Merchant',
                                        },
                                        transactionInfo: {
                                            totalPriceStatus: 'FINAL',
                                            totalPriceLabel: 'Total',
                                            totalPrice: '1',
                                            currencyCode: 'INR',
                                            countryCode: 'IN',
                                        },
                                        shippingAddressRequired: true,
                                        callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
                                    }}
                                    onLoadPaymentData={paymentRequest => {
                                        console.log('Success', paymentRequest);
                                    }}
                                    onPaymentAuthorized={paymentData => {
                                        console.log('Payment Authorised Success', paymentData)
                                        return { transactionState: 'SUCCESS' }
                                    }
                                    }
                                    onPaymentDataChanged={paymentData => {
                                        console.log('On Payment Data Changed', paymentData)
                                        return {}
                                    }
                                    }
                                    existingPaymentMethodRequired='false'
                                    buttonColor='black'
                                    buttonType='Buy'
                                />
                            </div>
                            <div className="subscription__container__content__card__text">
                                <ul>
                                    <li>Access to All Courses:
                                        <ul>
                                            <li>Explore and enroll in any course available on the platform for one month.</li>
                                        </ul>
                                    </li>
                                    <li>Features Included:
                                        <ul>
                                            <li>Full access to video lectures, quizzes, assignments, and downloadable resources.</li>
                                        </ul>
                                    </li>
                                    <li>Additional Benefits:
                                        <ul>
                                            <li>New courses added regularly.</li>
                                            {/* <li>Cancel Subscription at any Time</li> */}
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div className="subscription__container__content__card card3">
                            <div className="subscription__container__content__card__title">
                                Annual Plan
                            </div>
                            <div className="subscription__container__content__card__price">
                                &#8377;2000
                            </div>
                            <div className="subscription__container__content__card__buy-btn">
                                {/* <button>Subscribe</button> */}
                                <GooglePayButton
                                    environment="TEST"
                                    paymentRequest={{
                                        apiVersion: 2,
                                        apiVersionMinor: 0,
                                        allowedPaymentMethods: [
                                            {
                                                type: 'CARD',
                                                parameters: {
                                                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                                },
                                                tokenizationSpecification: {
                                                    type: 'PAYMENT_GATEWAY',
                                                    parameters: {
                                                        gateway: 'example',
                                                        gatewayMerchantId: 'exampleGatewayMerchantId',
                                                    },
                                                },
                                            },
                                        ],
                                        merchantInfo: {
                                            merchantId: '12345678901234567890',
                                            merchantName: 'Demo Merchant',
                                        },
                                        transactionInfo: {
                                            totalPriceStatus: 'FINAL',
                                            totalPriceLabel: 'Total',
                                            totalPrice: '1',
                                            currencyCode: 'INR',
                                            countryCode: 'IN',
                                        },
                                        shippingAddressRequired: true,
                                        callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
                                    }}
                                    onLoadPaymentData={paymentRequest => {
                                        console.log('Success', paymentRequest);
                                    }}
                                    onPaymentAuthorized={paymentData => {
                                        console.log('Payment Authorised Success', paymentData)
                                        return { transactionState: 'SUCCESS' }
                                    }
                                    }
                                    onPaymentDataChanged={paymentData => {
                                        console.log('On Payment Data Changed', paymentData)
                                        return {}
                                    }
                                    }
                                    existingPaymentMethodRequired='false'
                                    buttonColor='black'
                                    buttonType='Buy'
                                />
                            </div>
                            <div className="subscription__container__content__card__text">
                                <ul>
                                    <li>Access to All Courses:
                                        <ul>
                                            <li>Enjoy unlimited access to all courses available on the platform throughout the subscription period.</li>
                                        </ul>
                                    </li>
                                    <li>Features Included:
                                        <ul>
                                            <li>Full access to video lectures, quizzes, assignments, and downloadable resources.</li>

                                        </ul>
                                    </li>
                                    <li>Additional Benefits:
                                        <ul>
                                            <li>New courses added regularly.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </article>
                </section>
            </section>
        </>
    );
};

export default SubscriptionPage;
