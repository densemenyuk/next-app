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

  




};