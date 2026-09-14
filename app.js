(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const calcTime=$("calcTime"), calcOperation=$("calcOperation"), calcMinutes=$("calcMinutes");
  const calcResult=$("calcResult"), calcExpression=$("calcExpression");
  const startTime=$("startTime"), endTime=$("endTime"), overnight=$("overnight");
  const differenceMinutes=$("differenceMinutes"), differenceText=$("differenceText");
  const resetAll=$("resetAll");

  function parseTime(value){
    if(!/^\\d{2}:\\d{2}$/.test(value)) return null;
    const [h,m]=value.split(":").map(Number);
    return h>=0&&h<=23&&m>=0&&m<=59?h*60+m:null;
  }
  function formatTime(total){
    const n=((total%1440)+1440)%1440;
    return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
  }
  function durationText(n){
    const h=Math.floor(n/60),m=n%60;
    if(h===0)return `${m} 分鐘`;
    if(m===0)return `${h} 小時`;
    return `${h} 小時 ${m} 分鐘`;
  }
  function calcAddSub(){
    const base=parseTime(calcTime.value),mins=Number(calcMinutes.value);
    if(base===null){calcResult.textContent="--:--";calcExpression.textContent="請輸入有效時間";return;}
    if(!Number.isInteger(mins)||mins<0||mins>1000000){
      calcResult.textContent="--:--";calcExpression.textContent="分鐘必須為 0 至 1,000,000 的整數";return;
    }
    const sign=calcOperation.value==="add"?1:-1;
    calcResult.textContent=formatTime(base+sign*mins);
    calcExpression.textContent=`${calcTime.value} ${sign===1?"＋":"－"} ${mins} 分鐘`;
  }
  function calcDiff(){
    const start=parseTime(startTime.value),end=parseTime(endTime.value);
    if(start===null||end===null){differenceMinutes.textContent="-- 分鐘";differenceText.textContent="請輸入有效時間";return;}
    let diff=end-start;
    if(overnight.checked){if(diff<0)diff+=1440;}
    else if(diff<0){
      differenceMinutes.textContent="時間順序錯誤";
      differenceText.textContent="如跨午夜，請勾選跨午夜計算";return;
    }
    differenceMinutes.textContent=`${diff} 分鐘`;
    differenceText.textContent=durationText(diff);
  }
  function update(){calcAddSub();calcDiff();}
  [calcTime,calcOperation,calcMinutes,startTime,endTime,overnight].forEach(el=>{
    el.addEventListener("input",update);el.addEventListener("change",update);
  });
  resetAll.addEventListener("click",()=>{
    calcTime.value="10:30";calcOperation.value="add";calcMinutes.value="45";
    startTime.value="10:30";endTime.value="12:15";overnight.checked=false;update();
  });
  update();
})();