const ENV_VAR_NOT_FOUND = new Error("unable to locate environment variable");
const CONTEXT_NOT_FOUND = new Error(
  "useCartContext must be used within CartContextProvider",
);

export const errors = {
  ENV_VAR_NOT_FOUND,
  CONTEXT_NOT_FOUND,
};
