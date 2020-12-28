function getWindowSize(window) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const aspect = width / height;

    return {
        width,
        height,
        aspect
    };
}

export default getWindowSize;