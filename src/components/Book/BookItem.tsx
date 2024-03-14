import { Book } from '@/types/book';

type BookItemType = {
  book: Book;
  showBookDetail: () => void;
};

export default function BookItem({ book, showBookDetail }: BookItemType) {
  return (
    <>
      <li onClick={showBookDetail} className="my-5 bg-slate-100">
        <p>{book.title}</p>
        <p>{book.available ? 'available' : 'unavailable'}</p>
        <ul>
          {book.genres.map(genre => {
            return (
              <li key={genre} className="list-inside list-item list-disc">
                {genre}
              </li>
            );
          })}
        </ul>
      </li>
    </>
  );
}
