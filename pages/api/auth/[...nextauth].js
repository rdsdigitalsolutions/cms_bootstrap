import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log('credentials:', credentials)

                if (!credentials.username || !credentials.password) {
                    return null;
                }

                // @todo: implement real DB request to validate user.
                const user = { id: "1", name: "J Smith", email: credentials.username, image: './picture/image.jpg' }
                return user || null;
            }
        })
    ],
    callbacks: {
        // Use this to map properties to the current session.
        async session({ session, token }) {
            session.user.details = token
            return session
        }
    }
}
export default NextAuth(authOptions)
