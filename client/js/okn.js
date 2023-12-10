function openModal (modal) {
    console.log(modal.style.dislpay)
    modal.classList.add("active")
  }
  
  function closeModal (modal) {
    modal.classList.remove("active")
  }

  let modaludalnum1 = document.getElementById('ud1')
  let btnModaludalnum1 = document.getElementById('btn-modal-ud1')

  let modalsoxrnum1 = document.getElementById('soxr1')
  let btnModalsoxrnum1 = document.getElementById('btn-modal-soxr')

  btnModaludalnum1.addEventListener("click", () => {
    openModal(modaludalnum1)
  })

  btnModalsoxrnum1.addEventListener("click", () => {
    openModal(modalsoxrnum1)
  })

  let crossModal = document.querySelectorAll(".cross-modal")
  
  crossModal.forEach(elem => {
    elem.addEventListener("click", () => {
      closeModal(elem.parentElement.parentElement.parentElement)
    })
  })