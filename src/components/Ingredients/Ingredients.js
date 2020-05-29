import React, {useCallback, useEffect, useMemo, useReducer} from 'react';
import IngredientForm from './IngredientForm';
import useHttp from "../../hooks/http";
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...state, action.ingredient]
        case 'DELETE':
            return state.filter(ingredient => ingredient.id !== action.id)
        default:
            throw new Error('Should not get there!')
    }
}

const Ingredients = () => {
    const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, []);
    const {isLoading, data, error, extra, identifier, sendRequest, clear} = useHttp();
    // const [ingredients, setIngredients] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && !error) {
            if (identifier === 'REMOVE_INGREDIENT') {
                dispatchIngredients({type: 'DELETE', id: extra})
            } else if (identifier === 'ADD_INGREDIENT') {
                dispatchIngredients({type: 'ADD', ingredient: {id: data.name, ...extra}});
            }
        }
    }, [isLoading, data, extra, identifier, error]);

    // First version
    // const addIngredientHandler = useCallback(ingredient => {
    //     setIsLoading(true);
    //     fetch('https://react-hooks-edcac.firebaseio.com/ingredients.json', {
    //         method: 'POST',
    //         body: JSON.stringify(ingredient),
    //         headers: {'Content-Type': 'application/json'}
    //     }).then(response => {
    //         setIsLoading(false);
    //         return response.json();
    //     }).then(responseData => {
    //         setIngredients(prevIngredients => [
    //             ...prevIngredients,
    //             {id: responseData.name, ...ingredient}
    //         ]);
    //     })
    // }, []);

    // Second version
    // const addIngredientHandler = useCallback(ingredient => {
    //     dispatchHttp({type: 'SEND'})
    //     fetch('https://react-hooks-edcac.firebaseio.com/ingredients.json', {
    //         method: 'POST',
    //         body: JSON.stringify(ingredient),
    //         headers: {'Content-Type': 'application/json'}
    //     }).then(response => {
    //         dispatchHttp({type: 'RESPONSE'})
    //         return response.json();
    //     }).then(responseData => {
    //         dispatchIngredients({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
    //     })
    // }, []);

    // Third version
    const addIngredientHandler = useCallback(ingredient => {
        sendRequest(
            'https://react-hooks-edcac.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT'
        )
    }, [sendRequest]);

    // First version
    // const removeIngredientHandler = useCallback(ingredientId => {
    //     setIsLoading(true);
    //     fetch(`https://react-hooks-edcac.firebaseio.com/ingredients/${ingredientId}.json`, {
    //         method: 'DELETE',
    //     }).then(response => {
    //         setIsLoading(false);
    //         //
    //         setIngredients(prevState =>
    //             prevState.filter(ingredient => ingredient.id !== ingredientId)
    //         );
    //     }).catch((error) => {
    //         setError('Something went wrong');
    //         setIsLoading(false);
    //     })
    // }, []);

    // Second version
    // const removeIngredientHandler = useCallback(ingredientId => {
    //     dispatchHttp({type: 'SEND'})
    //
    //     fetch(`https://react-hooks-edcac.firebaseio.com/ingredients/${ingredientId}.json`, {
    //         method: 'DELETE',
    //     }).then(response => {
    //         dispatchHttp({type: 'RESPONSE'})
    //         dispatchIngredients({type: 'DELETE', id: ingredientId})
    //     }).catch((error) => {
    //         dispatchHttp({type: 'ERROR', errorMessage: error.message})
    //     })
    // }, []);

    // Third version
    const removeIngredientHandler = useCallback(ingredientId => {
        sendRequest(
            `https://react-hooks-edcac.firebaseio.com/ingredients/${ingredientId}.json`,
            'DELETE',
            null,
            ingredientId,
            'REMOVE_INGREDIENT'
        )
    }, [sendRequest]);

    // useCallback prevent reload
    const setFilteredIngredientsHandler = useCallback(filteredIngredients => {
        // setIngredients(filteredIngredients);
        dispatchIngredients({type: 'SET', ingredients: filteredIngredients});
    }, []);

    // const clearError = useCallback(() => {
    //     dispatchHttp({type: 'CLEAR'});
    // }, []);

    // Example: for rendering whole component better is React.memo,
    // Prevent recreating on every lifecycle Ingredient component,
    const ingredientsList = useMemo(() => {
        return <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
    }, [ingredients, removeIngredientHandler]);

    return (
        <div className="App">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading}/>
            <section>
                <Search setFilteredIngredients={setFilteredIngredientsHandler}/>
                {ingredientsList}
            </section>
        </div>
    );
}

export default Ingredients;
