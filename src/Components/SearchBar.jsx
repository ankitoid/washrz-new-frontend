import React, { useState } from "react";
import { Dropdown } from "semantic-ui-react";
import "../style/searchbar.css";
import { Laundary, Dryclean, Shoespa } from "../utills/product";
const images = import.meta.glob("../assets/washrzimages/*", { eager: true });

const newArr = [
  ...Laundary.children,
  ...Dryclean.children,
  ...Shoespa.children,
];

const DropdownExampleSearchSelection = ({ handleClick }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  // const dropdownOptions = newArr.map((el) => ({
  //   key: "bj",
  //   value: el.label,
  //   image: { avatar: true, src: `../assets/washrzimages/${el.img}` },
  //   text: `${el.label}(${el.viewPrice})`,
  //   ...el,
  // }));

  const dropdownOptions = newArr.map((el) => {
    const imagePath = `../assets/washrzimages/${el.img}`;
    const imageSrc = images[imagePath]?.default || "";

    return {
      key: el.label, // or use something unique
      value: el.label,
      image: { avatar: true, src: imageSrc },
      text: `${el.label}(${el.viewPrice})`,
      ...el,
    };
  });

  const handleDropdownChange = (e, data) => {
    const selectedItemValue = data.value;
    const selectedItemObject = dropdownOptions.find(
      (item) => item.value === selectedItemValue
    );
    setSelectedItem(selectedItemObject);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "90%" }}>
        <Dropdown
          className="search"
          placeholder="Select Items"
          fluid
          search
          selection
          options={dropdownOptions}
          onChange={handleDropdownChange}
          value={selectedItem ? selectedItem.value : ""}
        />
      </div>
      <button
        style={{
          borderRadius: "10px",
          backgroundColor: "teal",
          color: "white",
          width: "10%",
        }}
        onClick={() => {
          if (selectedItem) {
            handleClick(selectedItem, selectedItem.type);
            // Clear the selected item after adding
            setSelectedItem(null);
          }
        }}
      >
        Add
      </button>
    </div>
  );
};

export default DropdownExampleSearchSelection;
