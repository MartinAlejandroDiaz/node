const btnStartRecord = document.getElementById('btnStartRecord');
const btnStopRecord = document.getElementById('btnStopRecord');
const texto = document.getElementById('texto');

let recognition = new webkitSpeechRecognition();
recognition.lang = 'es-ES';
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
    const results = event.results;
    console.log(results);
}


btnStartRecord.addEventListener('click', () => {
    recognition.start();
});

btnStartRecord.addEventListener('click', () => {
    recognition.abort();
});
