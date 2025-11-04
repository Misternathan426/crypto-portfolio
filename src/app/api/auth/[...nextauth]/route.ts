import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // Google provider
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
           process.env.GOOGLE_CLIENT_SECRET !== "your_google_client_secret" &&
           process.env.GOOGLE_CLIENT_SECRET.length > 10
           ? [GoogleProvider({
               clientId: process.env.GOOGLE_CLIENT_ID,
               clientSecret: process.env.GOOGLE_CLIENT_SECRET,
             })]
           : []
        ),
        // GitHub provider
        ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && 
           process.env.GITHUB_CLIENT_SECRET !== "your_github_client_secret" &&
           process.env.GITHUB_CLIENT_SECRET.length > 10
           ? [GitHubProvider({
               clientId: process.env.GITHUB_CLIENT_ID,
               clientSecret: process.env.GITHUB_CLIENT_SECRET,
             })]
           : []
        ),
    ],
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };