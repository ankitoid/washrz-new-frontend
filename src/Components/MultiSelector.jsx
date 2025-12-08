import React, { useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";

function DropdownOption({ option, onClick, currentPath, qty, setqty }) {
  // console.log("here is the current path----> ", currentPath);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [currentPathQty, setcurrentPathQty] = useState([]);

  // console.log("here is the qty--> ", qty);

  useEffect(() => {
    let timeout;
    if (isSubMenuOpen) {
      timeout = setTimeout(() => {
        setqty(0);
        setIsSubMenuOpen(true);
      }, 10000); // Adjust the delay in milliseconds (e.g., 500ms for half a second delay)
    } else {
      clearTimeout(timeout);
      setIsSubMenuOpen(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isSubMenuOpen, setqty]);

  const handleMouseEnter = () => {
    // setTimeout(()=> {
    // }, 1000)
    setqty(0);
    setIsSubMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSubMenuOpen(false);
  };

  const handleClick = () => {
    console.log("this is current path--> ", currentPathQty);
    if (option.children.length === 0) {
      // This is a leaf-level option
      if (!option.Price) {
        // console.log("!!!!options11 ", currentPath);
        onClick([...currentPath, option]);
      } else {
        setcurrentPathQty([...currentPath, option]);
      }
    }
  };

  return (
    <ListGroup.Item
      className={`dropdown-option ${isSubMenuOpen ? "active" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      // style={{ transition: " all 3s ease-in" }}
    >
      <span>{option.label}</span>
      {isSubMenuOpen && (
        <ListGroup>
          {option && option.children
            ? option.children.map((childOption, index) => (
                <DropdownOption
                  key={index}
                  option={childOption}
                  onClick={onClick}
                  currentPath={[...currentPath, option]}
                  qty={qty}
                  setqty={setqty}
                />
              ))
            : null}
          {option.Price ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <input
                value={qty}
                min={0}
                style={{ width: "78%" }}
                placeholder="Please Provide Qty"
                type="number"
                onChange={(e) => {
                  if (e.target.value < 0) {
                    return alert("Dont Give Negative Value:(");
                  }
                  setqty(e.target.value);
                }}
              />{" "}
              <Button
                style={{ width: "20%" }}
                onClick={() => {
                  onClick([...currentPathQty]);
                }}
                className="btn btn-success"
              >
                Add
              </Button>
            </div>
          ) : null}
        </ListGroup>
      )}
    </ListGroup.Item>
  );
}

function NestedDropdown({ menuItems, setMenuItems }) {
  const [qty, setqty] = useState(0);
  // ... (same as your existing code)
  const options = [
    {
      label: "Laundary",
      children: [
        {
          label: "Wash and Fold",
          children: [
            {
              label: "Wearable",
              children: [{ label: "weight", children: [] }],
            },
            {
              label: "Non-Wearable",
              children: [{ label: "weight", children: [] }],
            },
          ],
        },
        {
          label: "Wash and Iron",
          children: [
            {
              label: "Wearable",
              children: [{ label: "weight", children: [] }],
            },
            {
              label: "Non-Wearable",
              children: [{ label: "weight", children: [] }],
            },
          ],
        },
      ],
    },
    {
      label: "Dryclean",
      children: [
        {
          label: "Shirt/T-shirt",
          Price: 100,
          children: [],
        },
        {
          label: "Jeans",
          Price: 120,
          children: [],
        },
        {
          label: "Trousers",
          Price: 100,
          children: [],
        },
        {
          label: "Blazer/Jacket",
          Price: 250,
          children: [],
        },
        {
          label: "3 piece Suit",
          Price: 450,
          children: [],
        },
        {
          label: "2 piece Suit",
          Price: 300,
          children: [],
        },
        {
          label: "Long Blazer",
          Price: 350,
          children: [],
        },
        {
          label: "Sweatshirt/Hoodie",
          Price: 250,
          children: [],
        },
        {
          label: "Winter Coats",
          Price: 350,
          children: [],
        },
        {
          label: "Heavy Saree",
          Price: 350,
          children: [],
        },
        {
          label: "Medium Saree",
          Price: 300,
          children: [],
        },
        {
          label: "Saree",
          Price: 250,
          children: [],
        },
        {
          label: "Blouse",
          Price: 80,
          children: [],
        },
        {
          label: "Heavy Blouse",
          Price: 120,
          children: [],
        },
        {
          label: "Lehnga",
          Price: 250,
          children: [],
        },
        {
          label: "Medium Lehnga",
          Price: 500,
          children: [],
        },
        {
          label: "Heavy Lehnga",
          Price: 700,
          children: [],
        },
        {
          label: "Heavy Dress",
          Price: 500,
          children: [],
        },
        {
          label: "Dress",
          Price: 350,
          children: [],
        },
        {
          label: "Heavy Gown",
          Price: 300,
          children: [],
        },
        {
          label: "Gown",
          Price: 200,
          children: [],
        },
        {
          label: "Dupatta",
          Price: 80,
          children: [],
        },
        {
          label: "Heavy Dupatta",
          Price: 100,
          children: [],
        },
        {
          label: "Kurta Pyjama",
          Price: 250,
          children: [],
        },
        {
          label: "Shawl",
          Price: 200,
          children: [],
        },
        {
          label: "Sweater/Cardigan",
          Price: 200,
          children: [],
        },
        {
          label: "Shrug",
          Price: 200,
          children: [],
        },
        {
          label: "Leather Jackets",
          Price: 450,
          children: [],
        },
        {
          label: "Belt",
          Price: 150,
          children: [],
        },
        {
          label: "Leather Belt",
          Price: 250,
          children: [],
        },
        {
          label: "Pillow Cover",
          Price: 50,
          children: [],
        },
        {
          label: "Large Pillow",
          Price: 100,
          children: [],
        },
        {
          label: "Small Pillow",
          Price: 60,
          children: [],
        },
        {
          label: "Blanket(single)",
          Price: 300,
          children: [],
        },
        {
          label: "Blanket(double)",
          Price: 400,
          children: [],
        },
        {
          label: "Druvet(single)",
          Price: 300,
          children: [],
        },
        {
          label: "Druvet(double)",
          Price: 400,
          children: [],
        },
        {
          label: "Druvet(single)",
          Price: 300,
          children: [],
        },
        {
          label: "Quilt(single)",
          Price: 350,
          children: [],
        },
        {
          label: "Quilt(double)",
          Price: 450,
          children: [],
        },
        {
          label: "Bed Cover(single)",
          Price: 250,
          children: [],
        },
        {
          label: "Bed Cover(double)",
          Price: 350,
          children: [],
        },
        {
          label: "Bed Sheet(single)",
          Price: 200,
          children: [],
        },
        {
          label: "Bed Sheet(double)",
          Price: 300,
          children: [],
        },
        {
          label: "Handbag DryClean (Small)",
          Price: 300,
          children: [],
        },
        {
          label: "Handbag DryClean (Medium)",
          Price: 450,
          children: [],
        },
        {
          label: "Handbag DryClean (Large)",
          Price: 450,
          children: [],
        },
        {
          label: "Sports Bag DryClean",
          Price: 400,
          children: [],
        },
        {
          label: "Leather Bag DryClean (Small)",
          Price: 400,
          children: [],
        },
        {
          label: "Leather Bag DryClean (Large)",
          Price: 700,
          children: [],
        },
      ],
    },
    {
      label: "ShoeSpa",
      children: [
        {
          label: "Sport Shoe Dryclean",
          Price: 500,
          children: [],
        },
        {
          label: "Sneaker DryClean",
          Price: 500,
          children: [],
        },
        {
          label: "Leather Shoe DryClean",
          Price: 600,
          children: [],
        },
        {
          label: "Suede Shoe DryClean",
          Price: 600,
          children: [],
        },
        {
          label: "Boots DryClean",
          Price: 700,
          children: [],
        },
        {
          label: "Stilettos DryClean",
          Price: 600,
          children: [],
        },
        {
          label: "Sliders DryClean",
          Price: 250,
          children: [],
        },
        {
          label: "Sandel DryClean",
          Price: 300,
          children: [],
        },
      ],
    },
  ];

  const handleOptionClick = (selectedPath) => {
    // Handle the click on the last level option and store the selected path
    let obj = {};
    console.log(
      "Selected Path:",
      selectedPath.map((option) => {
        if (option.label === "Laundary" || option.label === 'Dryclean' || option.label === 'ShoeSpa') {
          obj.group = option.label;
        } else if (
          option.label === "Wash and Fold" ||
          option.label === "Wash and Iron"
        ) {
          obj.type = option.label;
        } else if (
          option.label === "Wearable" ||
          option.label === "Non-Wearable"
        ) {
          obj.wearType = option.label;
        } else if (option.label === "weight") {
          // console.log("hii ia m  weight--->");
          // Prompt the user for a custom weight input
          const customWeight = prompt("Enter custom weight:");
          if (isNaN(Number(customWeight))) return alert("enter a number");
          obj.weight = customWeight;
        } else if (option.Price) {
          // console.log("here is the gfyrewgfrew qty--> ", option);
          obj.type = option.label;
          obj.wearType = "-";
          obj.weight = qty;
          if (obj.wearType === "-") {
            option.Price = option.Price * qty;
          }
          obj.Price = option.Price;
        }

        return option.label;
      })
    );
    // console.log("obj--->> ", obj);
    setMenuItems((prev) => [...prev, obj]);
  };

  return (
    <div className="container mt-4">
      <ListGroup>
        {options.map((option, index) => (
          <>
            <DropdownOption
              key={index}
              option={option}
              onClick={handleOptionClick}
              currentPath={[]}
              setqty={setqty}
              qty={qty}
            />
            {/* {option.Price ? <input type='number'/> : null} */}
          </>
        ))}
      </ListGroup>
    </div>
  );
}

export default NestedDropdown;
