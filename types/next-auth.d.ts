import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
  }
}

declare module "next-auth" {
  interface Session {}
}
