const allcoffeeelemt = document.querySelectorAll(".coffee");
const carouselimage = document.getElementById("carousel");
const title = document.querySelector(".details-sections h1");
const paragraph = document.querySelector(".details-sections p");
const background = document.querySelector(".circle-background");
const pricetag = document.getElementById("pricetag");
const deletebtn = document.querySelectorAll('.bi-trash');

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".menu a");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            navLinks.forEach(link => {
                link.style.color = "white";
            });
            link.style.color = "#087957";
        });
        // e.preventDefault();
    });
});

allcoffeeelemt.forEach((data, i) => {
    const text = data.getAttribute("data-text");
    const price = data.getAttribute("data-price");
    const coffetitel = data.querySelector('h3');
    const image = data.querySelector('img');
    data.addEventListener("click", () => {
        pricetag.textContent = price;
        paragraph.textContent = text;
        title.textContent = coffetitel.textContent;
        carouselimage.src = image.src;
        carouselimage.classList.add('animate');

        setTimeout(() => {
            carouselimage.classList.remove('animate');

        }, 300)
    })

});
