'use client';

import { db } from '@/firebase';
import { useAuth } from '@/providers/auth';
import { Book } from '@/types/book';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const currentUser = useAuth(state => state.currentUser);
  const [userCheckoutBooks, setUserCheckoutBooks] = useState<Book[]>([]);

  useEffect(() => {
    const checkoutBooks = async () => {
      const col = collection(db, 'books');
      const ret: Book[] = [];
      if (currentUser?.id !== undefined) {
        const querySnapshot = await getDocs(
          query(col, where('borrower', '==', currentUser.id)),
        );
        querySnapshot.forEach(doc => {
          ret.push(doc.data() as Book);
        });
      }
      return ret;
    };
    checkoutBooks().then(books => {
      setUserCheckoutBooks(books);
    });
  }, [currentUser]);

  const handleReturn = async (book: Book): Promise<void> => {
    const bookData: Book = book;

    const docRef = await setDoc(doc(db, 'books', book.id), {
      ...bookData,
      available: true,
      borrower: null,
    });

    const filteredBooks = userCheckoutBooks.filter(
      userBook => userBook.id !== book.id,
    );
    setUserCheckoutBooks(filteredBooks);
  };

  return (
    <>
      <div className="mt-14 flex justify-center gap-5 [&>*]:px-10 [&>*]:py-4 [&>*]:rounded-lg [&>*]:shadow-md [&>*]:border border-slate-200">
        <Link href="/add" className="hover:bg-slate-100">
          新規追加
        </Link>
        <Link href="/list" className="hover:bg-slate-100">
          貸出
        </Link>
      </div>

      <div className="px-4 mt-14">
        <p className="text-center mb-4">貸出一覧</p>
        <ul className="max-w-lg mx-auto border-t">
          {userCheckoutBooks.length > 0 ? (
            userCheckoutBooks.map(book => {
              return (
                <li
                  key={book.id}
                  className="flex items-center gap-5 border-b py-4 px-3">
                  <p className="truncate">{book.title}</p>
                  <button
                    className="shrink-0 ml-auto border border-slate-200 bg-slate-200 text-slate-600 px-3 py-1 text-sm rounded-md shadow-sm hover:bg-slate-100"
                    onClick={() => handleReturn(book)}>
                    返却
                  </button>
                </li>
              );
            })
          ) : (
            <>
              <p className="mt-5 text-center">現在貸出中のものはありません</p>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
