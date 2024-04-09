import { Book } from '@/types/book';
import { User } from '@/types/user';

type PropType = {
  activeBook: Book;
  handleCheckout: () => void;
  handleReturn: () => void;
  currentUser: User;
};

export default function BookDetail({
  activeBook,
  handleCheckout,
  handleReturn,
  currentUser,
}: PropType) {
  return (
    <div className="absolute w-11/12 h-fit max-h-3/4 sm:w-2/3 sm:max-h-2/3 max-w-lg bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 sm:p-10 overflow-auto">
      <div>
        <h2 className="">{activeBook?.title}</h2>
      </div>
      <ul className="my-5 border-dashed border-t border-b py-5 px-3 flex flex-col gap-3 [&>li]:flex">
        <li>
          <p className="w-24 text-blue-400 text-sm">追加日</p>
          <p className="text-sm">{activeBook?.addedDate.substring(0, 10)}</p>
        </li>
        <li>
          <p className="w-24 text-blue-400 text-sm">在庫</p>
          <p className="text-sm">
            {activeBook?.available ? '在庫あり' : '在庫なし'}
          </p>
        </li>
        <li>
          <p className="w-24 shrink-0 text-blue-400 text-sm">カテゴリー</p>
          <div className="flex flex-wrap gap-2 [&>*]:rounded [&>*]:bg-slate-200 [&>*]:text-slate-500 [&>*]:py-0.5 [&>*]:px-2 [&>*]:text-xs">
            {activeBook?.genres.map((genre, index) => {
              return <p key={index}>{genre}</p>;
            })}
          </div>
        </li>
      </ul>
      <div className="flex justify-center [&>*]:px-8 [&>*]:py-2 [&>*]:shadow [&>*]:text-white [&>*]:rounded">
        {activeBook ? (
          activeBook.available ? (
            <button
              className="bg-blue-500 hover:bg-blue-400"
              onClick={handleCheckout}>
              貸出
            </button>
          ) : activeBook.borrower === currentUser?.id ? (
            <button
              className="bg-green-500 hover:bg-green-400"
              onClick={handleReturn}>
              返却
            </button>
          ) : (
            <button className="cursor-default bg-slate-300">貸出</button>
          )
        ) : null}
      </div>
    </div>
  );
}
