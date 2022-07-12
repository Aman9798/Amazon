import React, { Fragment, useState } from 'react'
import MetaData from '../layout/MetaData';
import "./Search.css"

const Search = ({history}) => {

    const [keyword,setKeyword] = useState("");

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()){ // trim is used to remove spaces
            history.push(`/products/${keyword}`);
        }else{
            history.push(`/products`);
        }
    };

    return (
        <Fragment>

            <MetaData title={"SEARCH --AMAZON"} />

            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input 
                    type="text"
                    placeholder="Search a product ..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="search" />
            </form>
        </Fragment>
    )
}

export default Search
