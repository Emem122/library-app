'use client';

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
    console.log(ret);
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

  return (
    <>
      <h1>list</h1>
      {books.length > 0 && (
        <div>
          <ul>
            {books.map(book => {
              return (
                <li key={book.id} className="my-5 bg-slate-100">
                  <p>{book.title}</p>
                  <p>{book.available ? 'available' : 'unavailable'}</p>
                  <ul>
                    {book.genres.map(genre => {
                      return (
                        <li
                          key={genre}
                          className="list-inside list-item list-disc">
                          {genre}
                        </li>
                      );
                    })}
                  </ul>
                </li>
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
    </>
  );
}
