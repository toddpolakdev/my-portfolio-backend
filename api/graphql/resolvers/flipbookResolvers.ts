import { FlipBook } from "../models/FlipBook";
import {
  cloudinary,
  extractCloudinaryPublicId,
} from "../../config/cloudinary";

type Ctx = { userEmail: string | null };

export const flipbookResolvers = {
  Query: {
    // Public gallery: only published flipbooks are visible to everyone.
    flipBooks: async () => {
      return await FlipBook.find({ status: "published" }).sort({
        order: 1,
        createdAt: -1,
      });
    },
    flipBookBySlug: async (_: any, { slug }: { slug: string }) => {
      return await FlipBook.findOne({ slug });
    },
    myFlipbooks: async (_: any, __: any, context: Ctx) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      return FlipBook.find({ userEmail: context.userEmail }).sort({
        order: 1,
        createdAt: -1,
      });
    },
  },
  Mutation: {
    createFlipBook: async (_: any, { input }: any, context: Ctx) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      const maxOrder = await FlipBook.findOne()
        .sort({ order: -1 })
        .select("order");
      const order = (maxOrder?.order || 0) + 1;

      const doc = await FlipBook.create({
        ...input,
        order,
        publishedAt: input.status === "published" ? new Date() : null,
        userEmail: context.userEmail,
      });
      return String(doc._id);
    },

    updateFlipBook: async (_: any, { id, input }: any, context: Ctx) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      const doc = await FlipBook.findById(id);
      if (!doc) return false;

      // You may only edit your own flipbooks. Legacy books with no owner get
      // claimed by the editor.
      if (doc.userEmail && doc.userEmail !== context.userEmail) {
        throw new Error("Not authorized");
      }

      const publishedAt =
        input.status === "published"
          ? doc.publishedAt || new Date()
          : null;

      const res = await FlipBook.findByIdAndUpdate(
        id,
        { ...input, userEmail: context.userEmail, publishedAt },
        { new: true }
      );
      return !!res;
    },
    deleteFlipBook: async (_: any, { id }: { id: string }, context: Ctx) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      const doc = await FlipBook.findById(id);
      if (!doc) return false;

      // Only the owner may delete (legacy books without an owner stay deletable).
      if (doc.userEmail && doc.userEmail !== context.userEmail) {
        throw new Error("Not authorized");
      }

      // Best-effort cleanup of the flipbook's uploaded images in Cloudinary.
      for (const url of doc.images || []) {
        const publicId = extractCloudinaryPublicId(url);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Failed to destroy Cloudinary asset:", publicId, err);
          }
        }
      }

      await FlipBook.findByIdAndDelete(id);
      return true;
    },
    deleteImage: async (
      _: any,
      { publicId }: { publicId: string },
      context: Ctx
    ) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      const result = await cloudinary.uploader.destroy(publicId);
      // Treat an already-missing asset as success so deletes stay idempotent.
      return result.result === "ok" || result.result === "not found";
    },
    reorderFlipBooks: async (
      _: any,
      { ids }: { ids: string[] },
      context: Ctx
    ) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      try {
        // Only reorder flipbooks the user owns.
        await Promise.all(
          ids.map((id, index) =>
            FlipBook.updateOne(
              { _id: id, userEmail: context.userEmail },
              { order: index }
            )
          )
        );
        return true;
      } catch (error) {
        console.error("Error reordering flipbooks:", error);
        return false;
      }
    },
  },
};
