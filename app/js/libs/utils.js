function idEncode(str, separator) {
	if (!separator) separator = '_';
	str = _.deburr(str)
	str = str.split("\"").join('').split('\'').join('').split(',').join('');
	str = str.toLowerCase().split(' ').join(separator);
	str = str.replace(/[ÀÁÂÃÄÅàáâãäåĀāąĄ]/g, "a");
	str = str.replace(/[ÈÉÊËèéêëěĚĒēęĘ]/g, "e");
	str = str.replace(/[ÌÍÎÏìíîïĪī]/g, "i");
	str = str.replace(/[ÒÓÔÕÕÖØòóôõöøŌō]/g, "o");
	str = str.replace(/[ÙÚÛÜùúûüůŮŪū]/g, "u");

	return str;
}

function rgbToHex(rgb) {
	var hex = "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).toUpperCase()
	return hex;
}

function intToHex(int) {
	var hexStr = int.toString(16).toUpperCase()
	while (hexStr.length < 6) {
		hexStr = '0' + hexStr;
	}
	hexStr = '#' + hexStr;

	return hexStr;
}