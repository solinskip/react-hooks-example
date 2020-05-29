import React, {useEffect, useRef, useState} from 'react';
import useHttp from "../../hooks/http";
import Card from '../UI/Card';
import './Search.css';
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo(props => {
    const {setFilteredIngredients} = props;
    const [filter, setFilter] = useState('');

    const {isLoading, data, error, sendRequest, clear} = useHttp();

    const inputRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filter === inputRef.current.value) {
                let queryParams = filter.length > 0
                    ? '?' + new URLSearchParams({
                    orderBy: '"title"',
                    equalTo: `"${filter}"`
                })
                    : '';

                sendRequest(
                    'https://react-hooks-edcac.firebaseio.com/ingredients.json' + queryParams,
                    'GET'
                )
            }
        }, 500);
        // Cleanup function
        return () => {
            clearTimeout(timer);
        };
    }, [filter, inputRef, sendRequest])

    useEffect(() => {
        if (!isLoading && !error && data) {
            const ingredients = [];

            for (let [key, value] of Object.entries(data)) {
                ingredients.push({
                    id: key,
                    title: value.title,
                    amount: value.amount
                })
            }
            setFilteredIngredients(ingredients);
        }
    }, [data, isLoading, error, setFilteredIngredients])

    return (
        <section className="search">
            {error && <ErrorModal onClick={clear} >{error}</ErrorModal>}
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    {isLoading && <span>Loading...</span>}
                    <input ref={inputRef} type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
