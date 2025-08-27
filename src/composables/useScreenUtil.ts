import { computed } from 'vue';
import { useQuasar } from 'quasar';
export function useScreenUtil() {
  const quasar = useQuasar();

  const dlgMargin = computed(() => (isMobile.value ? 'q-mx-sm full-width' : 'q-ma-xs q-pa-xs'));

  const isMobile = computed(() => {
    // Screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 })
    //return quasar.screen.width < 540; // "Surface Duo" <- Microsoft
    return quasar.screen.width <= 914;
  });

  // const cardWidth = () => {
  //   const width = quasar.screen.width;
  //   if (width < 540) return width;
  //   else if (width < 1000) {
  //     if (width < 600) return 250;
  //     if (width < 800) return 300;
  //     else return 450;
  //     //} else return 300;
  //   } else return 300;
  // };
  // const cardHeight = () => (cardWidth() * 9) / 16 + 30;

  // const dlgWidth = (defWidth = 600, height: any) => {
  //   try {
  //     if (height === 0)
  //       return `width:${defWidth}px;max-width:800px ; height: auto`;
  //     else return `width:${defWidth}px;max-width:800px; height:${height}px`;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const isDark = computed(() => quasar.dark.isActive);
  const setDarkmode = (enabled = true) => quasar.dark.set(enabled);

  const toggleDarkMode = (state: boolean | null = null) => {
    if (state === null) quasar.dark.toggle();
    else quasar.dark.set(state);
    localStorage.setItem('darkMode', quasar.dark.isActive.toString());
  };

  const loadDarkMode = () => {
    const tmp = localStorage.getItem('darkMode') ?? 'false';
    setDarkmode(tmp === 'true');
  };

  const textColorOnDarkMode = computed(() => {
    return isDark.value ? 'text-color-on-dark' : 'text-color-on-light';
  });

  const getClass = (name: string) => {
    return name + (isDark.value ? '-on-dark ' : '-on-light ');
  };

  return {
    //dlgWidth,
    dlgMargin,
    isMobile,
    isDark,
    textColorOnDarkMode,
    setDarkmode,
    loadDarkMode,
    toggleDarkMode,
    // cardHeight,
    // cardWidth,
    getClass,
  };
}
