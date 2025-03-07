const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case "LOGIN_FAILURE":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        error: action.payload.error,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;
