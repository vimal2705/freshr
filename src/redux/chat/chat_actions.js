export const setMessageSeen = (msg) => {
    return {
      payload: msg,
      type: 'SET_MESSAGE_SEEN'
    }
  }


  export const setOrder = (order) => {
    return {
      payload: order,
      type: 'SET_ORDER'
    }
  }