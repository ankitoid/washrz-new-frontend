import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../App.css";
const images = import.meta.glob("../assets/washrzimages/*", { eager: true });

const getImageSrc = (imgName) => {
  const path = `../assets/washrzimages/${imgName}`;
  return images[path]?.default || sliderImageUrl[0].url;
};

const sliderImageUrl = [
  {
    url: "https://i2.wp.com/www.geeksaresexy.net/wp-content/uploads/2020/04/movie1.jpg?resize=600%2C892&ssl=1",
  },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const ItemSlider2 = ({ laundry, handleClick }) => {
  // Determine screen size for conditional rendering of arrows
  const isMobileOrTablet = window.innerWidth < 1024;

  return (
    <div className="item-slider-container">
      <Carousel
        responsive={responsive}
        infinite
        autoPlaySpeed={3000}
        swipeable
        draggable
        keyBoardControl
        showDots={false}
        arrows={isMobileOrTablet} // Enable arrows only for tablet and mobile screens
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
      >
        {/* {laundry?.children?.map((item, index) => (
          <div
            key={index}
            className="slider-item"
            onClick={() => handleClick(item, "laundry")}
          >
            <div className="slider-content">
              <img
                className="slider-image"
                src={
                  item.img
                    ? require(`../assets/washrzimages/${item.img}`)
                    : sliderImageUrl[0].url
                }
                alt={item.label}
              />
              <div className="slider-info">
                <p className="item-label">{item.label}</p>
                <p className="item-price">₹{item.viewPrice}</p>
              </div>
            </div>
          </div>
        ))} */}
        {laundry?.children?.map((item, index) => (
          <div
            key={index}
            className="slider-item"
            onClick={() => handleClick(item, "laundry")}
          >
            <div className="slider-content">
              <img
                className="slider-image"
                src={item.img ? getImageSrc(item.img) : sliderImageUrl[0].url}
                alt={item.label}
              />
              <div className="slider-info">
                <p className="item-label">{item.label}</p>
                <p className="item-price">₹{item.viewPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ItemSlider2;
