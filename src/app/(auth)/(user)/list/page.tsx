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
  const NUM_OF_ITEMS = 1;

  useEffect(() => {
    //   const result = await firestore().collection('コレクション名')
    // .orderBy('createdAt', 'desc')
    // .limit(10)
    // .get();

    const readBook = async () => {
      const col = collection(db, 'books');

      const count = (await getCountFromServer(query(col))).data().count || 0;
      setLastPage(Math.floor(count / NUM_OF_ITEMS) + 1);

      const querySnapshot = await getDocs(
        query(col, orderBy('addedDate', 'desc'), limit(NUM_OF_ITEMS)),
      );
      const ret: Book[] = [];
      querySnapshot.forEach(doc => {
        ret.push(doc.data() as Book);
      });
      console.log(ret);
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

  useEffect(() => {
    console.log(lastPage);
  }, [lastPage]);

  const handleNext = () => {
    if (page >= lastPage) return;
    const nextPage = page + 1;

    fetchNext().then(books => {
      setBooks(books);
      setPage(nextPage);
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
          <button onClick={handleNext}>next</button>
        </div>
      )}
    </>
  );
}
