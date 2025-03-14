import { getServerSession } from "next-auth";
import { authConfig } from "./auth.config";

export const auth = () => getServerSession(authConfig);
export { authConfig as authOptions };