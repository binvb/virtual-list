(function() {
  "use strict";
  onmessage = (evt) => {
    let len = evt.data.length

    console.log(`看下接收到的数据长度: ${len}`)
  };
})();
