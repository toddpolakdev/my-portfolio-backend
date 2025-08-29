import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { connectToDatabase } from "../mongo";
import { IncomingMessage, ServerResponse } from "http";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const db = await connectToDatabase();
    return { db };
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

  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  if (!allowedOrigin) {
    throw new Error("ALLOWED_ORIGIN environment variable is not set.");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  return server.createHandler({ path: "/api/graphql" })(req, res);
}
