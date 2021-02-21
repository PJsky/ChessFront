export const hub_connect = () => {
    return{
        type: 'HUB_CONNECT'
    }
}
export const hub_join_group = (group) => {
    return{
        type: 'HUB_JOIN_GROUP',
        payload: group
    }
}

export const hub_quit_group = () => {
    return{
        type: "HUB_QUIT_GROUP"
    }
}