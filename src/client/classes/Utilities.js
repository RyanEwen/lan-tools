class Utilities {
    static getFormValues(form) {
        let elements = Array.from(form.elements).filter((element) => element.name)

        let inputs = {}

        elements.forEach((element) => {
            inputs[element.name] = element.value
        })

        return inputs
    }
}

if (process.env.NODE_ENV !== 'production') {
    window.debug = { ...window.debug, Utilities }
}

export default Utilities
