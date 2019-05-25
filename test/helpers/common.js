function isRuningForProd() {
    return typeof isRuningForProduction != 'undefined' && isRuningForProduction;
}

function isRuningForSauce() {
    return typeof isRuningForSauceLab != 'undefined' && isRuningForSauceLab;
}