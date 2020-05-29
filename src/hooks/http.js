import {useCallback, useReducer} from "react";

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
};

const httpReducer = (state, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null, data: null, extra: null, identifier: action.identifier};
        case 'RESPONSE':
            return {...state, loading: false, data: action.responseData, extra: action.extra};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR' :
            return initialState;
        default:
            throw new Error('Should not be reached!')
    }
}

const useHttp = () => {
    const [http, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), []);

    const sendRequest = useCallback((url, method, body, extra, identifier) => {
        dispatchHttp({type: 'SEND', identifier: identifier})

        fetch(url, {
            method: method,
            body: body,
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(response => {
            dispatchHttp({type: 'RESPONSE', responseData: response, extra: extra})
        }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'})
        })
    }, []);
    return {
        isLoading: http.loading,
        error: http.error,
        data: http.data,
        extra: http.extra,
        identifier: http.identifier,
        sendRequest: sendRequest,
        clear: clear
    };
}

export default useHttp;