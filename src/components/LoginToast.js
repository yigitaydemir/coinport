import { Toast } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";
import { useState, useImperativeHandle, forwardRef } from "react";

const LoginToast = ({ timeout = 1500 }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    showToast() {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, timeout);
      console.log("burası da çalıştı");
    },
  }));

  return (
    <Toast
      className={`z-10 absolute top-10 left-10 m-auto border-2 mt-2 ml-2 ${
        show ? "translate-x-0" : "-translate-x-96"
      }`}
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
};

export default forwardRef(LoginToast);