if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/app/service-worker.js')
    .then(registration => {
      console.log('SW registered with scope:', registration.scope);
    })
    .catch(err => {
      console.error('Registration failed:', err);
    });
  });
}
window.addEventListener('load', () => {
		let API_KEY = '';
		let API_ENDPOINT = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&format=json&nojsoncallback=1`;
		let req = new XMLHttpRequest();
		req.open('GET', `${API_ENDPOINT}&tags=birds`, true);
		req.addEventListener('loadend', event => {
			let response = event.target.responseText;
			let responseJSON = JSON.parse(response);

			let photos = responseJSON.photos.photo;

			for (let index in photos){
				let photo = photos[index];

				let img = document.createElement('img');
				img.alt = photo.title;
				img.src = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
				document.body.appendChild(img);
			}
		});
		req.send(null);
	});