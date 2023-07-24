import { useState } from "react";
import { HiCheck } from "react-icons/hi";

const AddToast = () => {
  const [show, setShow] = useState;

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
};

export default AddToast;