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
    <>
      <h1>add</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">book title</label>
          <input
            required
            className="border"
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <ul>
          {genres.map((genre, index) => {
            return (
              <li key={genre.id}>
                <input
                  className="border"
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
        <button className="bg-blue-500 text-white">add</button>
      </form>
      {isToastShow && (
        <div className="p-10 shadow-lg fixed bottom-10 right-10">success!</div>
      )}
    </>
  );
}
