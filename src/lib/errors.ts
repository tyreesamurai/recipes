import { logger } from "@/lib/logger";

const envVarNotFound = (envVar: string) => {
  logger.fatal(`environment variables ${envVar} not found`);
  return new Error(`unable to local environment variable ${envVar}`);
};

const contextNotFound = () => {
  logger.fatal("useCartContext used outside of CartContextProvider");
  return CONTEXT_NOT_FOUND;
};

const localStorageMalformed = () => {
  logger.error("local storage does not contain the expected value");
  return LOCAL_STORAGE_MALFORMED;
};

const ENV_VAR_NOT_FOUND = new Error("unable to locate environment variable");

const CONTEXT_NOT_FOUND = new Error(
  "useCartContext must be used within CartContextProvider",
);
const LOCAL_STORAGE_MALFORMED = new Error(
  "local storage is not set to correct type (Recipe[])",
);

export const errors = {
  envVarNotFound,
  contextNotFound,
  localStorageMalformed,
  ENV_VAR_NOT_FOUND,
  CONTEXT_NOT_FOUND,
  LOCAL_STORAGE_MALFORMED,
};
