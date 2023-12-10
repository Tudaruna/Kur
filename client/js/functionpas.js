
function show_hide_password(target){
  var input = document.getElementById('currentPassword');
  if (input.getAttribute('type') == 'password') {
  target.classList.add('view');
  input.setAttribute('type', 'text');
  } else {
  target.classList.remove('view');
  input.setAttribute('type', 'password');
  }
  return false;
}



var details = document.querySelectorAll("details");
for(i=0;i<details.length;i++) {
  details[i].addEventListener("toggle", accordion);
}
function accordion(event) {
  if (!event.target.open) return;
  var details = event.target.parentNode.children;
  for(i=0;i<details.length;i++) {
    if (details[i].tagName != "DETAILS" || !details[i].hasAttribute('open') || event.target == details[i]) continue;
    details[i].removeAttribute("open");
  }
}




