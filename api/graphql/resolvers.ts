import { Db } from "mongodb";

export const resolvers = {
  Query: {
    sections: async (_: any, args: { ids?: string[] }, { db }: { db: Db }) => {
      const query = args.ids?.length ? { id: { $in: args.ids } } : {};

      return db.collection("section").find(query).toArray();
    },

    section: async (_: any, args: { id: string }, { db }: { db: Db }) => {
      return db.collection("section").findOne({ id: args.id });
    },
  },
  Mutation: {
    submitContact: async (
      _: any,
      {
        name,
        email,
        subject,
        message,
      }: { name: string; email: string; subject: string; message: string },
      { db }: { db: Db }
    ) => {
      const newEntry = {
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
      };

      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Invalid email");
      }
      if (message.length > 1000) {
        throw new Error("Message too long");
      }

      const result = await db.collection("contacts").insertOne(newEntry);

      return { _id: result.insertedId, ...newEntry };
    },
  },
};
