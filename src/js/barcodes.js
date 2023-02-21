const barCodePattern = import.meta.env.VITE_BAR_CODE_REGEXP || /^698500\d{3}$/

function testBarcode(code) {
    return barCodePattern.test(code)
}

export { testBarcode, barCodePattern }