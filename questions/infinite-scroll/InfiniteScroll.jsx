"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./InfiniteScroll.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_URL}?_limit=10&_page=${page}`
        );
        const data = await response.json();

        if (cancelled) return;

        if (!data.length) {
          setHasMore(false);
        } else {
          setItems((prev) => [...prev, ...data]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const handleIntersect = useCallback(
    ([entry]) => {
      if (entry.isIntersecting && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    observerRef.current = new IntersectionObserver(handleIntersect);
    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [handleIntersect]);

  return (
    <div className="infinite-scroll">
      <header className="infinite-scroll__header">
        <h2 className="infinite-scroll__title">Infinite Scroll</h2>
        <p className="infinite-scroll__subtitle">
          Loads more posts from JSONPlaceholder as you scroll to the bottom.
        </p>
      </header>

      <div className="infinite-scroll__list">
        {items.map((item) => (
          <article key={item.id} className="infinite-scroll__post">
            <h3 className="infinite-scroll__post-title">{item.title}</h3>
            <p className="infinite-scroll__post-body">{item.body}</p>
          </article>
        ))}
      </div>

      <div ref={loaderRef} className="infinite-scroll__loader">
        {loading && "Loading…"}
        {!hasMore && items.length > 0 && "No more posts"}
      </div>
    </div>
  );
}
