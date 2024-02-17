function calFlower(thb) {
  switch (thb) {
    case 29:
      return 60;
      break;
    case 149:
      return 300 + 30;
      break;
    case 449:
      return 980 + 110;
      break;
    case 889:
      return 1980 + 260;
      break;
    case 1600:
      return 3280 + 600;
      break;
    case 3000:
      return 6480 + 1600;
      break;
    default:
      // กรณีไม่ตรงกับเงื่อนไขใด ๆ
      return 0;
  }
}

module.exports = calFlower;
