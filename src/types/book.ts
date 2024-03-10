export type Book = {
  title: string;
  id: string;
  addedDate: string;
  available: boolean;
  borrower: string | null;
  genres: string[];
};
