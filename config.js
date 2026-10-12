var $=function(i){return document.getElementById(i)},P=function(n){return '\u20b1'+n.toLocaleString('en-PH')};

function calc(){
  var q=0,sub=0;
  ITEMS.forEach(function(it){
    q+=Q[it.key];
    sub+=Q[it.key] * it.price; // Added *
  });
  var save=Math.floor(q/2) * CFG.save, // Added *
      after=sub-save,
      cp=cpOn?Math.min(CFG.coupon.off,after):0;
  return {q:q,sub:sub,save:save,cp:cp,total:after-cp};
}

function loadCart(){
  var m=location.search.match(/[?&]c=([^&]+)/); // Fixed regex
  if(!m)return;
  m[1].split(',').forEach(function(x){
    var a=x.split('.'),n=parseInt(a[1],10);
    if(Q.hasOwnProperty(a[0]) && n > 0) Q[a[0]]=Math.min(n,99); // Fixed &&
  });
}

function keepUrl(extra){
  try{history.replaceState(null,'',location.pathname+cartQuery()+(extra||''))}catch(e){}
}
