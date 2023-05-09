import { onMounted, ref } from "vue";

export default function useOnClickOutside<T extends HTMLElement >(handle: () => void) {
  const elRef = ref<T | null>(null);
  
  onMounted(() => {
    function handleClickOutside({target}: MouseEvent) {
      if (elRef?.value && target instanceof HTMLElement && !elRef.value.contains(target)) {
        handle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return elRef;
}