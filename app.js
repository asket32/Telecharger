const input = document.querySelector('input');
const btn = document.querySelector('button');

btn.addEventListener('click', (event)=>{
    event.preventDefault();
    downloadFile(input.value);
})

function downloadFile(url){
    if(!url) return;

    // appel API
    fetch(url, {method: 'GET'}).then(Response => Response.blob())
    .then(data =>{
        console.log(data);
        const urlFichier = URL.createObjectURL(data)
        console.log(urlFichier);
        /**
         * <a href='urlFichier' download></a>
         */
        const a = document.createElement('a');
        a.href = urlFichier;
        a.setAttribute('download',urlFichier.replace(/^.*[\\\/]/, ""));

        document.querySelector('body').appendChild(a);

        a.click();

        document.querySelector('body').remove(a);

        URL.revokeObjectURL(urlFichier);
        location.reload()
    }).catch(error =>{
        console.log(error);
    })
}