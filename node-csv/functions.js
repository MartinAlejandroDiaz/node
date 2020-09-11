module.exports.cuit = function(cuit) {
    return (cuit.substring(0, 2) + cuit.substring(3, 5) + cuit.substring(6, 9) + cuit.substring(10, 13) + cuit.substring(14, 15));
}