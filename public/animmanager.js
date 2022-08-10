// Lucas Bubner, 2022

// Get all the divs on the page that are displayed
// Script is deferred and therefore the DOM should be ready
const alldivs = document.querySelectorAll('.common div');

// Run over each div and apply an animation to each of them
for (let i = 0, j = 1; i < alldivs.length; i++, j += 0.25) {
    alldivs[i].style.animation = 'generate ' + j + 's ease';
}