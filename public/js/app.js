// const { response } = require("express");
// const comment = require("../../models/comment");


let username;
let socket = io()

do{
    username = prompt('Enter your name:')
}while(!username)

const textarea = document.querySelector('#textarea')
const submitBtn = document.querySelector('#submitBtn')
const commentBox = document.querySelector('.comment__box')

submitBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    let comment = textarea.value

    if(!comment){
        return
    }
    postComment(comment);
});

function postComment(comment){
    let data = {
        username: username,
        comment: comment ,

    }
    appendToDom(data);
    textarea.value = ''
    // broadcast
    broadcastComment(data);
    // Sync with mongo db
    syncWithDb(data);
}

function appendToDom(data){
    let Lteg = document.createElement('li')
    Lteg.classList.add('comment', 'mb-3')

    let markup = `
    <div class="card border-light mt-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.comment}</p>
            <div>
                <img src="/img/clock.png" alt="clock">
                <small>${moment(data.time).format('LT')}</small>
            </div>
        </div>
    </div>
</li>
  `

  Lteg.innerHTML = markup
  commentBox.prepend(Lteg)
}

function broadcastComment(data){
    socket.emit('comment', data)

}
socket.on('comment', (data)=>{
    appendToDom(data);
})
let timerId = null
function debounce(func, timer){
    if(timerId){
        clearTimeout(timerId)
    }
    timerId = setTimeout(()=>{
        func()
    },timer)
}
let typingDIv = document.querySelector('.typing');

socket.on('typing', (data)=>{
    typingDIv.innerHTML= `${data.username} is Typing...`
    debounce(function(){
        typingDIv.innerHTML=''
    },1000)
})
// Event Listner on textarea

textarea.addEventListener('keyup', (e)=>{
    socket.emit('typing', {username})
})

// Api calls

function syncWithDb(data){
    const headers = {
            'Content-Type': 'application/json'
    }
    fetch('api/comments', {method: 'Post', body: JSON.stringify(data),headers})
    .then(response =>{response.json()})
    .then(result => console.log(result))

}

function fetchComments(){
    fetch('/api/comments')
    .then(res => res.json())
    .then(result =>{
        console.log(result)
        result.forEach(comment => {
            comment.time = comment.createdAt
            appendToDom(comment)
        })
        
    })
}
window.onload = fetchComments