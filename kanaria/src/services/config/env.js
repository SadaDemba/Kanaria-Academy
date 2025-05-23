function assertEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const ENV = {
    BASE_API: assertEnvVar("REACT_APP_BASE_API"),
    NODE_ENV: process.env.NODE_ENV || "development",
    PHONE_NUMBER: "+33 7 52 02 68 48"
};
