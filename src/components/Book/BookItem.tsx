import { useAuth } from '@/providers/auth';
import { Book } from '@/types/book';

type BookItemType = {
  book: Book;
  showBookDetail: () => void;
};

export default function BookItem({ book, showBookDetail }: BookItemType) {
  const currentUser = useAuth(state => state.currentUser);

  return (
    <>
      <li
        onClick={showBookDetail}
        className="border-b  py-4 px-3 group hover:bg-slate-100 cursor-pointer">
        <div className="flex gap-4 items-center justify-between">
          <h2 className="group-hover:text-blue-500 truncate text-base">
            {book.title}
          </h2>
          <div className="shrink-0">
            {currentUser?.id === book.borrower ? (
              <>
                <p className="text-xs text-blue-400">貸出中</p>
              </>
            ) : book.available ? (
              <p className="text-xs text-green-400">在庫あり</p>
            ) : (
              <p className="text-xs text-red-400">在庫なし</p>
            )}
          </div>
        </div>
        <ul className="mt-3 flex gap-2 [&>*]:rounded [&>*]:bg-slate-200 [&>*]:text-slate-500 [&>*]:py-0.5 [&>*]:px-2 [&>*]:text-xs">
          {book.genres.map(genre => {
            return <li key={genre}>{genre}</li>;
          })}
        </ul>
      </li>
    </>
  );
}
