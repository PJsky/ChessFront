import { useHistory } from "react-router-dom";


const userReducer = (state = localStorage.getItem("access_token")?true:false
, action) => {
    switch(action.type){
        case "LOG_OUT":
            localStorage.setItem("access_token", "");
            return state=false;
        case "LOG_IN":
            state = action.payload;
            return state=true;
        default:
            return state;
    }
}

export default userReducer;