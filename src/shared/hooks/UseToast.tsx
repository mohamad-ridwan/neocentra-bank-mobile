import { Toast, useToast } from "@/shared/components/ui";

export interface HandleToast {
  message: string;
  title?: string;
  type?: "error" | "warning" | "success" | "info" | "attention";
  duration?: number;
}

const UseToast = () => {
  const toast = useToast();
  const handleToast = ({
    message,
    title,
    type = "info",
    duration = 4000,
  }: HandleToast) => {
    const toastId = Math.random().toString();
    toast.show({
      id: toastId,
      placement: "top",
      duration,
      avoidKeyboard: true,
      render: ({ id }) => {
        return (
          <Toast
            nativeID={id}
            type={type}
            title={title}
            message={message}
            onDismiss={() => toast.close(id)}
          />
        );
      },
    });
  };
  return { handleToast };
};

export default UseToast;
