const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const closeModal = document.getElementById('close-modal-btn')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const cartCount = document.getElementById('cart-count')
const adressInput = document.getElementById('adress')
const adressWarn = document.getElementById('adress-warn')
let cart = []

//open modal
cartBtn.addEventListener('click', function () {
  //adressWarn.classList.add("hidden")
  updateCartModal()
  cartModal.style.display = 'flex'
})

//close modal click outside
cartModal.addEventListener('click', function (event) {
  if (event.target == cartModal) {
    cartModal.style.display = 'none'
  }
})

//close modal click in button close
closeModal.addEventListener('click', function () {
  cartModal.style.display = 'none'
})

//get atributtes
menu.addEventListener('click', function (event) {
  let buttonParent = event.target.closest('.add-to-cart-btn')

  if (buttonParent) {
    const name = buttonParent.getAttribute('data-name')
    const price = parseFloat(buttonParent.getAttribute('data-price'))
    //add to cart function call
    addToCart(name, price)
  }
})

//function add to cart
function addToCart(name, price) {
  const itemExisting = cart.find(item => item.name === name)

  if (itemExisting) {
    itemExisting.quantity += 1
    return
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    })
  }

  updateCartModal()
}

//Atualizar carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = ''
  let total = 0

  cart.forEach(item => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
    cartItemElement.innerHTML = `
    <div class = "flex items-center justify-between">
      <div>
      <p class = "font-medium">${item.name}</p>
      <p>Qtd: ${item.quantity}</p>
      <p class = "font-normal mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-btn" data-name=${item.name}>Remover</button>
    </div>
    `
    total += item.price * item.quantity
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartCount.innerHTML = cart.length
  cartTotal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

//remove item to cart
cartItemsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-btn')) {
    const name = event.target.getAttribute('data-name')
    removeItemCart(name)
  }
})
//remove item
function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name)
  console.log(index)
  //console.log(item.name)
  if (index !== -1) {
    const itemFind = cart[index]

    if (itemFind.quantity > 1) {
      itemFind.quantity -= 1
      updateCartModal()
      return
    }
    cart.splice(index, 1)
  }
  updateCartModal()
}

//capturar o endereço de entrega

adressInput.addEventListener('input', function (event) {
  let inputValue = event.target.value
  if (inputValue !== '') {
    adressWarn.classList.add('hidden')
    adressInput.classList.remove('border-red-500')
  }
})

//finalizar pedido - fazer verificação se tem item no carrinho e se o endereço de entrega está vazio
checkoutBtn.addEventListener('click', function () {
  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: 'Estamos fechados no momento!',
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'red'
      }
    }).showToast()
    return
  }

  if (cart.length === 0) return
  if (adressInput.value === '') {
    adressWarn.classList.remove('hidden')
    adressInput.classList.add('border-red-500')
    return
  }

  //redirecionando para a API do whatssapp
  const cartItems = cart
    .map(item => {
      return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
    })
    .join('')

  const message = encodeURIComponent(cartItems)
  const phone = '71983361884'

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`,
    '_blank'
  )
  cart = []
  updateCartModal()
})

//verificar o horário do pedido, se está dentro da hora de funcionamento do restaurante

function checkRestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()
  return hora >= 18 && hora < 22
  //retorna true se estiver funcionando
}

//horário de funcionamento

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()
if (isOpen) {
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-600')
} else {
  spanItem.classList.remove('bg-green-600')
  spanItem.classList.add('bg-red-500')
}
