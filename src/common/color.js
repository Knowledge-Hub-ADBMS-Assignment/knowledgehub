const componentToHex = (c) => {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const getRandomColor = (level) => {
  let color = {
    min: 0,
    max: level,
    random: Math.floor(Math.random() * (level+1)),
  };

  const generatedColor = [];
  while (generatedColor.length < 3) {
    const keys = Object.keys(color);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomIndex];
    generatedColor.push(color[`${randomKey}`]);
    delete color[`${randomKey}`];
  }

  return rgbToHex(generatedColor[0], generatedColor[1], generatedColor[2]);
};

module.exports = { getRandomColor };
