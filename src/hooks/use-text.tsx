export type FontStyles = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type TextState = {
  value?: string;
  style?: FontStyles;
};

export type TextAction = {
  type: "SET_TEXT" | "SET_STYLE" | "GET_TEXT" | "GET_STYLE";
  payload: TextState;
}

export const reducerText = (state: TextState, action: TextAction): TextState => {
  switch (action.type) {
    case "SET_TEXT":
      return { ...state, value: action.payload.value || "" };
    case "SET_STYLE":
      return { ...state, style: action.payload.style || {} };
    case "GET_TEXT":
      return state;
    case "GET_STYLE":
      return { ...state, style: state.style || {} };
    default:
      return state;
  }
};
