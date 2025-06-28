import styles from './Header.module.css'
import {useNavigate} from "react-router-dom";
import { FaRegCopy } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";
import { toast } from "react-toastify";
import {urlParamsEncode} from "../utils/url.js";
import { LuShare2 } from "react-icons/lu";
import {useState} from "react";


export default function Header () {

    const navigate = useNavigate();

    const handleCopy = () => {
        const urlEncoded = urlParamsEncode();
        if (urlEncoded.success) {
            navigator.clipboard.writeText(`${window.location.href}${urlEncoded.encodedUrl}`);
            toast.success("URL copied");
        }
        else {
            toast.warn("Failed to copy ratio URL");
        }

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
            <button className={styles.bthHeader}>
                <LuShare2/>
            </button>
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