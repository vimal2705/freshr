let INITIAL_STATE = {
    seen: false,
    order: null
}
export const chatReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_MESSAGE_SEEN':
            return {...INITIAL_STATE, seen:action.payload}
        case 'SET_ORDER':
            return {...INITIAL_STATE, order:action.payload}
        default:
            return {...INITIAL_STATE}
    }
}