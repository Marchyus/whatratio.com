const getActiveSet = () => {
    try {
        const currentActive = localStorage.getItem('activeSet')
        if (currentActive) {
            return {success: true, activeSet: JSON.parse(currentActive)}
        }
    }
    catch (err) {
        localStorage.removeItem('activeSet');
        console.error('Failed to parse local storage. Error:', err.message);
        console.log('Local storage cleared.');
        return {success: false}
    }

    return {success: false}
}


export {getActiveSet}
