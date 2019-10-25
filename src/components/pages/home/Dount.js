/* eslint-disable */
import themeMixin from '@/components/mixins/themeMixins';
const Donut = {
  mixins: [themeMixin],
  methods: {
    pieTop(d, rx, ry, ir ){
      if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
      var sx = rx*Math.cos(d.startAngle),
          sy = ry*Math.sin(d.startAngle),
          ex = rx*Math.cos(d.endAngle),
          ey = ry*Math.sin(d.endAngle);
        
      var ret =[];
      ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
      ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
      return ret.join(" ");
    },
    pieOuter(d, rx, ry, h ){
      var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
      var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
      var sx = rx*Math.cos(startAngle),
          sy = ry*Math.sin(startAngle),
          ex = rx*Math.cos(endAngle),
          ey = ry*Math.sin(endAngle);
        
      var ret =[];
      ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
      return ret.join(" ");
    },
    getPercent(d){
      // return (d.endAngle-d.startAngle > 0.2 ? d.data.label + '\r\n' +
      //     Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
      return (d.endAngle-d.startAngle > 0.2 ? d.data.label + '\r\n' +
        d.data.value : '');
    },
    donut3D(id, data, x /*center x*/, y/*center y*/, 
      rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/) {
        var _data = this.$d3.pie().sort(null).value(d => d.value)(data);
      
        var slices = this.$d3.select("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
                             .attr("class", "slices");
        // slices.append('foreignObject')
        //       .style('z-index', 99)
        //       .append('xhtml:div')
        //       .attr('class', `${type}Tooltip`)
        //       .attr('style', 'position: absolute; opacity: 0.0;')
        slices.selectAll(".topSlice").data(_data).enter().append('g').append("path").attr("class", d => d.data.label)
              .style("fill", d => d.data.color)
              .style("stroke", d => d.data.color)
              .attr("d", d => this.pieTop(d, rx, ry, ir))
              .each(d => { this._current=d; });

        slices.selectAll(".outerSlice").data(_data).enter().append('g').append("path").attr("class", d => d.data.label)
              .style("fill", d => this.$d3.hsl(d.data.color).darker(0.7))
              .attr("d", d => this.pieOuter(d, rx-.5,ry-.5, h))
              .each(d => { this._current = d; });
    
        slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
              .attr("x",d => 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle)))
              .attr("y",d => 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle)))
              // .attr("text-anchor","middle")
              .style("font-weight", 700)
              .style("fill", this.themeColor.pieLableColor)
              .style('opacity', 0.8)
              .text(this.getPercent).each(d => { this._current=d; });
        // _data.forEach(d => {
        //   this.$d3.selectAll(`.${d.data.label}`)
        //       .on('click', () => {
                
        //       })
        //       .on('mousemove', () => {
        //         this.$d3.selectAll(`.${d.data.label}`)
        //                 .style("opacity",0.8)
        //         this.$d3.selectAll(`.${type}Tooltip`)
        //                 .style('left', (this.$d3.event.offsetX-130)+'px')
        //                 .style('top', (this.$d3.event.offsetY-130)+'px')
        //                 .style('opacity', 0.8)
        //                 .style('color', this.$d3.hsl(d.data.color).darker(1.2))
        //                 .style('font-size', '14px')
        //                 .style('border', `1px solid ${d.data.color}`)
        //                 .style('border-radius', '5px')
        //                 .style('background-color', '#fff')
        //                 .html(d.data.details.map(d => `${d}\n`).join('').split(',').join(''))
        //                 .style('padding', '8px')
        //                 .style('line-height', '30px');
        //       })
        //       .on('mouseout', () => {
        //         this.$d3.selectAll(`.${d.data.label}`)
        //                 .style("opacity",1.0)
        //         this.$d3.selectAll(`.${type}Tooltip`)
        //                 .style('opacity', 0.0);
        //       })
        // })
    }
  },
}
export default Donut;