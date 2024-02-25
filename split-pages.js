// length <= 9 => 1 page
// 9 < length <= 16 => 2 pages: [length - 1, 1]
// 16 < length <= 28 => 2 pages: [15, length - 15]
// 28 < length => 3+ pages: [15, ...[]]
// subLength = length - 15
  // fullMPCount = floor(subLength / 20) - 1
    // restLength = subLength - fullMPCount * 20
    // restLength <= 20 => 2 pages: [restLength - 1, 1]
    // 20 < restLength <= 33 => 2 pages: [20, restLength - 20]
    // 33 < restLength <= 39 => 3 pages: [20, restLength - 21, 1]

function calcPageSizes(length) {
  if (length <= 9) {
    return [length];
  } else if (length <= 16) {
    return [length - 1, 1];
  } else if (length <= 28) {
    return [15, length - 15];
  } else {
    const subLength = length - 15;
    let fullMPCount = Math.floor(subLength / 20) - 1;
    if (fullMPCount < 0) fullMPCount = 0;
    const sizes = [15, ...Array(fullMPCount).fill(20)];
    const restLength = subLength - fullMPCount * 20;
    if (restLength <= 20) {
      sizes.push(restLength - 1, 1);
    } else if (restLength <= 33) {
      sizes.push(20, restLength - 20);
    } else {
      sizes.push(20, restLength - 21, 1);
    }
    return sizes;
  }
}

function splitForPages(items) {
  const pageSizes = calcPageSizes(items.length);
  const pages = pageSizes.map(size => items.splice(0, size));
  return pages;
}
