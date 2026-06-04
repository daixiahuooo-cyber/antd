import i18n from "i18next";
import { initReactI18next } from "react-i18next";
 
import en from "../src/locales/en.json"; // 這個路徑可以自己定義，但要指向檔案位置
import zh_tw from "../src/locales/zh-TW.json";
import fr from "../src/locales/fr.json";

const resources = {
        en: {
            translation: en,
        },
        fr: {
            translation: fr,
        },
        zh: {
            translation: zh_tw,
        },
    };

i18n.use(initReactI18next).init({
    resources, // 所有翻譯資源
    fallbackLng: "en", // 如果當前切換的語言沒有對應的翻譯則使用這個語言
    lng: "zh", // 預設語言
    interpolation: {
        // 是否要讓字詞 escaped 來防止 xss 攻擊，這裡因為 React.js 已經做了，就設成 false即可
    escapeValue: false,
        },
    });
 
export default i18n;