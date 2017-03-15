function idEncode(str, separator) {
  if (!separator) separator = '_';
  str = str.split("\"").join('').split('\'').join('');
  str = str.toLowerCase().split(' ').join(separator);
  str = str.replace(/[ÀÁÂÃÄÅàáâãäåĀāąĄ]/g, "a");
  str = str.replace(/[ÈÉÊËèéêëěĚĒēęĘ]/g, "e");
  str = str.replace(/[ÌÍÎÏìíîïĪī]/g, "i");
  str = str.replace(/[ÒÓÔÕÕÖØòóôõöøŌō]/g, "o");
  str = str.replace(/[ÙÚÛÜùúûüůŮŪū]/g, "u");

  return str;
}