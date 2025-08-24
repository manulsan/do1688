//import enUS from './en-US';

// export default {
//   'en-US': enUS,
// };
// };
import enUS from './en-US';
import koKR from './ko-KR';
export const messages = {
  'en-US': enUS,
  'ko-KR': koKR,
};
export const options = [
  { value: 'en-US', abbr: 'en', label: 'English' },
  { value: 'ko-KR', abbr: 'ko', label: '한국어' },
];

export const fallback = 'en-us';
export function defaultLanguage() {
  console.log('****************************************');
  console.log('fixMe: this is not called. never called');
  console.log('****************************************');
  const lang = localStorage.getItem('userLanguage') ?? navigator.language;

  if (lang) {
    //lang = lang.toLowerCase();
    // check if supported
    for (const i of options) {
      if (lang == i.value || lang == i.abbr) {
        return i.value;
      }
    }
  }

  return fallback;
}
