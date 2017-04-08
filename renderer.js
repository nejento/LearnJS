// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote,
      fs = require('fs-extra'),
      os = require('os');
let currentWindow = remote.getCurrentWindow();
//let style = getComputedStyle(currentWindow);

//Resize okna a zobrazení scrollbaru
currentWindow.on('resize', e => {
    document.body.style.setProperty('--area-size', (currentWindow.getSize()[1] -40) + "px", '');
});

//Minimalizace okna
document.querySelector('.min-button').addEventListener('click', e => {
    let window = remote.getCurrentWindow();
    window.minimize();
});

//Maximalizace okna
document.querySelector('.max-button').addEventListener('click', e => {
    let window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();
    } else {
        window.unmaximize();
    }
});

//Zavření okna
document.querySelector('.close-button').addEventListener('click', e => {
    let window = remote.getCurrentWindow();
    window.close();
});

//Kliknutí v menu
document.body.addEventListener('click', e => {
    if (e.target.dataset.section) {
        loadSite(e);
    } else if (e.target.dataset.result) {
        processCode(e);
    }/*else if (event.target.dataset.modal) {
        handleModalTrigger(event)
    } else if (event.target.classList.contains('modal-hide')) {
        hideAllModals()
    }*/
});

//Akce po spuštění aplikace
$(document).ready(() => {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

    //Zobrazení Welcome screen
    document.getElementById("welcome-section").classList.add('is-shown');
    updateBread("welcome-section");
});

//Načtení stránky
function loadSite(event) {
    hideSites();
    const sectionId = event.target.dataset.section + '-section';
    document.getElementById(sectionId).classList.add('is-shown');
    updateBread(sectionId);

}

//Zakrytí předchozí stránky
function hideSites() {
    const sections = document.querySelectorAll('.is-shown');
    Array.prototype.forEach.call(sections, section => {
        section.classList.remove('is-shown');
    });

    /*const buttons = document.querySelectorAll('.nav-button.is-selected');
    Array.prototype.forEach.call(buttons, function (button) {
        button.classList.remove('is-selected')
    });*/
}

//Aktualizace hlavičky
function updateBread(section) {
    let breadcrumb = document.getElementById(section).getAttribute("breadcrumb");
    let finalbreadcrumb = '<span id="windowName">';
    if (breadcrumb.includes(">")) {
        breadcrumb = document.getElementById(section).getAttribute("breadcrumb").split(">");
        for (let i = 0; i < breadcrumb.length; i++) {
            finalbreadcrumb = finalbreadcrumb + '<a class="breadcrumb">' + breadcrumb[i].trim() + '</a>';
        }
    } else finalbreadcrumb = finalbreadcrumb + '<a class="breadcrumb">' + breadcrumb + '</a>';

    finalbreadcrumb = finalbreadcrumb + '</span>';
    $("#windowName").replaceWith(finalbreadcrumb);
}

//Zpracování kódu do iframu
function processCode(event) {
    const codeID = event.target.dataset.result,
          blocks = $('[data-codename="' + codeID + '"]'),
          dir = os.homedir() + "/.learnjs/";

    fs.ensureDir(dir, err => {
        if (err) throw err;
        fs.emptyDir(dir, err => {
            if (err) throw err;
            for (let i = 0; i < blocks.length; i++) {
                fs.writeFile(os.homedir() + "/.learnjs/" + blocks[i].dataset.filename, window[codeID + "-" + blocks[i].dataset.filename].getValue(), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
        })
    });



}