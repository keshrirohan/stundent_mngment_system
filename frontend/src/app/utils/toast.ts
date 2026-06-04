import toast from "react-hot-toast";

export const successToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "#4BB543",
      color: "#fff",
      fontSize: "16px",
      borderRadius: "8px",
      padding: "12px 24px",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "#FF4C4C",
      color: "#fff",
      fontSize: "16px",
      borderRadius: "8px",
      padding: "12px 24px",
    },
  });
};
