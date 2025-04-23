import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: "toast",
  initialState: {
    messages: []
  },
  reducers: {
    pushMessage(state, action){

      const id = Date.now();
      if (action.payload.success){
        state.messages.push({
          id,
          message: action.payload.message,
          status: 'success'
        })
      }else{
        state.messages.push({
          id,
          message: Array.isArray(action.payload.message) ? action.payload.message.join("\n") : action.payload.message,
          status: 'false'
        })
      }
    },
    removeMessage(state, action){
      const removeId = action.payload;
      state.messages = state.messages.filter(message => message.id !== removeId);
    }
  }
})

export const { pushMessage, removeMessage } = toastSlice.actions;
export default toastSlice.reducer;