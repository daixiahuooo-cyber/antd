import './App.css';
import { useTranslation } from "react-i18next";
import "./i18n";
import {QRCodeSVG} from 'qrcode.react';
import {QRCodeCanvas} from 'qrcode.react';
import Player from './player';

 
function App() {
 
const { t, i18n } = useTranslation();
 
return (
    <div className="App">
        <div>
            <h1>{t("Hello")}</h1>
                <h2>{t("Welcome to our app")}</h2>
                <h2>{t("Our app is for people who have lost their items")}</h2>
                <h2>{t("We have both reporting and storage systems so you can find your lost items faster")}</h2>
                <h2>{t("If you have any questions please contact our customer service team")}</h2>
                <h2>{t("Thank you for using our app")}</h2>
        </div>
        <div>
            <Player
                poster='https://upload.wikimedia.org/wikipedia/commons/6/69/Sintel_Cover_Durian_Project.jpg'
                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
             />
        </div>
        <div>
            <button onClick={() => i18n.changeLanguage('en')} type="button">英文</button>
            <button onClick={() => i18n.changeLanguage('zh')} type="button">中文</button>
            <button onClick={() => i18n.changeLanguage('fr')} type="button">法文</button>
        </div>
        <div>
            <h2>SVG QRcode</h2>
            <QRCodeSVG value={"https://picturesofpeoplescanningqrcodes.tumblr.com/"}
                    title={"Title for my QR Code"}
                    size={128}
                    bgColor={"#ffffff"}
                    fgColor={"#3653ab"}
                    level={"L"}
                    minVersion={5}
                    marginSize={-10}
                    imageSettings={{
                        src: "https://static.zpao.com/favicon.png",
                        x: undefined,
                        y: undefined,
                        height: 25,
                        width: 25,
                        opacity: 5.9,
                        excavate: false,
                    }}
                />
            <h2>Canvas QRcode</h2>
            <QRCodeCanvas value={"https://picturesofpeoplescanningqrcodes.tumblr.com/"}
                            title={"Title for my QR Code"}
                            size={128}
                            bgColor={"#ffffff"}
                            fgColor={"#3653ab"}
                            level={"L"}
                            minVersion={5}
                            marginSize={-10}
                            imageSettings={{
                                src: "https://static.zpao.com/favicon.png",
                                x: undefined,
                                y: undefined,
                                height: 25,
                                width: 25,
                                opacity: 5.9,
                                excavate: false,
                            }} 
                        />
        </div>
    </div>
 );
 }
 
export default App;