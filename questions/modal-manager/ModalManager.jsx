"use client";

import { createContext, useCallback, useContext, useState } from "react";
import "./ModalManager.css";

const ModalContext = createContext(null);

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

  return (
    <ModalContext.Provider
      value={{ modals, openModal, closeModal, closeTopModal }}
    >
      {children}
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          className="modal-overlay"
          style={{ zIndex: 1000 + index }}
          onClick={closeTopModal}
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
                onClick={() => closeModal(modal.id)}
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
      ))}
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
          This modal is managed via Context API. You can stack multiple modals
          on top of each other.
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
      body: <p>Click below to open a second modal on top.</p>,
      footer: (
        <button
          type="button"
          onClick={() =>
            openModal("stack-2", {
              title: "Second Modal",
              body: <p>Stacked modal — click overlay or × to dismiss.</p>,
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
          Open, stack, and close modals via a shared Context API.
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

      <p className="modal-manager__meta">
        Active modals: {modals.length}
      </p>
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
