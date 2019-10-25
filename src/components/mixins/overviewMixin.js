/* eslint-disable */
const overviewMixin = {
  data() {
    return {
      productionData: {},
      ebackupData: {},
      productionSalesInfo: [],
      ebackupSalesInfo: [],
      dialogVisible: false,
      btnLoading: false,
      productionPage: 1,
      productionPageSize: 10,
      ebackupPage: 1,
      ebackupPageSize: 10,
    };
  },
  computed: {
    leftDire() {
      return this.$refs.leftDire;
    },
    rightDire() {
      return this.$refs.rightDire;
    },
    showProduction() {
      return !['',null,'null'].includes(this.productionData.serviceIp);
    },
    showEbackup() {
      return !['',null,'null'].includes(this.ebackupData.serviceIp);
    },
    productionInfo() {
      if(this.productionData.salesInfo){
        this.productionSalesInfo = this.productionData.salesInfo.slice();
        return this.productionSalesInfo.sort(function(a,b){
          return b.salesamount-a.salesamount;
        }).slice(0,5);
      }
      else
        return [];
    },
    ebackupInfo() {
      if(this.ebackupData.salesInfo) {
        this.ebackupSalesInfo = this.ebackupData.salesInfo.slice();
        return this.ebackupSalesInfo.sort(function(a,b){
          return b.salesamount-a.salesamount;
        }).slice(0,5);
      }
      else
        return [];
    },
    productionTotal() {
      return this.productionData.salesInfo?
             this.productionData.salesInfo.length:0;
    },
    ebackupTotal() {
      return this.ebackupData.salesInfo?
             this.ebackupData.salesInfo.length:0;
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    productionCurrentChange(val) {
      this.productionPage = val;
    },
    ebackupCurrentChange(val) {
      this.ebackupPage = val;
    },
    // 绘图环境，起点坐标，终点坐标，三角斜边-直线夹角，三角斜边长度，箭头线宽度，箭头颜色，方向
    drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, width, color, dire) {
      this.leftDire.getContext('2d').clearRect(0, 0, this.leftDire.width, this.leftDire.height);
      this.rightDire.getContext('2d').clearRect(0, 0, this.rightDire.width, this.rightDire.height);
      const angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
      const angle1 = (angle + theta) * Math.PI / 180;
      const angle2 = (angle - theta) * Math.PI / 180;
      const topX = headlen * Math.cos(angle1);
      const topY = headlen * Math.sin(angle1);
      const botX = headlen * Math.cos(angle2);
      const botY = headlen * Math.sin(angle2);
      ctx.save();
      ctx.beginPath();
      let iLenX = fromX;
      let arrowX = fromX - topX;
      let arrowY = fromY - topY;
      let times = 0;
      window.clearInterval(intervalLine);
      var intervalLine = window.setInterval(() => {
        // 绘制直线
        if (iLenX - toX !== 0) {
          ctx.moveTo(fromX, fromY);
          if (dire === 1) {
            ctx.lineTo(++fromX, ++fromY);
            iLenX++;
          } else {
            ctx.lineTo(--fromX, ++fromY);
            iLenX--;
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.stroke();
        } else if (times === 0) { // 绘制箭头
          ctx.moveTo(arrowX, arrowY);
          arrowX = toX + topX;
          arrowY = toY + topY;
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(toX, toY);
          arrowX = toX + botX;
          arrowY = toY + botY;
          ctx.lineTo(arrowX, arrowY);
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.stroke();
          times = 1;
        }
      }, 5);
      ctx.restore();
    },
  },
};
// eslint-disable-next-line
export { overviewMixin };
