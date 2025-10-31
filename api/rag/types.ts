export type RagChunk = {
  _id?: string;
  sectionId: string;
  title: string;
  text: string;
  embedding: number[];
  createdAt: Date;
};
