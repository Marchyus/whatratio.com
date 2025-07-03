import styles from './About.module.css';
import {Tooltip} from "react-tooltip";
import {MdAddCircleOutline} from "react-icons/md";

export default function About() {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>About</h2>
            <p className={styles.firstParagraph}>
                Curious how different bike drivetrains compare? Whether you're debating <strong>1x vs 2x</strong> setups or just want to explore your current gearing, this site helps you see the differences clearly — through <em>numbers</em>, <em>tables</em>, and <em>graphs</em>.
            </p>
            <p>
                No hype. No guesswork. Just ratios.
            </p>

            <h2 className={styles.heading}>How to Use</h2>
            <p className={styles.firstParagraph}> Two Main options:</p>
            <h3 className={styles.subHeading}>1. Manual Input</h3>
            <ul>
                <li><strong>Front chainrings</strong>: e.g., <code>30,46</code> or <code>30-46</code></li>
                <li><strong>Rear cogs</strong>: e.g., <code>11,13,15,17,19,...</code> or <code>11-13-15-17-19-...</code></li>
                <li><strong>Set name</strong> (optional): setup name</li>
            </ul>
            <p>Click <MdAddCircleOutline /> to add gear set to comparison. </p>

            <h3 className={styles.subHeading}>2. URL Sharing</h3>
            <p>You can share full setups by copying website URL: </p>
                <img src={'copyUrl.png'} className={styles.image}/>
            <p>here: </p>
            <code className={styles.urlExample}>
                whatratio.com/?sets=grx 400_f-30,46_b-32,28,...;SRAM Apex 1_f-40_b-11,12,...&ecc=1&o=4
            </code>

            <p>means:</p>
            <ul>
                <li><code>sets=</code> — drivetrain sets separated by semicolon</li>
                <li><code>f-</code> — front chainring(s)</li>
                <li><code>b-</code> — rear cassette</li>
                <li><code>ecc=1</code> — exclude cross-chained gears</li>
                <li><code>o=4</code> — gear overlap sensitivity (1–10)</li>
            </ul>
            <p>Save or share the URL to revisit your exact comparison later.</p>
            <Tooltip id="explanation-tooltip" />
        </div>
    );
}
