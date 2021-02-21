export const user_log_out = () => {
    return{
        type: 'LOG_OUT'
    }
}
export const user_log_in = (accessToken) => {
    return{
        type: 'LOG_IN',
        payload: accessToken
    }
}