const makeid = (len = 5) => {
  let text = "";

  // we loose chars that might be read the same i.e. O - 0
  const possible = "ABCDEFGHJKLMNPQRTUVWXY346789";

  for( let i=0; i < len; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = {
  makeid
}