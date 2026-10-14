/* Accessible biography dialogs for Rehabwheel people gallery. */
document.addEventListener("DOMContentLoaded",function(){
 document.querySelectorAll(".rw-person-open[data-dialog]").forEach(function(btn){
  btn.addEventListener("click",function(){var modal=document.getElementById(btn.dataset.dialog);if(modal&&typeof modal.showModal==="function")modal.showModal()});
 });
 document.querySelectorAll(".rw-person-dialog").forEach(function(modal){
  var close=modal.querySelector(".rw-dialog-close");
  if(close)close.addEventListener("click",function(){modal.close()});
  modal.addEventListener("click",function(e){if(e.target===modal)modal.close()});
 });
});