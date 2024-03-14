'use client';

import BookItem from '@/components/Book/BookItem';
import { db } from '@/firebase';
import { Book } from '@/types/book';
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
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

  useEffect(() => {
    console.log(isDetailShow);
    console.log(activeBook);
  }, [isDetailShow, activeBook]);

  return (
    <>
      {isDetailShow && (
        <div
          onClick={closeBookDetail}
          className="w-screen h-screen bg-slate-900 opacity-40 backdrop-blur-md absolute top-0 left-0"></div>
      )}
      <div>
        <h1>list</h1>
        {books.length > 0 && (
          <div>
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
            <button
              onClick={handlePrev}
              disabled={page == 1}
              className="disabled:bg-blue-200 bg-blue-500 text-white">
              prev
            </button>
            <p>
              {page}/{lastPage}
            </p>
            <button
              onClick={handleNext}
              disabled={page >= lastPage}
              className="disabled:bg-blue-200 bg-blue-500 text-white">
              next
            </button>
          </div>
        )}
      </div>
      {isDetailShow && (
        <div className="absolute w-1/2 h-1/2 bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-10">
          <h2 className="text-2xl">{activeBook?.title}</h2>
          <ul>
            <li>追加日：{activeBook?.addedDate.substring(0, 10)}</li>
            <li>在庫：{activeBook?.available ? '在庫あり' : '貸出中'}</li>
            <li>借用人：{activeBook?.borrower ? activeBook.borrower : '-'}</li>
            <li>
              カテゴリー：
              {activeBook?.genres.map((genre, index) => {
                return (
                  <span
                    className="mx-1 py-0.5 px-1 border border-slate-300 rounded-md"
                    key={index}>
                    {genre}
                  </span>
                );
              })}
            </li>
          </ul>
          <button>貸出</button>
        </div>
      )}
    </>
  );
}
