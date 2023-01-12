const backendBaseUrl = import.meta.env.PUBLIC_BACKEND_URL;
const isUrlValid = !!backendBaseUrl && typeof backendBaseUrl === "string";
if (!isUrlValid) throw new Error("Backend env variable not set");

export default backendBaseUrl;
