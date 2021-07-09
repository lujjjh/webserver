import { onMounted } from "vue";

export const useAutoFocus = () => {
  onMounted(() => {
    (document.querySelector("[autofocus]") as HTMLInputElement)?.focus?.();
  });
};
