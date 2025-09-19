import { Section } from "../models/Section";
import { Contact } from "../models/Contact";

export const portfolioResolvers = {
  Query: {
    sections: async (_: any, args: { ids?: string[] }) => {
      if (args.ids?.length) {
        return await Section.find({ id: { $in: args.ids } }).sort({
          createdAt: -1,
        });
      }
      return await Section.find().sort({ createdAt: -1 });
    },
    section: async (_: any, args: { id: string }) => {
      return await Section.findOne({ id: args.id });
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
      }: { name: string; email: string; subject: string; message: string }
    ) => {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Invalid email");
      }
      if (message.length > 1000) {
        throw new Error("Message too long");
      }

      const contact = new Contact({
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
      });

      await contact.save();
      return contact;
    },
  },
};
