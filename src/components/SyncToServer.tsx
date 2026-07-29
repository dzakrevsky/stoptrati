import { useEffect, useRef } from 'react';
import { useAppStore, saveStoreToServer } from '@/store/useAppStore';

const selectData = (state: ReturnType<typeof useAppStore.getState>) => ({
  expenses: state.expenses,
  categories: state.categories,
  types: state.types,
  settings: state.settings,
});

export default function SyncToServer() {
  const previousData = useRef(selectData(useAppStore.getState()));

  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((state) => {
      const currentData = selectData(state);
      const prev = previousData.current;

      const hasChanged =
        currentData.expenses !== prev.expenses ||
        currentData.categories !== prev.categories ||
        currentData.types !== prev.types ||
        currentData.settings !== prev.settings;

      if (hasChanged) {
        previousData.current = currentData;
        saveStoreToServer();
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
