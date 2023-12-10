function openModal (modal) {
    console.log(modal.style.dislpay)
    modal.classList.add("active")
  }
  
  function closeModal (modal) {
    modal.classList.remove("active")
  }
  
  let modalVhod = document.getElementById('id01')
  let btnModalVhod = document.getElementById('btn-modal-vhod')
  
  btnModalVhod.addEventListener("click", () => {
    openModal(modalVhod)
  })
  
  let modalReg = document.getElementById('id02')
  let btnModalReg = document.getElementById('btn-modal-reg')
  
  btnModalReg.addEventListener("click", () => {
    openModal(modalReg)
    closeModal(modalVhod)
  })
  
  let crossModal = document.querySelectorAll(".cross-modal")
  
  crossModal.forEach(elem => {
    elem.addEventListener("click", () => {
      closeModal(elem.parentElement.parentElement.parentElement)
    })
  })
  
  
  //убрать-показать пароль вход
  function show_hide_passwordvhod(target){
    let input = document.getElementById('passwordvhod');
    if (input.getAttribute('type') == 'password') {
    target.classList.add('view');
    input.setAttribute('type', 'text');
    } else {
    target.classList.remove('view');
    input.setAttribute('type', 'password');
    }
    return false;
  }
  
  //убрать-показать пароль регисрация
  function show_hide_passwordreg(target){
    var input = document.getElementById('passwordreg');
    if (input.getAttribute('type') == 'password') {
    target.classList.add('viewreg');
    input.setAttribute('type', 'text');
    } else {
    target.classList.remove('viewreg');
    input.setAttribute('type', 'password');
    }
    return false;
  }

  

  