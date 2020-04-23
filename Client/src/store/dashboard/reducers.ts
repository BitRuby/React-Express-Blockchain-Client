const initialState = {
    addTransaction: {}
};

const dashboardReducer = (state = initialState, action: any) => {
    switch (action.type) {
        default:
            return {
                ...state
            }
    }

}

export default dashboardReducer;