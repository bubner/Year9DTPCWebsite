// Lucas Bubner, 2022

// Get all the divs on the page that are displayed
const alldivs = document.querySelectorAll('.common div');
// Get all the anchor tags for fade-out animations
const allanchors = document.querySelectorAll('a');

// Run over each div and apply a fade in animation to each of them
for (let i = 0, j = 1; i < alldivs.length; i++, j += 0.25) {
    // Manages display of elements as well, to account for slower servers and computers
    alldivs[i].style.display = 'block';
    alldivs[i].style.animation = 'generate ' + j + 's ease';
}

// Run over each anchor and apply a fade out event listener to each of them
for (let i = 0; i < allanchors.length; i++) {

    // Pass through any requests that are to the same webpage
    if (allanchors[i].pathname === window.location.pathname) {
        continue;
    }

    // When a click is received, grab the address the user is going to and hold it
    allanchors[i].addEventListener('click', (e) => {
        let outgoing = e.currentTarget;

        // Wait until the fade out animation is done, and then allow the webpage to go through
        let listener = (e) => {
            window.location = outgoing.href;
            // Remove the temporary event listeners we made
            fader.removeEventListener('animationend', listener);
        }

        // Stop anchor redirect until the fade out animation is done
        fader.addEventListener('animationend', listener);
        e.preventDefault();
        // Start the fade out animation immediately
        fader.classList.add('activate');
    });
}
