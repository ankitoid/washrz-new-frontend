import { App } from "antd";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../App.css";
const images = import.meta.glob("../assets/washrzimages/*", { eager: true });

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const sliderImageUrl = [
  // Default image URL if item does not have an image
  {
    url: "https://i2.wp.com/www.geeksaresexy.net/wp-content/uploads/2020/04/movie1.jpg?resize=600%2C892&ssl=1",
  },
];

const ItemSlider1 = ({ shoeSpa, handleClick }) => {
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
        arrows={true} // Show arrows
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
      >
        {/* {shoeSpa?.children?.map((item, index) => (
          <div
            key={index}
            className="slider-item"
            onClick={() => handleClick(item, "ShoeSpa")}
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
        {shoeSpa?.children?.map((item, index) => {
          const imagePath = item.img
            ? `../assets/washrzimages/${item.img}`
            : null;
          const imageSrc =
            imagePath && images[imagePath]
              ? images[imagePath].default
              : sliderImageUrl[0].url;

          return (
            <div
              key={index}
              className="slider-item"
              onClick={() => handleClick(item, "ShoeSpa")}
            >
              <div className="slider-content">
                <img className="slider-image" src={imageSrc} alt={item.label} />
                <div className="slider-info">
                  <p className="item-label">{item.label}</p>
                  <p className="item-price">₹{item.viewPrice}</p>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default ItemSlider1;
