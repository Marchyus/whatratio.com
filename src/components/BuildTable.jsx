import PropTypes from "prop-types";
import styles from './BuildTable.module.css';


export default function BuildTable ({activeSetRatios, usableRatiosOnly}) {

    // not perfect, do I even need to strip this?
    const stripedRatios =  Object.fromEntries(
        Object.keys(activeSetRatios).map(key => [key, usableRatiosOnly ? activeSetRatios[key].usableRatiosOnly : activeSetRatios[key].allRatios])
    );
    const stripedLabels =  Object.fromEntries(
        Object.keys(activeSetRatios).map(key => [key, usableRatiosOnly ? activeSetRatios[key].usableRatiosLabels : activeSetRatios[key].allRatiosLabels])
    );

    // let maxGear = Math.max(...Object.keys(stripedRatios).map(key => stripedRatios[key].length));
    let maxGear = Object.values(stripedRatios).reduce((max, currentValue) => {
        const currentLength = currentValue?.length || 0;
        return Math.max(max, currentLength)
    }, 0)

    if (maxGear === 0) {
        return (<div> - </div>)
    }

    // build array for TH row
    const thRow = Array.from({length: maxGear}, (_, index) => index + 1);

    return (
        <div className={styles.table}>
            <table>
                <thead>
                    <tr>
                        <td>Gear →</td>
                        {thRow.map(gear => (
                            <td key={gear}>{gear}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {Object.keys(stripedRatios).map(key => {
                    return (<tr key={`${key}_tr`}>
                                <td><span>{key}</span> →</td>
                                {stripedRatios[key].map((ratio,index) => (
                                    <td key={`${key}_${index}`}
                                        data-tooltip-id="ratio-tooltip"
                                        data-tooltip-html={`#${index+1} gear:<br/>${stripedLabels[key][index]}`}
                                        data-tooltip-place="bottom"
                                    >
                                        {ratio}
                                    </td>
                                ))}
                            </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

BuildTable.propTypes = {
    activeSetRatios: PropTypes.object,
    usableRatiosOnly: PropTypes.bool
}