const EventCommunicationReducer = (state = null, action) => {
    switch(action.type){
        case "SET_EVENTS":
            return state = action.payload;
        default:
            return state;
    }
}

export default EventCommunicationReducer;