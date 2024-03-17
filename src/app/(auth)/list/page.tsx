'use client';

import BookDetail from '@/components/Book/BookDetail';
import BookItem from '@/components/Book/BookItem';
import { db } from '@/firebase';
import { useAuth } from '@/providers/auth';
import { Book } from '@/types/book';
import {
  collection,
  doc,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function Page() {
  const [isDetailShow, setIsDetailShow] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const NUM_OF_ITEMS = 3;

  const currentUser = useAuth(state => state.currentUser);

  useEffect(() => {
    const fetchBooks = async () => {
      const col = collection(db, 'books');
      const count = (await getCountFromServer(query(col))).data().count || 0;

      setLastPage(Math.floor(count / NUM_OF_ITEMS));

      const querySnapshot = await getDocs(
        query(col, orderBy('addedDate', 'desc'), limit(NUM_OF_ITEMS)),
      );
      const ret: Book[] = [];
      querySnapshot.forEach(doc => {
        ret.push(doc.data() as Book);
      });
      return ret;
    };

    fetchBooks().then(books => {
      setBooks(books);
    });
  }, []);

  const fetchBooksByPage = async (nextPage: boolean) => {
    const col = collection(db, 'books');
    const ref = query(
      col,
      orderBy('addedDate', 'desc'),
      nextPage
        ? startAfter(books[books.length - 1].addedDate)
        : endBefore(books[0].addedDate),
      nextPage ? limit(NUM_OF_ITEMS) : limitToLast(NUM_OF_ITEMS),
    );
    const querySnapshot = await getDocs(ref);
    return querySnapshot.docs.map(doc => doc.data() as Book);
  };

  const handlePageChange = (nextPage: boolean) => {
    const newPage = nextPage ? page + 1 : page - 1;
    setPage(newPage);
    fetchBooksByPage(nextPage).then(booksData => setBooks(booksData));
  };

  const handleNext = () => {
    if (page >= lastPage) return;
    handlePageChange(true);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    handlePageChange(false);
  };

  const toggleBookDetail = (book: Book) => {
    setIsDetailShow(prev => !prev);
    setActiveBook(book);
  };

  const handleCheckoutReturn = async (book: Book, available: boolean) => {
    const bookData: Book = {
      ...book,
      available,
      borrower: available ? null : currentUser?.id ?? null,
    };
    await setDoc(doc(db, 'books', book.id), bookData);
    setActiveBook(bookData);
    setBooks(prev =>
      prev.map(prevBook => (prevBook.id === book.id ? bookData : prevBook)),
    );
  };

  return (
    <>
      {isDetailShow && (
        <div
          onClick={() => setIsDetailShow(false)}
          className="w-screen h-screen bg-slate-900 opacity-40 backdrop-blur-md absolute top-0 left-0"></div>
      )}
      <div className="mt-10 max-w-lg mx-auto">
        <h1 className="text-center mb-4">所蔵一覧</h1>
        {books.length > 0 && (
          <div className="border-t">
            <ul>
              {books.map(book => {
                return (
                  <BookItem
                    key={book.id}
                    book={book}
                    showBookDetail={() => toggleBookDetail(book)}
                  />
                );
              })}
            </ul>
            <div className="mt-6 flex justify-center items-center gap-5 [&>button]:rounded [&>button]:px-4 [&>button]:py-2 [&>button]:bg-blue-500 [&>button]:text-white [&>button]:text-sm [&>button]:shadow">
              <button
                onClick={handlePrev}
                disabled={page == 1}
                className="disabled:bg-slate-300 hover:bg-blue-400">
                前のページ
              </button>
              <p className="font-mono text-slate-500 text-xs leading-loose">
                {page}
                <span className="mx-0.5">/</span>
                {lastPage}
              </p>
              <button
                onClick={handleNext}
                disabled={page >= lastPage}
                className="disabled:bg-slate-300 hover:bg-blue-400">
                次のページ
              </button>
            </div>
          </div>
        )}
      </div>
      {isDetailShow && activeBook && currentUser && (
        <BookDetail
          activeBook={activeBook}
          handleCheckout={() => handleCheckoutReturn(activeBook, false)}
          handleReturn={() => handleCheckoutReturn(activeBook, true)}
          currentUser={currentUser}
        />
      )}
    </>
  );
}
