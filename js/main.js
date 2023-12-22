//Add new item 
function newItem(data, id) {

    function hash() {
        const entry = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ' //rsrs
        let newHash = '';
        Array.from(entry).forEach(char => {
            newHash += entry[parseInt(Math.random() * (50 - 1))]
        })
        return newHash
    }

    return {
        nome: data[0].value,
        descricao: data[1].value,
        img: data[2].value,
        id: id != null ? hash() : id
    }
}

function removeItem(id) {
    fetch(`http://localhost:3000/locais/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(updateShow())
        .catch(err => console.log(err.message))
}

function setAlterations(id, body) {
    fetch(`http://localhost:3000/locais/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
}

//listener cancel edit button
document.querySelector('#cancel').addEventListener('click', _ => {
    document.querySelector('#pop-up-to-edit').classList.toggle('display-none');
})

function editItem(id) {
    document.querySelector('#pop-up-to-edit').classList.toggle('display-none');
    document.querySelector('#form-to-edit').addEventListener('submit', e => {
        e.preventDefault()
        const theInputs = Array.from(document.querySelectorAll('#form-to-edit > input'))

        setAlterations(id, newItem(theInputs, id));

        updateShow();
    })
}

function constructHTML({ nome, descricao, img, id }) {
    const htmlTags = `
    <div class="icons">
        <span class="material-symbols-outlined" acct="edit">
            edit
        </span>

        <span class="material-symbols-outlined" acct="delete">
            delete
        </span>
    </div>
    <img src='${img}' alt="imagem do local" class="img-local">
    <p>Local: ${nome}</p>
    <p>Descrição: ${descricao}</p>`;

    const newDiv = document.createElement('div')
    newDiv.classList.add('item-data');
    newDiv.innerHTML = htmlTags;

    newDiv.addEventListener('click', e => {
        e.target.getAttribute('acct') === 'delete' ? removeItem(id) : '';
        e.target.getAttribute('acct') === 'edit' ? editItem(id) : '';
    })

    return newDiv;
}

function updateShow() {
    const outputHtml = document.querySelector('#output-data')
    outputHtml.value = '';
    fetch('http://localhost:3000/locais')
        .then(async content => {
            const itens = await content.json();
            itens.forEach(subiten => {
                outputHtml.appendChild(constructHTML(subiten));
            })
        })
        .catch(err => console.log(err.message))
}

document.querySelector('#my-form').addEventListener('submit', e => {
    e.preventDefault();

    const entryInputs = Array.from(e.target.children[0].children) //form(div, button) > div > inputs

    fetch('http://localhost:3000/locais', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem(entryInputs))
    })
    updateShow();
})

updateShow();