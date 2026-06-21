"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import "./ModalManager.css";

const ModalContext = createContext(null);

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function ModalPortal({ children }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return createPortal(children, document.body);
}

function ModalDialog({ modal, isTop, zIndex, onClose, onCloseTop }) {
  const handleOverlayClick = () => {
    if (isTop) onCloseTop();
  };

  return (
    <div
      className={`modal-overlay ${isTop ? "modal-overlay--top" : ""}`}
      style={{ zIndex }}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${modal.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h3 id={`modal-title-${modal.id}`} className="modal__title">
            {modal.content.title}
          </h3>
          <button
            type="button"
            className="modal__close"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="modal__body">{modal.content.body}</div>

        {modal.content.footer && (
          <footer className="modal__footer">{modal.content.footer}</footer>
        )}
      </div>
    </div>
  );
}

function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((id, content) => {
    setModals((prev) => {
      if (prev.some((m) => m.id === id)) return prev;
      return [...prev, { id, content }];
    });
  }, []);

  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const closeTopModal = useCallback(() => {
    setModals((prev) => prev.slice(0, -1));
  }, []);

  useEffect(() => {
    if (modals.length === 0) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeTopModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modals.length, closeTopModal]);

  return (
    <ModalContext.Provider
      value={{ modals, openModal, closeModal, closeTopModal }}
    >
      {children}

      <ModalPortal>
        {modals.map((modal, index) => (
          <ModalDialog
            key={modal.id}
            modal={modal}
            isTop={index === modals.length - 1}
            zIndex={1000 + index}
            onClose={() => closeModal(modal.id)}
            onCloseTop={closeTopModal}
          />
        ))}
      </ModalPortal>
    </ModalContext.Provider>
  );
}

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}

function ModalDemo() {
  const { openModal, closeModal, modals } = useModal();

  const openInfo = () => {
    openModal("info", {
      title: "Info Modal",
      body: (
        <p>
          Rendered via <code>createPortal</code> into <code>document.body</code>.
          Press ESC or click outside to close.
        </p>
      ),
      footer: (
        <button type="button" onClick={() => closeModal("info")}>
          Got it
        </button>
      ),
    });
  };

  const openConfirm = () => {
    openModal("confirm", {
      title: "Confirm Action",
      body: <p>Are you sure you want to proceed? This cannot be undone.</p>,
      footer: (
        <>
          <button type="button" onClick={() => closeModal("confirm")}>
            Cancel
          </button>
          <button
            type="button"
            className="modal-manager__danger"
            onClick={() => closeModal("confirm")}
          >
            Confirm
          </button>
        </>
      ),
    });
  };

  const openStacked = () => {
    openModal("stack-1", {
      title: "First Modal",
      body: <p>Open a second modal — ESC and outside click close the top one.</p>,
      footer: (
        <button
          type="button"
          onClick={() =>
            openModal("stack-2", {
              title: "Second Modal",
              body: (
                <p>
                  Stacked on top of the first. Use ×, ESC, or click the overlay
                  to dismiss this layer first.
                </p>
              ),
            })
          }
        >
          Open another
        </button>
      ),
    });
  };

  return (
    <div className="modal-manager">
      <header className="modal-manager__header">
        <h2 className="modal-manager__title">Modal Manager</h2>
        <p className="modal-manager__subtitle">
          Open/close modals via Context API — portal to body, click outside, and
          ESC support.
        </p>
      </header>

      <div className="modal-manager__actions">
        <button type="button" onClick={openInfo}>
          Open info
        </button>
        <button type="button" onClick={openConfirm}>
          Open confirm
        </button>
        <button type="button" onClick={openStacked}>
          Open stacked
        </button>
      </div>

      <p className="modal-manager__meta">Active modals: {modals.length}</p>

      <ul className="modal-manager__hints">
        <li>× button — close that modal</li>
        <li>Click overlay — closes top modal only</li>
        <li>ESC — closes top modal</li>
        <li>Portal — modals render outside the app tree</li>
      </ul>
    </div>
  );
}

export default function ModalManager() {
  return (
    <ModalProvider>
      <ModalDemo />
    </ModalProvider>
  );
}
