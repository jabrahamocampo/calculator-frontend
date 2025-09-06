import { useEffect } from "react";

export default function useKeyboardShortcuts({
  setSelectedType,
  handleSquareRoot,
  handleRandomString,
  handleExecute,
  selectRef,
}) {
  useEffect(() => {
      const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT" ||
        activeElement.isContentEditable;

      if (isTyping) {
        return;
      }

      switch (e.key) {
        case "+": 
          e.preventDefault();
          setSelectedType("addition");
          break;
        case "-":
          e.preventDefault();
          setSelectedType("subtraction");
          break;
        case "*":
          e.preventDefault();
          setSelectedType("multiplication");
          break;
        case "/":
          e.preventDefault();
          setSelectedType("division");
          break;
        case "r":
          e.preventDefault();
          handleSquareRoot();
          break;
        case "a":
          e.preventDefault();
          handleRandomString();
          break;
        case "Enter":
          e.preventDefault();
          handleExecute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedType, handleSquareRoot, handleRandomString, handleExecute, selectRef]);
}
