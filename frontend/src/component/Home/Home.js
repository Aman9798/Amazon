import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/all"
import "./Home.css"
import ProductCard from '../Product/ProductCard.js'
import MetaData from "../layout/MetaData.js"
import { clearErrors, getProducts } from '../../actions/productAction'
import {useSelector, useDispatch} from "react-redux";
import Loader from '../layout/Loader/Loader.js'
import {useAlert} from "react-alert";

const Home = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const {loading,error,products} = useSelector(state => state.products)

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProducts());
    },[dispatch,error,alert]) 

    return (

        <Fragment>
            {loading ? (
                <Loader />   // loading component
            ) : (
                <Fragment>

                    <MetaData title="AMAZON" />

                    <div className="banner">
                        {/* <p></p>
                        <h1></h1> */}

                        <a href="#container">  {/*refering to container below */}
                            <button>
                                Scroll <CgMouse />
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>

                    <div className="container" id="container">

                        {products && products.map((product) => (
                            <ProductCard product={product} key={product._id}/>
                        ))}

                    
                    </div>

                </Fragment>
            )}
        </Fragment>
    )
}

export default Home
