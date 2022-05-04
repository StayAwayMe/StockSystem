const defaultState ={
    info:{

    }
}
export default (state  = defaultState,action)=>{
    if (action.type === "getInfo") {
        let newstate = JSON.parse(JSON.stringify(state));
        newstate.info = action.value
        return newstate
    }
     
    return state
}