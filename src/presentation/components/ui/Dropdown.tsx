// components/ui/Dropdown.tsx
"use client";

import { useState, useRef, FC, MouseEvent } from "react";

export interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  onSelect: (option: Option) => void;
  placeholder?: string;
  value?: Option | null;
}

const Dropdown: FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder = "Seleccionar",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option);
    }
    setIsOpen(false);
  };

  const handleOptionClick = (
    e: MouseEvent<HTMLAnchorElement>,
    option: Option
  ) => {
    e.preventDefault();
    handleSelect(option);
  };

  const menuHeight =
    isOpen && menuRef.current ? `${menuRef.current.scrollHeight}px` : "0px";

  return (
    <div className="relative inline-block text-left w-full">
      <button
        type="button"
        className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <svg
          className={`-mr-1 ml-2 h-5 w-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* CAMBIO AQUÍ: Se añadió z-10 para asegurar que el menú esté por encima de otros elementos */}
      <div
        ref={menuRef}
        className="origin-top-left absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white overflow-hidden transition-height duration-300 ease-in-out z-10"
        style={{ height: menuHeight }}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {options.map((option) => (
            <a
              key={option.value}
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={(e) => handleOptionClick(e, option)}
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
