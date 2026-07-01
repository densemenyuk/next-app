"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState} from "react";

type Book = {
    id: number;
    volumeInfo: {
        title: string;
        authors?: string[];
        imageLinks?: {thumbnail?: string}
        description?: string;
        infoLink?: string;
    };
};

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (!query) {
      setBooks([]); setError(null); return;
    }
    setLoading(true); setError(null);

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        if (data.items) setBooks(data.items);
        else setBooks([]);
      })
      .catch(() => {
        setLoading(false);
        setError("Ошибка при получении данных. Попробуйте позже.");
      });
  }, [query]);

    return (
        <main>
            <h1>Результаты поиска: {query}</h1>
            {loading && <div>Загрузка...</div>}
            {error && <div style={{color:'red'}}>{error}</div>}
            {!loading && !error && books.length === 0 && <p>Ничего не найдено.</p>}
            <ul>
                {books.map(book => {
                    const v = book.volumeInfo;
                    return (
                        <li key={book.id} style={{marginBottom: 32}}>
                            <strong>{v.title}</strong>
                            {v.authors && <> - {v.authors.join(",")}</>}
                            <div>
                                {v.imageLinks?.thumbnail && (
                                    <img src={v.imageLinks.thumbnail} alt={v.title} style={{height:110, marginTop: 6}} />
                                )}
                            </div>
                            {v.description && <div style={{maxWidth: 430}}>{v.description.slice(0, 140)}...</div>}
                            {v.infoLink && (
                                <div>
                                    <a href={v.infoLink} target='_blank' rel="noopener noreferrer">Подробнее</a>
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>
        </main>
    )




};