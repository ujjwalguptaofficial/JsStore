
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(window.location.href + 'service-worker.js')
    .then(function() {
      console.log('sw registered');
    })
    .catch(function(e) {
      console.log('sw-error:', e);
    });
} else {
  console.error('this browser does not support service workers');
}

fetch('https://placekitten.com/300/200').then(function(response) {
  if(response.ok) {
    response.blob().then(function(myBlob) {
      var objectURL = URL.createObjectURL(myBlob);
      var img = document.getElementById('myImage');
      img.src = objectURL;
    });
  } else {
    console.log('Network response was not ok.');
  }
})
.catch(function(error) {
  console.log('There has been a problem with your fetch operation: ' + error.message);
});