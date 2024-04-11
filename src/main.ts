import { FetchProducts } from "./utils/fetch";

let loadedImages = 0, maxLoaded = 1, currentPhoto = 0;

type Product = {
  id: number,
  title: string,
  description: string,
  price: number,
  discountPercantage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string,
  thumbnail: string,
  images: string[],
}

const imagesContainer = document.querySelector<HTMLDivElement>(".images")! 

const placeImages = (arr: string[], destination: HTMLElement): void => {
  destination.childNodes.forEach((node) => {
    node.remove();
  })
  arr.map((item, index) => {    
    const image = document.createElement("img");
    image.classList.add("carousel-image");
    image.setAttribute("src", item)
    image.setAttribute("id", (index).toString());

    const number = document.createElement("span")
    number.classList.add("carousel-image-order-number")
    number.innerText = (index+1).toString();
    
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("carousel-image-container");
    
    imageContainer.append(image, number);
    destination?.append(imageContainer);
  })
}

const placeCarouselControls = (destination: HTMLElement): void => {

  for(let i = 0; i < destination.children.length; i++)
    if(destination.children[i].classList.contains("btn--carousel"))
      destination.children[i].remove();

  const previousBtn = document.createElement("button");
  previousBtn.classList.add("btn", "btn--carousel", "btn--carousel__left");
  previousBtn.setAttribute("type", "button")

  const nextBtn = document.createElement("button");
  nextBtn.classList.add("btn", "btn--carousel", "btn--carousel__right");
  nextBtn.setAttribute("type", "button")

  destination.append(previousBtn, nextBtn)
}

const object = await FetchProducts<Product>("https://dummyjson.com/products/1")
.then((data) => {
    const images = data.images;
    console.log(images);
    maxLoaded = images.length

    placeImages(images, imagesContainer);
    const imageElements = imagesContainer.querySelectorAll<HTMLImageElement>("img")!

    
    imageElements.forEach((img) => {
      img.onload = () => {
        loadedImages++;
      }
    })

  })
.catch((error) => {
  console.error(error.message)
})
.finally((message = "fetched") => {
  console.log(message)
})

let interval: number | undefined;
interval = setInterval(() => {
  console.log(loadedImages, maxLoaded)
  if(loadedImages >= maxLoaded){
    console.log("all loaded...")
    document.querySelector<HTMLElement>(".loading")?.remove()
    placeCarouselControls(document.querySelector(".container")!)

    const handleMovingImagesLeft = () => {
      const images = imagesContainer.
      querySelectorAll<HTMLImageElement>(".carousel-image-container");
      let newCurrentPhoto = currentPhoto%images.length;
      images.forEach((img) => {
        img.style.transform = `translateX(${-newCurrentPhoto * 100}%)`
        
      })
    }
    const handleMovingImagesRight = () => {
      console.log("current", currentPhoto)
      const images = imagesContainer.
      querySelectorAll<HTMLImageElement>(".carousel-image-container");
      let newCurrentPhoto = currentPhoto%images.length;
      images.forEach((img) => {
        if(currentPhoto < 0){
          img.style.transform = `translateX(${(-images.length-newCurrentPhoto) * 100}%)`
        }else{
          img.style.transform = `translateX(${-newCurrentPhoto * 100}%)`
        }
      })
    }

    const handlePreviousClick = () => {
      currentPhoto--;
      handleMovingImagesRight();
    }
    
    const handleNextClick = () => {
      currentPhoto++;
      handleMovingImagesLeft();
    }

    const btnPrevious = document.querySelector<HTMLButtonElement>(".btn--carousel__left")
    btnPrevious?.addEventListener("click", handlePreviousClick)

    const btnNext = document.querySelector<HTMLButtonElement>(".btn--carousel__right")
    btnNext?.addEventListener("click", handleNextClick)

    clearInterval(interval);
  }
})

