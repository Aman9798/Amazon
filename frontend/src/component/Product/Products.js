import React,{Fragment, useEffect, useState} from 'react';
import {useDispatch,useSelector} from "react-redux";
import {getProducts,clearErrors} from "../../actions/productAction.js";
import Loader from "../layout/Loader/Loader.js";
import ProductCard from "./ProductCard.js";
import {useAlert} from "react-alert";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData.js";
import "./Product.css";

const categories=[
    "All","Laptop","Footwear","Bottom","Tops","Attire","Camera","Cycle","Mobile","Desktop","Book","Bag"
]

const Products = ({match}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0,50000]);
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState(0);

    const alert = useAlert();
    const dispatch = useDispatch();
    const {loading,error,products,productsCount,resultPerPage,filteredProductsCount} = useSelector(state => state.products)

    const keyword = match.params.keyword;

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice)
    }

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const categoryHandler = (e) => {
        if(e.target.innerText===categories[0]){
            setCategory("");
        }else{
            setCategory(e.target.innerText);
        }
    }

    const ratingHandler = (e, newRating) => {
        setRating(newRating);
    }

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProducts(keyword,currentPage,price,category,rating))
    },[dispatch,alert,error,keyword,currentPage,price,category,rating])

    return (
        <Fragment>{loading ? (<Loader />) : (
            <Fragment>

                <MetaData title={"PRODUCTS --AMAZON"} />

                <h2 className="productHeading">Products</h2>
                <div className="products">
                    {products && products.map((product) => (
                        <ProductCard product={product} key={product._id} />
                    ))}
                </div>

                <div className="filterBox">
                    <Typography>Price</Typography>
                    <Slider 
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={50000}
                    />

                    <Typography>Categories</Typography>
                    <ul className="categoryBox">
                        {categories.map((category) => (
                            <li
                                className="category-link"
                                key={category}
                                value={category}
                                onClick={categoryHandler}
                            >{category}</li>
                        ))}
                    </ul>

                    <fieldset>
                        <Typography component="legend">Ratings Above</Typography>
                        <Slider
                            value={rating}
                            onChange={ratingHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="continuous-slider"
                            min={0}
                            max={5}

                        />
                    </fieldset>

                </div>

                {resultPerPage < filteredProductsCount && (
                    <div className="paginationBox">
                        <Pagination
                            activePage={currentPage} 
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />
                    </div>
                )}
            </Fragment>
        )}</Fragment>
    )
}

export default Products
