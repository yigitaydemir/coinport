import { Toast } from "flowbite-react";
import { HiCheck, HiX, HiExclamation } from "react-icons/hi";
import { useState, useImperativeHandle, forwardRef } from "react";

const AddToast = forwardRef(({ timeout = 1500 }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    showToast() {
      setShow(true);
      setTimeout(() => {
        setShow(false)
      }, timeout)
    },
  }));

  return (
    <Toast
      className={`m-auto fixed border-2 mt-2 ml-2 ${show ? "hidden" : " "}`}
    >
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <HiCheck className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">Added to your watchlist</div>
      <Toast.Toggle />
    </Toast>
  );
});

const RemoveToast = forwardRef(({ timeout = 1500 }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    showToast() {
      setShow(true);
      setTimeout(() => {
        setShow(false)
      }, timeout)
    },
  }));

  return (
    <Toast
      className={`m-auto fixed border-2 mt-2 ml-2 ${show ? "hidden" : " "}`}
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
});

const LoginToast = forwardRef(({ timeout = 1500 }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    showToast() {
      setShow(true);
      setTimeout(() => {
        setShow(false)
      }, timeout)
    },
  }));

  return (
    <Toast
      className={`m-auto fixed border-2 mt-2 ml-2 ${show ? "hidden" : " "}`}
    >
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
        <HiExclamation className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">
        You need to login to change your watchlist
      </div>
      <Toast.Toggle />
    </Toast>
  );
});

export { AddToast, RemoveToast, LoginToast };
