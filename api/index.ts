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
  context: async () => {
    await connectDB();
    return {};
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

  // const allowedOrigin = process.env.ALLOWED_ORIGIN;
  const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(",") || [];

  if (!allowedOrigins) {
    throw new Error("ALLOWED_ORIGIN environment variable is not set.");
  }

  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  return server.createHandler({ path: "/api/graphql" })(req, res);
}
