import { ApolloServer } from "apollo-server-micro";
import { connectDB } from "./config/db";
import { IncomingMessage, ServerResponse } from "http";
import { portfolioTypeDefs } from "./graphql/typeDefs/portfolioTypeDefs";
import { portfolioResolvers } from "./graphql/resolvers/portfolioResolvers";
import { flipbookTypeDefs } from "./graphql/typeDefs/flipbookTypeDefs";
import { flipbookResolvers } from "./graphql/resolvers/flipbookResolvers";

const server = new ApolloServer({
  typeDefs: [portfolioTypeDefs, flipbookTypeDefs],
  resolvers: [portfolioResolvers, flipbookResolvers],
  context: async ({ req }) => {
    await connectDB();

    const userEmail = (req.headers["x-user-email"] as string) || null;
    console.log("Context userEmail:", userEmail);

    return { userEmail };
  },
  introspection: true,
});

const startServer = server.start();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  await startServer;

  const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(",") || [];
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-user-email"
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  return server.createHandler({ path: "/api/graphql" })(req, res);
}
