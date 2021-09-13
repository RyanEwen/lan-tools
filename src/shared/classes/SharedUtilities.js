class SharedUtilities {
    static urlParamExists(param) {
        const params = new URLSearchParams(window.location.search)

        return params.has(param)
    }

    static getUrlParam(param) {
        const params = new URLSearchParams(window.location.search)

        return params.get(param)
    }

    static requireValue(name, value) {
        if (value === undefined || value === null || value === '') {
            throw new Error(`${name} is required`)
        }
    }

    static requireValues(required) {
        for (let name in required) {
            this.requireValue(name, required[name])
        }
    }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    window.debug = { ...window.debug, SharedUtilities }
}

export default SharedUtilities
