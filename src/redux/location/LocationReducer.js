export const LocationReducer=(state=[],action)=>{
    switch(action.type){
        case 'LOCATION_DATA':
            return action.payload;
            
        default:
            return state
    }
}