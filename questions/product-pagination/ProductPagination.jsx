"use client";

import { useEffect, useMemo, useState } from "react";
import "./ProductPagination.css";

const PAGE_SIZE = 10;
const PRODUCTS_API_URL = "https://dummyjson.com/products?limit=100";

export function getNumberOfPages(totalProducts) {
  return Math.ceil(totalProducts / PAGE_SIZE);
}

export function getPageSlice(currentPage, totalProducts) {
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return { start, end: Math.min(end, totalProducts) };
}

export function canGoPrevious(currentPage) {
  return currentPage > 0;
}

export function canGoNext(currentPage, numberOfPages) {
  return currentPage < numberOfPages - 1;
}

async function fetchProducts() {
  const response = await fetch(PRODUCTS_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`);
  }

  const json = await response.json();
  return json.products ?? [];
}

function ProductCard({ title, image, price, category }) {
  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={image}
        alt={title}
        loading="lazy"
      />
      <div className="product-card__body">
        {category && <span className="product-card__category">{category}</span>}
        <h3 className="product-card__title">{title}</h3>
        {price != null && <p className="product-card__price">${price}</p>}
      </div>
    </article>
  );
}

function Pagination({
  currentPage,
  numberOfPages,
  onPageChange,
  onNext,
  onPrevious,
}) {
  const pages = Array.from({ length: numberOfPages }, (_, index) => index);

  return (
    <nav className="pagination" aria-label="Product pages">
      <button
        type="button"
        className="pagination__arrow"
        aria-label="Previous page"
        disabled={currentPage === 0}
        onClick={onPrevious}
      >
        ←
      </button>

      <div className="pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination__page ${
              page === currentPage ? "pagination__page--active" : ""
            }`}
            aria-label={`Go to page ${page + 1}`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination__arrow"
        aria-label="Next page"
        disabled={currentPage >= numberOfPages - 1}
        onClick={onNext}
      >
        →
      </button>
    </nav>
  );
}

export default function ProductPagination() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const numberOfPages = useMemo(
    () => getNumberOfPages(products.length),
    [products.length]
  );

  const visibleProducts = useMemo(() => {
    if (!products.length) return [];
    const { start, end } = getPageSlice(currentPage, products.length);
    return products.slice(start, end);
  }, [products, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) =>
      canGoNext(prev, numberOfPages) ? prev + 1 : prev
    );
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (canGoPrevious(prev) ? prev - 1 : prev));
  };

  return (
    <div className="product-pagination">
      <header className="product-pagination__header">
        <h2 className="product-pagination__title">Product Pagination</h2>
        <p className="product-pagination__subtitle">
          Fetch products from DummyJSON API and paginate {PAGE_SIZE} per page.
        </p>
      </header>

      {loading && <p className="product-pagination__status">Loading products…</p>}

      {error && (
        <p className="product-pagination__error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="product-pagination__status">No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <Pagination
            currentPage={currentPage}
            numberOfPages={numberOfPages}
            onPageChange={handlePageChange}
            onNext={goToNextPage}
            onPrevious={goToPreviousPage}
          />

          <p className="product-pagination__meta">
            Page {currentPage + 1} of {numberOfPages} · {products.length}{" "}
            products
          </p>

          <div className="product-pagination__grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                image={product.thumbnail}
                price={product.price}
                category={product.category}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            numberOfPages={numberOfPages}
            onPageChange={handlePageChange}
            onNext={goToNextPage}
            onPrevious={goToPreviousPage}
          />
        </>
      )}
    </div>
  );
}
