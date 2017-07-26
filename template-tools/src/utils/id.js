const makeid = (len = 5) => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for( let i=0; i < len; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = {
  makeid
}