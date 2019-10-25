import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const paginationMixin = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  computed: {
    // 分页处理
    processedTableData() {
      // const tData = this.currentTableData ? this.currentTableData : this.tableData;
      const tData = this.curTableData || this.currentTableData || this.tableData;
      let data = [...tData];
      this.total = data.length;
      // 判断当前页是否有数据，如果没有则显示有数据的最后一页
      const pagenum = Math.ceil(this.total / this.pageSize);
      if (this.currentPage > pagenum) {
        this.currentPage = this.currentPage === 1 ? this.currentPage : pagenum;
      }
      if (this.sortFn && this.defaultSort) {
        data = this.sortFn(data, this.defaultSort.prop, this.defaultSort.order);
      }
      return data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
  }
};

const sortMixin = {
  data() {
    return {
      defaultSort: {
        prop: 'name',
        order: 'descending'
      }
    };
  },
  computed: {
    curTableData() {
      let data = this.currentTableData || this.tableData;
      data = data.sort((a, b) => {
        let val1 = a[this.defaultSort.prop];
        let val2 = b[this.defaultSort.prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return this.defaultSort.order === 'descending' ? 1 : -1;
        } else if (val1 > val2) {
          return this.defaultSort.order === 'descending' ? -1 : 1;
        }
        return 0;
      });
      return data;
    },
  },
  methods: {
    sortFn(data, column, order) {
      return data.slice().sort((a, b) => {
        const val1 = a[column];
        const val2 = b[column];
        // 默认是时间排序
        if (val1 < val2) {
          return order === 'ascending' ? -1 : 1;
        } else if (val1 > val2) {
          return order === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    },
    sortChangeFn({ prop, order }) {
      if (JSON.stringify(this.defaultSort) === JSON.stringify({ prop, order })) {
        return;
      }
      this.defaultSort = { prop, order };
    },
  }
};

const filterMixin = {
  data() {
    return {
      filter: {}
    };
  },
  computed: {
    currentTableData() {
      let filterData = this.tableData;
      Object.keys(this.filter).forEach(i => {
        if (this.filter[i] && this.filter[i].length > 0) {
          filterData = filterData.filter(item => this.filterFn(item, i));
        }
      });
      return filterData;
    }
  }
};

const sockMixin = {
  data() {
    return {
      url: '/socket', // 握手时使用的url
      stompClient: '',
      heartInterval: ''
    };
  },
  mounted() {
    this.initWebsocket();
  },
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.heartInterval);
  },
  methods: {
    initWebsocket() {
      this.connection();
      const that = this;
      this.heartInterval = setInterval(() => {
        try {
          that.stompClient.send('test');
        } catch (err) {
          console.warn('断线了, 正在重新连接');
          // console.error(err);
          that.connection();
        }
      }, 30000);
    },
    connection() {
      // 建立连接对象
      const socket = new SockJS(this.url);
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = () => {
        // console.warn('不打印日志信息');
      };
      // 定义客户端的认证信息,按需求配置
      const headers = {
        Authorization: '',
        login: 'guest',
        passcode: 'guest'
      };
      // 向服务器发起websocket连接
      this.stompClient.connect(headers, () => {
        this.connectCallback(this.stompClient);
        // this.stompClient.send("/app/chat.addUser",
        //   headers,
        //   JSON.stringify({sender: '',chatType: 'JOIN'}),
        // )// 用户加入接口
      }, this.errorCallback);
      this.stompClient.heartbeat.outgoing = 20000;
      this.stompClient.heartbeat.incoming = 0;
    },
    errorCallback() {
      console.error('连接失败');
      // this.stompClient = null;
    },
    connectCallback(client) {
      const headers = {};
      client.subscribe('/test', msg => { // 订阅服务端提供的某个topic
        console.warn(msg);// msg.body存放的是服务端发送给我们的信息
      }, headers);
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    }
  }
};

const webSocketMixin = {
  data() {
    return {
      wsuri: null,
      websock: null,
      heartCheck: {
        timeout: 60000, // 1分钟发一次心跳
        timeoutObj: null,
        serverTimeoutObj: null,
        errorTimeObj: null,
        reset: () => {
          clearTimeout(this.heartCheck.timeoutObj);
          clearTimeout(this.heartCheck.serverTimeoutObj);
          clearTimeout(this.heartCheck.errorTimeObj);
        },
        start: () => {
          this.heartCheck.timeoutObj = setTimeout(() => {
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            this.websocketsend('ping');
            this.heartCheck.serverTimeoutObj = setTimeout(() => { // 如果超过一定时间还没重置，说明后端主动断开了
              this.initWebsocket(); // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, this.heartCheck.timeout);
          }, this.heartCheck.timeout);
        }
      }
    };
  },
  created() {
    this.initWebsocket();
  },
  destroyed() {
    // console.log('guanbi');
    this.heartCheck.reset();
    this.websock.close();
  },
  methods: {
    initWebsocket() {
      // const wsuri = 'ws://121.40.165.18:8800';
      // const wsuri = process.env.WS_API + '/test';
      if (typeof WebSocket === 'undefined') {
        return;
      }
      if (!this.wsuri) {
        return;
      }
      this.websock = new WebSocket(process.env.WS_API + this.wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      // this.websock. = this.websocket;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    // sendMessage() {
    //   // 参数
    //   const agentData = 'mymessage';
    //   // 若是ws开启状态
    //   if (this.websock.readyState === this.websock.OPEN) {
    //     this.websocketsend(agentData);
    //   } else if (this.websock.readyState === this.websock.CONNECTING) { // 若是 正在开启状态，则等待300毫秒
    //     const that = this; // 保存当前对象this
    //     setTimeout(() => {
    //       that.websocketsend(agentData);
    //     }, 300);
    //   } else { // 若未开启 ，则等待500毫秒
    //     this.initWebSocket();
    //     const that = this; // 保存当前对象this
    //     setTimeout(() => {
    //       that.websocketsend(agentData);
    //     }, 500);
    //   }
    // },
    websocketonopen() {
      // console.log('连接成功');
      this.heartCheck.reset();
      this.heartCheck.start();
      const actions = { test: '12345' };
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      // console.log('连接失败');
      // this.initWebsocket();
      this.heartCheck.errorTimeObj = setTimeout(() => { // 如果超过一定时间还没重置，说明后端主动断开了
        this.initWebsocket(); // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, 10000);
    },
    websocketonmessage(e) {
      this.heartCheck.reset();
      this.heartCheck.start();
      this.wsCall(e);
      // const redata = JSON.parse(e.data);
      // console.log(redata);
    },
    websocketsend(Data) {
      // console.log('发送数据');
      this.websock.send(Data);
    },
    websocketclose() {
      // console.log('连接成功')
      // console.log('断开连接', e);
      this.websock.close();
      // this.initWebsocket();
    },
  }
};

// eslint-disable-next-line
export { paginationMixin, filterMixin, webSocketMixin, sortMixin, sockMixin };