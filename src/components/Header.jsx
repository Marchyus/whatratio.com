import styles from './Header.module.css'
import {useNavigate} from "react-router-dom";
import { FaRegCopy } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";
import { toast } from "react-toastify";
import {urlParamsEncode} from "../utils/url.js";
import { LuShare2 } from "react-icons/lu";
import { SettingsContext } from "../contexts/settingsContext.jsx";
import {useContext, useState} from "react";
import { GiCrossedChains } from "react-icons/gi";


export default function Header () {

    const {ratioPercentage, setRatioPercentage, crossChaining, setCrossChaining} = useContext(SettingsContext)

    const navigate = useNavigate();

    const [sharingVisible, setSharingVisible] = useState(false);

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
        setSharingVisible(!sharingVisible);
    }

    return(
        <>
        <div className={styles.container}>
            {/* HOME */}
            <button
                className={styles.bthHeader}
                onClick={() => navigate('/')}
                data-tooltip-id="explanation-tooltip"
                data-tooltip-html={`Main page`}
                data-tooltip-place="top"
            >
                <MdDirectionsBike/>
            </button>
            {/* Copy URL */}
            <button
                className={`${styles.bthHeader} ${styles.btnCopy}`}
                onClick={handleCopy}
                data-tooltip-id="explanation-tooltip"
                data-tooltip-html={`Copy URL to this `}
                data-tooltip-place="top"
            >
                <FaRegCopy />
            </button>
            {/* SHARE */}
            <button
                className={sharingVisible ? `${styles.bthHeader} ${styles.activeShareBtn}` : styles.bthHeader}
                onClick={handleShare}
                data-tooltip-id="explanation-tooltip"
                data-tooltip-html={sharingVisible ? 'Close sharing' : `Share...`}
                data-tooltip-place="top"
            >
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
                    data-tooltip-id="explanation-tooltip"
                    data-tooltip-html={`Remove cross-chaining from usable gears`}
                    data-tooltip-place="top"
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
                    data-tooltip-id="explanation-tooltip"
                    data-tooltip-html={`min. gap for distinct gear`}
                    data-tooltip-place="top"
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
        {sharingVisible ? (
            <div className={styles.shareMenu}>
                <LuShare2 className={styles.bigShareBtn}/>
                <div className={styles.shareOptions}>
                    <div className={styles.shareOption}>
                        <button
                            className={`${styles.bthHeader} ${styles.btnCopy}`}
                            onClick={handleCopy}
                            data-tooltip-id="explanation-tooltip"
                            data-tooltip-html={`Copy URL to this `}
                            data-tooltip-place="top"
                        >
                            <FaRegCopy />
                        </button>
                        <input
                            type="text"
                            value={`${window.location.href}${urlParamsEncode({ratioPercentage, crossChaining}).encodedUrl}`}
                            readOnly={true}
                            className={styles.shareMenuUrl}
                        />
                    </div>
                    {/*TODO: add share to facebook, twitter, reddit or whatever? */}
                </div>
            </div>
        ) : ''}
        </>
    )
}