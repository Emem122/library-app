'use client';

import { v4 as uuidv4 } from 'uuid';
import { formatInTimeZone } from 'date-fns-tz';

import { db } from '@/firebase';
import { genres } from '@/lib/genres';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Book } from '@/types/book';

export default function Page() {
  const [isToastShow, setIsToastShow] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const checkboxRefs = useRef<HTMLInputElement[]>([]);

  const handleGenres = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedGenres.includes(e.target.value)) {
      setSelectedGenres(
        selectedGenres.filter(genre => genre !== e.target.value),
      );
    } else {
      setSelectedGenres([...selectedGenres, e.target.value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date();

    const book: Book = {
      title: title,
      id: uuidv4(),
      addedDate: formatInTimeZone(
        today,
        'Asia/Tokyo',
        'yyyy-MM-dd HH:mm:ss zzz',
      ),
      available: true,
      borrower: null,
      genres: selectedGenres,
    };
    const docRef = await setDoc(doc(db, 'books', book.id), book);

    setTitle('');
    setSelectedGenres([]);
    setIsToastShow(true);
    checkboxRefs.current.map(checkbox => {
      checkbox.checked = false;
    });
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isToastShow) {
      timeout = setTimeout(() => {
        setIsToastShow(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isToastShow]);

  return (
    <div className="px-5 mt-10 max-w-md mx-auto">
      <h1 className="text-center mb-4">新規追加</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-blue-400 text-sm font-semibold mb-2"
            htmlFor="title">
            タイトル
          </label>
          <input
            required
            className="p-1 rounded-sm border w-full focus-visible:outline-blue-500"
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <p className="text-blue-400 text-sm font-semibold mb-2">カテゴリ</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {genres.map((genre, index) => {
              return (
                <li key={genre.id} className="flex gap-1 items-center">
                  <input
                    className="border accent-blue-500"
                    type="checkbox"
                    id={genre.name}
                    value={genre.name}
                    onChange={handleGenres}
                    ref={el => {
                      if (el) {
                        checkboxRefs.current[index] = el;
                      }
                    }}
                  />
                  <label htmlFor={genre.name}>{genre.name}</label>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-8 flex justify-center">
          <button className="bg-blue-500 text-white px-8 py-2 shadow rounded hover:bg-blue-400">
            追加する
          </button>
        </div>
      </form>
      {isToastShow && (
        <div className="p-10 shadow-lg fixed bottom-10 right-10">追加完了</div>
      )}
    </div>
  );
}
