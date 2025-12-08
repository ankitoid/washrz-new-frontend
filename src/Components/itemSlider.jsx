import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../App.css";
// "../assets/washrzimages/blazer.png"
const images = import.meta.glob("../assets/washrzimages/*", { eager: true });

const imgurl = "../assets/washrzimages/";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 7,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 8,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};
const sliderImageUrl = [
  //First image url
  {
    url: "https://i2.wp.com/www.geeksaresexy.net/wp-content/uploads/2020/04/movie1.jpg?resize=600%2C892&ssl=1",
  },
];

const ItemSlider = ({ dryCleanItems, shoeSpa, laundry, type, handleClick }) => {
  const Obj =
    type === "DryClean"
      ? dryCleanItems
      : type === "ShoeSpa"
      ? shoeSpa
      : type === "laundry"
      ? laundry
      : {};
  return (
    <div className="parent">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: type === "laundry" ? 4 : 5,
            partialVisibilityGutter: 40,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {Obj?.children?.map((item, index) => {
          const imagePath = item.img
            ? `../assets/washrzimages/${item.img}`
            : null;
          const imageSrc =
            imagePath && images[imagePath]
              ? images[imagePath].default
              : sliderImageUrl[0].url;

          return (
            <div
              className="slider"
              key={index}
              onClick={() => {
                handleClick(item, type);
              }}
            >
              <img
                style={{ height: "100px", width: "70%", objectFit: "fit" }}
                src={imageSrc}
                alt="image"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#90EE90",
                  // marginTop: "-100px",
                  backgroundColor: "teal",
                  color: "white",
                  height: "100px",
                  width: "70%",
                  textAlign: "center",
                  borderRadius: "0px 0px 10px 10px",
                }}
              >
                {`${item.label}(₹${item.viewPrice})`}
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};
export default ItemSlider;
