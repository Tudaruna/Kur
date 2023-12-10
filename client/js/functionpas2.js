function show_hide_password2(target){
  var input = document.getElementById('newPassword');
  if (input.getAttribute('type') == 'password') {
  target.classList.add('view');
  input.setAttribute('type', 'text');
  } else {
  target.classList.remove('view');
  input.setAttribute('type', 'password');
  }
  return false;
}