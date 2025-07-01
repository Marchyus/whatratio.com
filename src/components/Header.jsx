import styles from './Header.module.css'
import {useNavigate} from "react-router-dom";
import { FaRegCopy } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";
import { toast } from "react-toastify";
import {urlParamsEncode} from "../utils/url.js";
import { LuShare2 } from "react-icons/lu";
import { SettingsContext } from "../contexts/settingsContext.jsx";
import {useContext} from "react";
import { GiCrossedChains } from "react-icons/gi";


export default function Header () {

    const {ratioPercentage, setRatioPercentage, crossChaining, setCrossChaining} = useContext(SettingsContext)

    const navigate = useNavigate();

    const handleCopy = () => {
        const urlEncoded = urlParamsEncode({ratioPercentage, crossChaining});
        if (urlEncoded.success) {
            navigator.clipboard.writeText(`${window.location.href}${urlEncoded.encodedUrl}`);
            toast.success("URL copied");
        }
        else {
            toast.warn("Failed to copy ratio URL");
        }
    }

    const handleShare = () => {
        console.log("RATIO: ", ratioPercentage);
        console.log("Crosschaining: ", crossChaining);
    }

    return(
        <div className={styles.container}>
            {/* HOME */}
            <button className={styles.bthHeader} onClick={() => navigate('/')}>
                <MdDirectionsBike/>
            </button>
            {/* Copy URL */}
            <button className={styles.bthHeader} onClick={handleCopy}>
                <FaRegCopy />
            </button>
            {/* SHARE */}
            <button className={styles.bthHeader} onClick={handleShare}>
                <LuShare2/>
            </button>
            {/* Cross-chaining toggle */}
            <div className={styles.crossChainToggle}>
                <input
                    id={'crosschaining-toggle'}
                    type={'checkbox'}
                    className={styles.checkboxInput}
                    checked={crossChaining}
                    onChange={() => setCrossChaining(!crossChaining)}
                />
                <label
                    htmlFor={'crosschaining-toggle'}
                    className={styles.checkboxLabel}
                >Exclude <GiCrossedChains /></label>
            </div>
            {/* Overlap % selection */}
            <div>
                <select
                    name="overlapPercentage"
                    id="overlapPercentage"
                    className={styles.bthHeader}
                    value={ratioPercentage}
                    onChange={(e) => setRatioPercentage(Number(e.target.value))}
                    title={'aaaaaaaaaaa'}
                >
                    <option value="1">1%</option>
                    <option value="2">2%</option>
                    <option value="3">3%</option>
                    <option value="4">4%</option>
                    <option value="5">5%</option>
                    <option value="6">6%</option>
                    <option value="7">7%</option>
                    <option value="8">8%</option>
                    <option value="9">9%</option>
                    <option value="10">10%</option>
                </select>
            </div>
            {/* ABOUT */}
            <button
                className={styles.bthHeader}
                onClick={() => navigate('about')}
            >
                About
            </button>

        </div>
    )
}