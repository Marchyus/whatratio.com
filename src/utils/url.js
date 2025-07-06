import {getActiveSet} from "./activeSetManager.js";
import {toast} from "react-toastify";

function urlParamsParse (setsParam) {
    const allSets = setsParam.split(';');
    let completeSetFromUlr = {};
    if (allSets.length > 0) {
        for (const set in allSets) {
            try {
                const splitSet = allSets[set].split('_');
                const name = splitSet[0];
                let front = [];
                let back = [];

                if (splitSet[1].startsWith('f')) {
                    front = splitSet[1].split('-')[1].split(',').map(Number);
                }
                else if (splitSet[1].startsWith('b')) {
                    back = splitSet[1].split('-')[1].split(',').map(Number);
                }

                if (splitSet[2].startsWith('b')) {
                    back = splitSet[2].split('-')[1].split(',').map(Number);
                }
                else if (splitSet[2].startsWith('f')) {
                    front = splitSet[2].split('-')[1].split(',').map(Number);
                }
                else {
                    throw new Error('Failed to parse set: ' + set + '.')
                }

                if (name) {
                    completeSetFromUlr[name] = {'front': front, 'back':back};
                }
            }
            catch (err) {
                console.error(`Failed to parse set: ${set}. Error:`, err.message);
            }
        }
    }
    return completeSetFromUlr;
}

function urlParamsEncode ({ratioPercentage, crossChaining}) {
    try {
        const result = getActiveSet();
        if (result.success && Object.keys(result.activeSet).length > 0) {
            const sets = result.activeSet;
            let encodedUrl = '?sets='
            Object.keys(sets).forEach((set,index) => {
                encodedUrl = `${encodedUrl}${set}_f-${sets[set].front.join(',')}_b-${sets[set].back.join(',')}`;
                (index+1 < Object.keys(sets).length) ? encodedUrl += ';' : ""
            })
            // replace whitespaces with %20
            encodedUrl = encodedUrl.replace(/ /g, '%20');
            // add crosschaining flag
            encodedUrl += `&ecc=${crossChaining ? 1 : 0}`
            // add overlap percentage
            encodedUrl += `&o=${ratioPercentage}`
            return {success: true, encodedUrl: encodedUrl}
        }
    }
    catch (err) {
        console.warn('Failed to get active Gear set. Error: ', err.message)
        toast.warn(`Failed to get active Gear set. Error: ${err.message}`)
        return {success: false}
    }
    return {success: false}
}


export {urlParamsParse, urlParamsEncode}