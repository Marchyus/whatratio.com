// Gear ratio calculator
// TODO: review logic. Maybe start comparing from Largest front -> smallest front?
const calculateGearRatios = (front, back, ratioPercentage, crossChaining) => {
    // sort front small -> large sprocket, and rear large -> small sprocket.
    front.sort((a, b) => a - b);
    back.sort((a, b) => b - a);

    // placeholders for all arrays to be generated
    // ratios if used all sprockets
    let allRatios = [];
    let allRatiosLabels = [];
    // usable ratios. On 1x doesn't change, on 2x or 3x shrinks
    let usableRatios = [];
    let usableRatiosLabels = [];
    // overlaping or non-usable gears. Relatively speaking
    let nonUsableGears = {
        crossChaining: [],
        duplicates: []
    }

    // calculate all possible ratios
    for (const i in front) {
        for (const j in back) {
            allRatios.push(Number((front[i]/back[j]).toFixed(2)));
            allRatiosLabels.push(`${front[i]}×${back[j]}`);
        }
    }
    // copy values to usable arrays (to be cleared up if >1x)
    usableRatios = structuredClone(allRatios);
    usableRatiosLabels = structuredClone(allRatiosLabels);

    // remove most aggressive cross chaining
    if (crossChaining && front.length > 1) {
        // 1# find the largest front to the largest on back
        const largestToLargest = (front.length-1)  * back.length;
        // save before deleting:
        nonUsableGears.crossChaining.push(usableRatiosLabels.slice(largestToLargest, largestToLargest+1))
        // remove from the array
        usableRatios.splice(largestToLargest, 1);
        usableRatiosLabels.splice(largestToLargest, 1);

        // 2# find the smallest front to the smallest back.
        const smallestToSmallest = back.length-1;
        // save before deleting:
        nonUsableGears.crossChaining.push(usableRatiosLabels.slice(smallestToSmallest, smallestToSmallest+1))
        // remove from the array
        usableRatios.splice(smallestToSmallest, 1);
        usableRatiosLabels.splice(smallestToSmallest, 1);
    }

    // TODO: overcomplicated and brittle. Make one long combined list and sort it? Think about it.
    // remove very close ratios from >1x systems
    if (front.length > 1) {
        for (let i = 0; i < front.length; i++) {
            let tmp = [];
            let tmp2 = [];
            let startAt = undefined;
            let finishAt = undefined;

            // grab a batch of ratios to compare. I know if had to be separate arrays, but I like this
            // TODO: works for 2x, think about 3x or anyx
            if (i === 0) {
                tmp = usableRatios.slice(0, crossChaining ? back.length-1 : back.length);
                tmp2 = usableRatiosLabels.slice(0, crossChaining ? back.length-1 : back.length);
                startAt = crossChaining ? back.length-1 : back.length
            }

            for (let cog = 0; cog < tmp.length; cog++) {
                for (let j=startAt; j < usableRatios.length; j++ ) {
                    const ratioGap = Math.abs(((tmp[cog] - usableRatios[j]) / ((tmp[cog] + usableRatios[j]) / 2)) * 100);
                    if (ratioGap < ratioPercentage) {
                        // TODO: uncoment below (or use .table) to have fancier console? :D
                        // console.log(`Ratio gap of ${ratioGap.toFixed(1)}% for ${tmp2[cog]} (${tmp[cog].toFixed(2)}) vs. ${usableRatiosLabels[j]} (${usableRatios[j].toFixed(2)}) is less than desired ${ratioPercentage.toFixed(1)}%`)
                        // save before deletion
                        nonUsableGears.duplicates.push(usableRatiosLabels.slice(j, j+1))
                        usableRatios.splice(j, 1);
                        usableRatiosLabels.splice(j, 1);
                        j--;
                    }
                }
            }
        }
    }

    // sort usable ratios, but! keep labels in the same sorted order
    // might be useless after reworking the main "find similar" logic.
    const conbinedList = usableRatios.map((ratio, index) => [ratio, usableRatiosLabels[index]])
    conbinedList.sort((a, b) => a[0] - b[0] )
    usableRatios = conbinedList.map(item => item[0])
    usableRatiosLabels = conbinedList.map(item => item[1])

    return ({
        allRatios: allRatios,
        allRatiosLabels: allRatiosLabels,
        usableRatiosOnly: usableRatios,
        usableRatiosLabels: usableRatiosLabels,
        nonUsableGears: nonUsableGears,
    })
};

export {calculateGearRatios}