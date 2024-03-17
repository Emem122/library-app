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
    const readBook = async () => {
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

    readBook().then(books => {
      setBooks(books);
    });
  }, []);

  async function fetchNext(): Promise<Book[]> {
    const col = collection(db, 'books');
    const querySnapshot = await getDocs(
      query(
        col,
        orderBy('addedDate', 'desc'),
        startAfter(books[books.length - 1].addedDate),
        limit(NUM_OF_ITEMS),
      ),
    );
    const ret: Book[] = [];
    querySnapshot.forEach(doc => {
      ret.push(doc.data() as Book);
    });
    return ret;
  }
  async function fetchPrev(): Promise<Book[]> {
    const col = collection(db, 'books');
    const querySnapshot = await getDocs(
      query(
        col,
        orderBy('addedDate', 'desc'),
        endBefore(books[0].addedDate),
        limitToLast(NUM_OF_ITEMS),
      ),
    );
    const ret: Book[] = [];
    querySnapshot.forEach(doc => {
      ret.push(doc.data() as Book);
    });
    return ret;
  }

  const handleNext = () => {
    if (page >= lastPage) return;
    const nextPage = page + 1;

    fetchNext().then(books => {
      setBooks(books);
      setPage(nextPage);
    });
  };

  const handlePrev = () => {
    if (page <= 1) return;

    const prevPage = page - 1;

    fetchPrev().then(books => {
      setBooks(books);
      setPage(prevPage);
    });
  };

  const showBookDetail = (book: Book): void => {
    if (isDetailShow) return;
    setIsDetailShow(prev => !prev);
    setActiveBook(book);
  };

  const closeBookDetail = () => {
    if (!isDetailShow) return;
    setIsDetailShow(prev => !prev);
    setActiveBook(null);
  };

  const handleCheckout = async (book: Book): Promise<void> => {
    const bookData: Book = book;

    const docRef = await setDoc(doc(db, 'books', book.id), {
      ...bookData,
      available: false,
      borrower: currentUser ? currentUser.id : null,
    });

    setActiveBook(prev => {
      if (prev === null) return prev;
      return {
        ...prev,
        available: false,
        borrower: currentUser ? currentUser.id : null,
      };
    });

    setBooks(prev => {
      const prevBooks = prev;
      prevBooks.map(prevBook => {
        if (prevBook.id === bookData.id) {
          prevBook.available = false;
          prevBook.borrower = currentUser ? currentUser.id : null;
        }
      });

      return prevBooks;
    });
  };

  const handleReturn = async (book: Book): Promise<void> => {
    const bookData: Book = book;

    const docRef = await setDoc(doc(db, 'books', book.id), {
      ...bookData,
      available: true,
      borrower: null,
    });

    setActiveBook(prev => {
      if (prev === null) return prev;
      return {
        ...prev,
        available: true,
        borrower: null,
      };
    });

    setBooks(prev => {
      const prevBooks = prev;
      prevBooks.map(prevBook => {
        if (prevBook.id === bookData.id) {
          prevBook.available = true;
          prevBook.borrower = null;
        }
      });

      return prevBooks;
    });
  };

  return (
    <>
      {isDetailShow && (
        <div
          onClick={closeBookDetail}
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
                    showBookDetail={() => showBookDetail(book)}
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
          handleCheckout={() => handleCheckout(activeBook)}
          handleReturn={() => handleReturn(activeBook)}
          currentUser={currentUser}
        />
      )}
    </>
  );
}
