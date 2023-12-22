import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/card.css";

const Series = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.loadSomeSerie();
    }, []);

    console.log(store.series);

    return (
        <>
            <div className="row d-flex flex-wrap justify-content-center">
                {store.series.map((item) => (
                    <div key={item.id} className="card my-5 mx-5 col" style={{ minWidth: "30rem", maxWidth: "30rem" }}>
                        <img src={'https://image.tmdb.org/t/p/w500' + item.backdrop_path} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{item.original_name}</h5>
                            <p className="card-text"> Release Date: {item.first_air_date}</p>
                            <p className="card-text"> vote: {item.vote_average}</p>

                            <div className="buttons">

                                <Link to={"/viewBigList"}>

                                    <button className="btn btn-outline-primary mt-3 button">
                                        More!
                                    </button>

                                </Link>

                                <Link to={"/viewBigList"}>

                                    <button className="btn btn-outline-primary mt-3 button" onClick={() => {
                                        actions.addFavorite(item)
                                        navigate("/viewBigList")

                                    }}>
                                        Reserved for popcorn
                                    </button>

                                </Link>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
};

export default Series;
