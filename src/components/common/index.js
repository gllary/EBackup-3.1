import cax from 'cax';

const { Ellipse, Graphics, Group } = cax;

class Cylinder extends Group {
  constructor(width, height, percent, color, bottle) {
    super();
    this.width = width;
    this.height = height;
    this.value = percent;
    const bottleColor = bottle || '#CACACA';
    const topRect = new Graphics();
    const th = height * (1 - percent);
    const shortSize = width / 2.5 / 2;
    this.shortSize = shortSize;
    topRect.beginPath().fillStyle(bottleColor).fillRect(-10, 0, width + 20, height);
    topRect.alpha = 0.618;
    this.surfaceY = height - height * percent - shortSize;
    const btRect = new Graphics();
    btRect.beginPath().fillStyle(color).fillRect(0, 0, width, height - th);
    btRect.y = th;
    const topEllipse = new Ellipse(width, width / 2.5, {
      fillStyle: bottleColor,
      strokeStyle: bottleColor,
      lineWidth: 20
    });
    topEllipse.y = shortSize * -1;
    const middleEllipse = new Ellipse(width, width / 2.5, {
      fillStyle: percent ? color : bottleColor,
      // strokeStyle: bottleColor,
      lineWidth: 20
    });
    middleEllipse.y = th - shortSize;
    const middleEllipseMask = new Ellipse(width, width / 2.5, {
      fillStyle: bottleColor,
      // strokeStyle: bottleColor,
      lineWidth: 20
    });
    middleEllipseMask.alpha = 0.618;
    middleEllipseMask.y = th - shortSize;
    const bottomEllipse = new Ellipse(width, width / 2.5, {
      fillStyle: percent ? color : bottleColor,
      strokeStyle: bottleColor,
      lineWidth: 20
    });
    bottomEllipse.y = height - shortSize;
    this.add(topRect, topEllipse, bottomEllipse, btRect, middleEllipse, middleEllipseMask);
  }
}

export default Cylinder;
