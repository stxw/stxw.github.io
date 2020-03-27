function addElement(elementName, src) {
  var tempDom = document.createElement(elementName);

  tempDom.src = src;
  tempDom.href = src;
  tempDom.rel = 'stylesheet';

  document.body.appendChild(tempDom);
  return new Promise(resolve => {
    tempDom.onload = res => {
      setTimeout(resolve, 0, res);
    };
  });
}
var tempDiv = document.createElement('div');
tempDiv.innerHTML = `
            <div class="waifu" style="bottom:-95px">
		        <div class="waifu-tips"></div>
		        <div style="overflow:hidden;"><canvas id="live2d" width='280' height="500" style="top:-120px" class="live2d"></canvas></div>
		        <div class="waifu-tool">
		            <span class="fui-chat"></span>
		            <span class="fui-user"></span>
		            <span class="fui-photo"></span>
		            <span class="fui-home"></span>
		        </div>
            </div>
  `;
document.body.appendChild(tempDiv.children[0]);
addElement('link', 'media/live2d/waifu.css');
addElement('script', 'media/live2d/live2d.js')
  .then(() => addElement('script', 'media/live2d/model.js'))
  .then(() => addElement('script', 'media/live2d/message.js'))
  .then(() => {
    setTimeout(() => {
      loadlive2d('live2d', models[0].models[0].link);
    }, 100);
  });
