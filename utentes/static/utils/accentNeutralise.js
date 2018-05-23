var accentNeutralise = function (data) {
  if (!data) return '';
  return typeof data === 'string' ?
    data
      .toLowerCase()
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/ig, 'o')
      .replace(/ú/g, 'u')
      .replace(/ê/g, 'e')
      .replace(/î/g, 'i')
      .replace(/ô/g, 'o')
      .replace(/è/g, 'e')
      .replace(/ï/g, 'i')
      .replace(/ü/g, 'u')
      .replace(/ã/g, 'a')
      .replace(/õ/g, 'o')
      // .replace(/ç/g, 'c')
      .replace(/ì/g, 'i')
      .replace(/ä/g, 'a')
      .replace(/ë/g, 'e')
      .replace(/ï/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/à/g, 'a')
      .replace(/è/g, 'e')
      .replace(/ì/g, 'i')
      .replace(/ò/g, 'o')
      .replace(/ù/g, 'u') :
    data;
};
