export function prepareSingleRechartData ({ratios, labels}) {
    return ratios.map((ratio, i) => ({
        name: i,
        label: labels[i],
        ratio
    }))
}


export function prepareMultiLineRechartData (activeSet) {
    // get all keys
    const keys = Object.keys(activeSet);

    // find longest from all ratios and usable ratios
    const maxAllRatios = Math.max(
        ...keys.map(key => activeSet[key].allRatios.length)
    )
    const maxUsableRatios = Math.max(
        ...keys.map(key => activeSet[key].usableRatiosOnly.length)
    )

    // Generate arrays for Rechart
    // All gears
    const allRechart = Array.from({length: maxAllRatios}, (_, i) => {
        // name for the current entry
        const newPoint = {name: i + 1};
        // extrac values for the current entry
        keys.forEach(key => {
            newPoint[key] = activeSet[key].allRatios[i];
        })
        return newPoint
    });
    // Usable gears
    const usableRechart = Array.from({length: maxUsableRatios}, (_, i) => {
        // name for the current entry
        const newPoint = {name: i + 1};
        // extrac values for the current entry
        keys.forEach(key => {
            newPoint[key] = activeSet[key].usableRatiosOnly[i];
        })
        return newPoint
    });


    return {allRechart: allRechart, usableRechart: usableRechart};


}