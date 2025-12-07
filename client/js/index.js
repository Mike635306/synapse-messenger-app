import { ringtones } from "../modules/module.js";

console.log(ringtones);
const msgBox = document.querySelector('#chat-msg-dialog');
const msgInput = document.querySelector('#message-input');
const sendMsgBtn = document.querySelector('#send-msg');
const mobileMenuBtn = document.querySelector('#mobile_menu');
const audioMsgBtn = document.querySelector('#audio-msg');
const sendAudioMsgbtn = document.querySelector('#audio-msg-notif');
const plusMsgBtn = document.querySelector('#plus-msg');
const sendPlusMsgBtn = document.querySelector('#plys-msg-notif');

let audioChunks = [];
let isAudioRecording = false;
let mediaRecording;

mobileMenuBtn.addEventListener('click', ()=>{
    const aside = document.querySelector('.right-bar-overlay');
    aside.classList.toggle('active');
})

let user = prompt('Enter your name');
const socket = io();



const createMessage = (msg,name) => {    

    let now = new Date();
    let currentDate  = `${  String(now.getHours()).padStart(2,'0') } : ${String(now.getMinutes()).padStart(2,'0')}`;

    return( `
            <div class="message">
            
                    <div class="fotor"><img src="./assets/Property 1=Elias Thorsen.png" alt=""></div>
                    <div class="message_overlay">
                        <div class="message_name">${name}</div>
                        <p>${msg}</p>   
                        <div class="date">${currentDate}</div>
                   </div>
            </div>
           
         `)

}


const sendMessage = () => {
     
    let user_data = {msg:msgInput.value,user_name:user};
     
     if(msgInput.value.length == 0 ){
        alert('Мы не можем отправить пустую строку')
        // throw new Error('Пустая строка: Невозможно отправить пустое сообщение');
        return;
     }

     socket.emit('chat message', user_data);    
     console.log('Сообщение успешно отправлено')
     msgInput.value = ''; // Очищаем поле ввода после отправки
}


const audioMessage = async() =>{
    if(isAudioRecording){
       mediaRecording.stop()
       isAudioRecording = !isAudioRecording;
         sendAudioMsgbtn.classList.toggle('active');
        return;
    }else{
       const stream = await navigator.mediaDevices.getUserMedia({audio:true})
       mediaRecording = new MediaRecorder(stream);
       mediaRecording.ondataavailable = (e) => {
       audioChunks.push(e.data) 
       }
       mediaRecording.onstop = async () => {
        console.log('запись')
        const blob = new Blob(audioChunks,{type:'audio/webm'});
        audioChunks = [];
        socket.emit('voice message',blob);
       }
       mediaRecording.start()
       isAudioRecording = !isAudioRecording;
        sendAudioMsgbtn.classList.toggle('active');
    }
     
}

//Тип отправки сообщения через Enter
window.addEventListener('keypress', (e)=>{
    let pressedKey = e.key;
    if(pressedKey == 'Enter'){
         sendMessage();
    }
})
//Тип отправки сообщения через кнопку
sendMsgBtn.addEventListener('click', ()=>{
    sendMessage();
})
audioMsgBtn.addEventListener('click',()=>{
    audioMessage();
})


socket.on('chat message', (data)=>{
       let audio = new Audio(ringtones[0]);
       audio.volume = 0.1;
       audio.play();
    const {msg,user_name} = data;
    msgBox.innerHTML += createMessage(msg,user_name);
})

socket.on('voice message',(data)=>{
    const blob = new Blob([data],{tupe:'text/plain'})
    const url = URL.createObjectURL(blob)
   msgBox.innerHTML += `<audio src="${url}" controls ></audio>`;

})



