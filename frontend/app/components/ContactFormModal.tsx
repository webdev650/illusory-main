"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useModal } from "../contexts/ModalContext";
import ContactForm from "../contact/form/contact-form";

const ContactFormModal = () => {
  const { isModalOpen, closeModal } = useModal();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
      >
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-[10000]"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactFormModal;
