import { Toast } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { useState, useImperativeHandle, forwardRef } from "react";

const RemoveToast = ({ timeout = 3000 }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    showToast() {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, timeout);
    },
  }));

  return (
    <Toast
      className={`z-10 fixed top-5 left-5 sm:top-10 sm:left-10 m-auto border-2 mt-2 ml-2 ${
        show ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <HiX className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">
        Removed from your watchlist
      </div>
      <Toast.Toggle />
    </Toast>
  );
};

export default forwardRef(RemoveToast);
