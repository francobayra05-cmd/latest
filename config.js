/* ===== EDIT THESE. Keep every number and promise TRUE. ===== */
var CFG={
page:'YOUR_PAGE',          // Facebook page username for Messenger
price:699,                 // price of ONE card (placeholder, set your real price)
save:299,                  // peso savings for every 2 cards in one order
freeShip:true,             // only keep true if you really ship free
coupon:{code:'TAPFIRST',off:50},   // code '' disables it
promoEnds:''               // e.g. '2026-10-31T23:59:00+08:00'. Leave '' unless the offer really ends
};
/* Card versions. extra = pesos added to the card price (0 = same price).
aspect = card width divided by height for the design preview. Your sign is 95 x 95 mm, so 1. */
var VER=[
{id:'v1',name:'Version 1',d:'NFC tap only',extra:0,aspect:1},
{id:'v2',name:'NFC+QR',d:'QR code on the right',extra:0,aspect:1}
];
var PR=[
{id:'google',name:'Google Review Card',d:'Opens your Google review page.',card:'#ffffff',ct:'#0b3fcf',dot:'#1f3dff',pts:['Customers land straight on your review box','Fewer steps than searching for you on Google','Choose NFC only, or NFC plus a QR code']},
{id:'facebook',name:'Facebook Card',d:'Opens your Facebook page.',card:'#1877f2',ct:'#fff',dot:'#1877f2',pts:['Customers follow or message your page in one tap','Good for shops that take orders on Messenger','Choose NFC only, or NFC plus a QR code']},
{id:'tiktok',name:'TikTok Card',d:'Opens your TikTok profile.',card:'#111',ct:'#fff',dot:'#111',pts:['Send people straight to your profile','Good for creators and food stalls','Choose NFC only, or NFC plus a QR code']},
{id:'instagram',name:'Instagram Card',d:'Opens your Instagram profile.',card:'#d6246e',ct:'#fff',dot:'#d6246e',pts:['Followers in one tap, no typing a username','Good for salons, cafes and online sellers','Choose NFC only, or NFC plus a QR code']}
];
/* ========================================================= */
/* ---- shared code used by all pages. You do not need to edit below. ---- */
var $=function(i){return document.getElementById(i)},P=function(n){return '\u20b1'+n.toLocaleString('en-PH')};
var ITEMS=[];PR.forEach(function(p){VER.forEach(function(v){ITEMS.push({key:p.id+'-'+v.id,p:p,v:v,price:CFG.price+v.extra})})});
var Q={},cpOn=false;ITEMS.forEach(function (it){Q[it.key]=0});

function calc(){
  var q=0,sub=0;
  ITEMS.forEach(function(it){
    q+=Q[it.key];
    sub+=Q[it.key] * it.price; // FIXED: Added *
  });
  var save=Math.floor(q/2) * CFG.save, // FIXED: Added *
      after=sub-save,
      cp=cpOn?Math.min(CFG.coupon.off,after):0;
  return {q:q,sub:sub,save:save,cp:cp,total:after-cp};
}

/* the cart travels between pages in the address, for example checkout.html?c=google-v1.2,facebook-v2.1 (nothing is stored in the browser) */
function cartQuery(){
  var e=ITEMS.filter(function(it){return Q[it.key] >0}).map(function(it){return it.key+'.'+Q[it.key]}).join(',');
  return e?'?c='+e:'';
}

function loadCart(){
  var m=location.search.match(/[?&]c=([^&]+)/); // FIXED: Removed spaces in regex
  if(!m)return;
  m[1].split(',').forEach(function(x){
    var a=x.split('.'),n=parseInt(a[1],10);
    if(Q.hasOwnProperty(a[0]) && n > 0) Q[a[0]]=Math.min(n,99); // FIXED: Changed & & to &&
  });
}

function thumb(p){return '--cc:'+(p.img?'url('+p.img+')':p.dot)}

function keepUrl(extra){
  try{history.replaceState(null,'',location.pathname+cartQuery()+(extra||''))}catch(e){}
}

/* small drawing of each card version */
function verSvg(id){
  var s=' <svg width= "64 " height= "44 " viewBox= "0 0 64 44 " fill= "none " stroke= "currentColor " stroke-width= "2.4 " stroke-linecap= "round " aria-hidden= "true " > <rect x= "1.5 " y= "1.5 " width= "61 " height= "41 " rx= "5 "/ >';
  if(id==='v2')s+=' <path d= "M9 16c3 4 3 8 0 12M15 12c5 7 5 13 0 20 "/ > <rect x= "36 " y= "11 " width= "20 " height= "20 " stroke-width= "2 "/ > <rect x= "39 " y= "14 " width= "5 " height= "5 " fill= "currentColor " stroke= "none "/ > <rect x= "48 " y= "14 " width= "5 " height= "5 " fill= "currentColor " stroke= "none "/ > <rect x= "39 " y= "23 " width= "5 " height= "5 " fill= "currentColor " stroke= "none "/ > <rect x= "48 " y= "25 " width= "3 " height= "3 " fill= "currentColor " stroke= "none "/ >';
  else s+=' <path d= "M26 15c4 5 4 9 0 14M32 11c6 7 6 15 0 22M38 7c8 9 8 21 0 30 "/ >';
  return s+' </svg >';
}

/* Google card photo, embedded so it always loads */
var IMG='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHSc dHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAKAAoADASIAAhEBAxEB/8QAHQAAAgICAwEAAAAAAAAAAAAAAAEHCAUGAgM ECf/EAF8QAAEDAwEFBAYEBwkKDAYCAwEAAgMEBREGBxIhMUEIE1FhFCJxgZGhFTJCsSNSYnKywdEWFzNUgpKTouEYJENEU1ZzdLPSJTQ2RlVjZHWDhMLwJidFlKPDZeI3tPH/xAAcAQEAAgMBAQEAAAAAAAAAAAAAAQQCAwUGBwj/xABAEQA CAgIABAIHBgMHBAMAAwAAAQIDBBEFEiExE0EGFCIyUWFxUoGRobHRFULBBxYjMzTh8CQ1Q1NicvElgqL/2gAMAwEAAhEDEQA/AIqQhC+wHggQhCAEIQpAIQhAgQhCEghCFBAIQhACEIUgEIQiAckIKEAICEINAkhGVAEhNChvRIZWetWk6q7 aeut6jcRHbw0
