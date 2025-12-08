import React, { useState } from "react";
import Item from "./Item";
import ItemSlider from "./itemSlider";
import BillCustomerInfo from "./BillCustomerInfo";
import BillPriceInfo from "./BillPriceInfo";
import { Button, Modal, Spinner } from "react-bootstrap";
import axios, { axiosPrivate, instance } from "../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import useAuth from "../hooks/useAuth";
import Recorder from "../Componentsnew/Recorder/Recorder";
import WebCamMulti from "../Componentsnew/webcam/WebCamMulti";
import ItemSlider2 from "./ItemSlider2";
import ItemSlider3 from "./ItemSlider3";
import ItemSlider1 from "./ItemSlider1";

function BillCart() {
  const navigate = useNavigate();
  const { currObj, setCurrObj } = useAuth();
  const { auth } = useAuth();
  const [loader, setLoader] = useState(false);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [CapturedImages, setCapturedImages] = useState([]);
  const [voiceFile, setVoiceFile] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const [laundry, setLaundry] = useState({
    label: "Laundry",
    children: [
      {
        label: "W & F(Wearables)",
        viewPrice: "80/kg",
        Price: 80,
        newQtyPrice: 80,
        img: `w_f_wearable.jpg`,
      },
      {
        label: "W & F(Non-Wearables)",
        viewPrice: "100/kg",
        Price: 100,
        newQtyPrice: 100,
        img: `w_f_non-wearable.jpg`,
      },
      {
        label: "W & I(Wearables)",
        viewPrice: "100/kg",
        Price: 100,
        newQtyPrice: 100,
        img: `w_i_wearable.jpg`,
      },
      {
        label: "W & I(Non-Wearables)",
        viewPrice: "120/kg",
        Price: 120,
        newQtyPrice: 120,
        img: `w_i_non-wearable.jpg`,
      },
    ],
  });
  // const [washAndIron, setWashAndIron] = useState({
  //   label: "Laundry(Wash & Iron)",
  //   children: [
  //     {
  //       label: "Wash & Iron(Wearable)",
  //       viewPrice: "100/kg",
  //       Price: 100,
  //     },
  //     {
  //       label: "Wash & Iron(Non-Wearable)",
  //       viewPrice: "120/kg",
  //       Price: 120,
  //     },
  //   ],
  // });
  const [dryCleanItems, setDryCleanItems] = useState({
    label: "Dryclean",
    children: [
      {
        label: "Shirt/T-shirt",
        Price: 100,
        viewPrice: "100/pc",
        newQtyPrice: 100,
        img: `shirt.png`,
      },
      {
        label: "Jeans",
        Price: 120,
        viewPrice: "120/pc",
        newQtyPrice: 120,
        img: `jeans.png`,
      },
      {
        label: "Trousers",
        Price: 100,
        viewPrice: "100/pc",
        newQtyPrice: 100,
        img: `trouser.png`,
      },
      {
        label: "Blazer/Jacket",
        Price: 250,
        viewPrice: " 250/pc",
        newQtyPrice: 250,
        img: `blazer.png`,
      },
      {
        label: "3 piece Suit",
        Price: 450,
        viewPrice: "450/pc",
        newQtyPrice: 450,
        img: `3_pc_suit.png`,
      },
      {
        label: "2 piece Suit",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `2_pc_suit.png`,
      },
      {
        label: "Long Blazer",
        Price: 350,
        viewPrice: "350/pc",
        newQtyPrice: 350,
        img: `longblazer.png`,
      },
      {
        label: "Sweatshirt /Hoodie",
        Price: 250,
        viewPrice: " 250/pc",
        newQtyPrice: 250,
        img: `hoodie.png`,
      },
      {
        label: "Winter Jacket",
        Price: 350,
        viewPrice: "350/pc",
        newQtyPrice: 350,
        img: `winter_jacket.jpg`,
      },
      {
        label: "Heavy Saree",
        Price: 350,
        viewPrice: "350/pc",
        newQtyPrice: 350,
        img: `heavysaree.png`,
      },
      {
        label: "Medium Saree",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `mediumsaree.png`,
      },
      {
        label: "Saree",
        Price: 250,
        viewPrice: "250/pc",
        newQtyPrice: 250,
        img: `saree.png`,
      },
      {
        label: "Blouse",
        Price: 80,
        viewPrice: "80/pc",
        newQtyPrice: 80,
        img: `blouse.png`,
      },
      {
        label: "Heavy Blouse",
        Price: 120,
        viewPrice: "120/pc",
        newQtyPrice: 120,
        img: `heavy_blouse.webp`,
      },
      {
        label: "Lehnga",
        Price: 250,
        viewPrice: "250/pc",
        newQtyPrice: 250,
        img: `lehenga.png`,
      },
      {
        label: "Medium Lehnga",
        Price: 500,
        viewPrice: "500/pc",
        newQtyPrice: 500,
        img: `mediumlehenga.png`,
      },
      {
        label: "Heavy Lehnga",
        Price: 700,
        viewPrice: "700/pc",
        newQtyPrice: 700,
        img: `heavy_lehenga.jpg`,
      },
      {
        label: "Heavy Dress",
        Price: 500,
        viewPrice: "500/pc",
        newQtyPrice: 500,
        img: `heavy_dress.jpg`,
      },
      {
        label: "Dress",
        Price: 350,
        viewPrice: "350/pc",
        newQtyPrice: 350,
        img: `dress.png`,
      },
      {
        label: "Heavy Gown",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `heavy_gown.jpg`,
      },
      {
        label: "Gown",
        Price: 200,
        viewPrice: "200/pc",
        newQtyPrice: 200,
        img: `gown.jpg`,
      },
      {
        label: "Dupatta",
        Price: 80,
        viewPrice: "80/pc",
        newQtyPrice: 80,
        img: `dupatta.jpg`,
      },
      {
        label: "Heavy Dupatta",
        Price: 100,
        viewPrice: "100/pc",
        newQtyPrice: 100,
        img: `heavy_duptta.jpg`,
      },
      {
        label: "Kurta Pyjama",
        Price: 250,
        viewPrice: "250/pc",
        newQtyPrice: 250,
        img: `kurta_pajama.jpg`,
      },
      {
        label: "Shawl",
        Price: 200,
        viewPrice: "200/pc",
        newQtyPrice: 200,
        img: `shwal.jpg`,
      },
      {
        label: "Sweater /Cardigan",
        Price: 200,
        viewPrice: " 200/pc",
        newQtyPrice: 200,
        img: `cardigin.jpg`,
      },
      {
        label: "Shrug",
        Price: 200,
        viewPrice: "200/pc",
        newQtyPrice: 200,
        img: `srug.jpg`,
      },
      {
        label: "Leather Jackets",
        Price: 450,
        viewPrice: "450/pc",
        newQtyPrice: 450,
        img: `leather_jacket.jpg`,
      },
      {
        label: "Belt",
        Price: 150,
        viewPrice: "150/pc",
        newQtyPrice: 150,
        img: `belt.jpg`,
      },
      {
        label: "Leather Belt",
        Price: 250,
        viewPrice: "250/pc",
        newQtyPrice: 250,
        img: `leather_belt.webp`,
      },
      {
        label: "Pillow Cover",
        Price: 50,
        viewPrice: "50/pc",
        newQtyPrice: 50,
        img: `pillow_cover.jpg`,
      },
      {
        label: "Large Pillow",
        Price: 100,
        viewPrice: "100/pc",
        newQtyPrice: 100,
        img: `large_pillow.jpg`,
      },
      {
        label: "Small Pillow",
        Price: 60,
        viewPrice: "60/pc",
        img: `small_pillow.jpg`,
        newQtyPrice: 60,
      },
      {
        label: "Blanket(single)",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `blanket(single).jpg`,
      },
      {
        label: "Blanket(double)",
        Price: 400,
        viewPrice: "400/pc",
        newQtyPrice: 400,
        img: `double_blanket.jpg`,
      },
      {
        label: "Duvet(single)",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `Druvet_single.jpg`,
      },
      {
        label: "Duvet(double)",
        Price: 400,
        viewPrice: "400/pc",
        newQtyPrice: 400,
        img: `Druvet_double.jpg`,
      },
      // {
      //   label: "Druvet(single)",
      //   Price: 300,
      //   viewPrice: "300/pc",
      //   newQtyPrice: 300,
      // },
      {
        label: "Quilt(single)",
        Price: 350,
        viewPrice: "350/pc",
        newQtyPrice: 350,
        img: `Quilt_single.jpg`,
      },
      {
        label: "Quilt(double)",
        Price: 450,
        viewPrice: "450/pc",
        newQtyPrice: 450,
        img: `Quilt_double.jpg`,
      },
      {
        label: "Bed Cover(single)",
        Price: 250,
        viewPrice: "250/pc",
        newQtyPrice: 250,
        img: `bed_cover_single.jpg`,
      },
      {
        label: "Bed Cover(double)",
        Price: 350,
        viewPrice: "350/pc",
        newQtyPrice: 350,
        img: `bed_cover_double.jpg`,
      },
      {
        label: "Bed Sheet(single)",
        Price: 200,
        viewPrice: "200/pc",
        newQtyPrice: 200,
        img: `bed_sheet_single.jpg`,
      },
      {
        label: "Bed Sheet(double)",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `bed_sheet_double.jpg`,
      },
      {
        label: "Handbag(Small)",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `handbag_small.jpeg`,
      },
      {
        label: "Handbag(Medium)",
        Price: 450,
        viewPrice: "450/pc",
        newQtyPrice: 450,
        img: `handbag_medium.jpg`,
      },
      {
        label: "Handbag(Large)",
        Price: 450,
        viewPrice: "450/pc",
        newQtyPrice: 450,
        img: `handbag_large.jpg`,
      },
      {
        label: "Sports Bag",
        Price: 400,
        viewPrice: "400/pc",
        newQtyPrice: 400,
        img: `sports_bag.jpg`,
      },
      {
        label: "Leather Bag(Small)",
        Price: 400,
        viewPrice: "400/pc",
        newQtyPrice: 400,
        img: `Leatherbag_small.webp`,
      },
      {
        label: "Leather Bag(Large)",
        Price: 700,
        viewPrice: "700/pc",
        newQtyPrice: 700,
        img: `leather_bag_large.jpg`,
      },
    ],
  });
  const [shoeSpa, setShoeSpa] = useState({
    label: "ShoeSpa",
    children: [
      {
        label: "Sport Shoes / Sneakers",
        Price: 500,
        viewPrice: "500/pc",
        newQtyPrice: 500,
        img: `sportsshoes.png`,
      },
      // {
      //   label: "Sneaker",
      //   Price: 500,
      //   viewPrice: "500/pc",
      //   newQtyPrice: 500,
      //   img : `sportsshoes.png`
      // },
      {
        label: "Leather Shoes",
        Price: 600,
        viewPrice: "600/pc",
        newQtyPrice: 600,
        img: `leather_shoes.jpg`,
      },
      {
        label: "Suede Shoes",
        Price: 600,
        viewPrice: "600/pc",
        newQtyPrice: 600,
        img: `suedeshoes.png`,
      },
      {
        label: "Boots",
        Price: 700,
        viewPrice: "700/pc",
        newQtyPrice: 700,
        img: `boots.png`,
      },
      {
        label: "Stilettos",
        Price: 600,
        viewPrice: "600/pc",
        newQtyPrice: 600,
        img: `stilettos.png`,
      },
      {
        label: "Sliders",
        Price: 250,
        viewPrice: "250/pc",
        newQtyPrice: 250,
        img: `sliders.png`,
      },
      {
        label: "Sandals",
        Price: 300,
        viewPrice: "300/pc",
        newQtyPrice: 300,
        img: `sandals.png`,
      },
    ],
  });

  const handleQuantity = (type, i, qty, item, index) => {
    const changedArr = [...items];
    if (qty - 1 === 0 && type === "-") {
      return restoreItem(item, index);
    }
    console.log("qty ", qty);
    if (changedArr[i].quantity === 0 && type === "-") return;
    if (type === "-") {
      changedArr[i].quantity = changedArr[i].quantity - 1;
      changedArr[i].newQtyPrice = (
        changedArr[i].quantity * changedArr[i].price
      ).toFixed(2);
    } else if ("+") {
      changedArr[i].quantity = changedArr[i].quantity + 1;
      changedArr[i].newQtyPrice = (
        changedArr[i].quantity * changedArr[i].price
      ).toFixed(2);
    }
    setItems([...changedArr]);
    const nitems = [...changedArr].filter((el) => el.quantity !== 0);
    setCurrObj((prev) => {
      return { ...prev, items: nitems };
    });
  };

  const inputChange = (i, value, type, item, index) => {
    if (value + "" === "0") {
      return restoreItem(item, index);
    }
    const changedArr = [...items];
    if (value >= 0) {
      changedArr[i].quantity = !value
        ? ""
        : changedArr[i].type === "DryClean" || changedArr[i].type === "ShoeSpa"
        ? Math.ceil(value * 1)
        : value * 1;
      changedArr[i].newQtyPrice = (
        changedArr[i].quantity * changedArr[i].price
      ).toFixed(2);
      setItems([...changedArr]);
    }
  };

  const handleClick = (obj, type) => {
    let newObj = {
      heading: obj.label,
      subHeading: obj.viewPrice,
      viewPrice: obj.viewPrice,
      quantity: 1,
      price: obj.Price,
      newQtyPrice: obj.Price,
      type: type,
      img: obj.img,
    };
    if (type === "DryClean") {
      setDryCleanItems({
        ...dryCleanItems,
        children: dryCleanItems.children.filter((el) => el.label !== obj.label),
      });
    } else if (type === "ShoeSpa") {
      setShoeSpa({
        ...shoeSpa,
        children: shoeSpa.children.filter((el) => el.label !== obj.label),
      });
    } else if (type === "laundry") {
      setLaundry({
        ...laundry,
        children: laundry.children.filter((el) => el.label !== obj.label),
      });
    }
    if (JSON.stringify(items[items.length - 1]) === JSON.stringify(newObj))
      //for not adding item more than ones in list from serach bar
      return;
    setItems((prev) => [...prev, newObj]);
    const nitems = [...items, newObj].filter((el) => el.quantity !== 0);
    setCurrObj((prev) => {
      return { ...prev, items: [...nitems, newObj] };
    });
  };

  // const handledelete = async (id) => {
  //   try {
  //     const res = await axios.put(`/completePickup/${id}`);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };
  const handleComplete = async (id) => {
    try {
      const res = await axiosPrivate.put(`/completePickup/${id}`);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const [dis, setDis] = useState(0);

  // Function to capture current location
  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRiderLocation({ latitude, longitude });
          toast.success("Location captured successfully!");
        },
        (error) => {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              toast.error(
                "Permission denied. Please enable location services."
              );
              break;
            case 2: // POSITION_UNAVAILABLE
              toast.error(
                "Position unavailable. Please check your GPS or network."
              );
              break;
            case 3: // TIMEOUT
              toast.error("Location request timed out. Try again.");
              break;
            default:
              toast.error(
                "An unknown error occurred while capturing location."
              );
          }
          console.error(error);
        },
        { timeout: 10000 } // Optional: Timeout in milliseconds
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async () => {
    const fTotal = (total - total * (dis / 100)).toFixed(2);
    setLoader(true);
    // const plantName = "Delhi";
    // setCurrObj((prev) => {
    //   return { ...prev, plantName: plantName };
    // });

    setCurrObj((prev) => {
      return { ...prev, price: fTotal };
    });

    if (!currObj.customerName) {
      setLoader(false);
      return toast.error("Please fill all field :(");
    }
    if (dis > 100) {
      setLoader(false);
      return toast.error("More than 100% discount is not allowed :(");
    }

    if (fTotal <= 0) {
      setLoader(false);
      return toast.error("Please add items");
    }
    // Show a confirmation dialog before proceeding
    const confirmSubmit = window.confirm(
      "Are you sure you want to finalize this order?"
    );

    // If the user cancels, stop the function execution
    if (!confirmSubmit) {
      if (auth?.role === "admin") {
        navigate("/order");
      }
      if (auth?.role === "rider") {
        console.log(auth?.role);
        navigate("/rider/live");
      }
      return;
    }

    // If the user confirms, show the modal to upload files
    setShowModal(true);
  };

  /////////// const handleUpload = async () => {
  //   setShowModal(false);
  //   setSpinner(true);
  //   if (!CapturedImage) {
  //     toast.error("Please capture an image.");
  //     if (auth?.role === "admin") {
  //       navigate("/pickups");
  //     }
  //     if (auth?.role === "rider") {
  //       console.log(auth?.role);
  //       navigate("/rider/pickups");
  //     }
  //     setSpinner(false);
  //     return;
  //   }

  //   if (!riderLocation) {
  //     toast.error("Please capture the location.");
  //     if (auth?.role === "admin") {
  //       navigate("/pickups");
  //     }
  //     if (auth?.role === "rider") {
  //       console.log(auth?.role);
  //       navigate("/rider/pickups");
  //     }
  //     setSpinner(false);

  //     return;
  //   }

  //   const fTotal = (total - total * (dis / 100)).toFixed(2);
  //   setLoader(true);

  //   setCurrObj((prev) => ({ ...prev, price: fTotal }));

  //   if (!currObj.customerName) {
  //     setLoader(false);
  //     return toast.error("Please fill all fields :(");
  //   }

  //   if (!currObj.plantName) {
  //     setLoader(false);
  //     return toast.error("Please fill plantName :(");
  //   }

  //   if (dis > 100) {
  //     setLoader(false);
  //     return toast.error("More than 100% discount is not allowed :(");
  //   }

  //   if (fTotal <= 0) {
  //     setLoader(false);
  //     return toast.error("Please add items");
  //   }

  //   const formData = new FormData();
  //   formData.append("image", CapturedImage);
  //   formData.append("voice", voiceFile);
  //   formData.append("location", JSON.stringify(riderLocation));

  //   // Stringify currObj before appending
  //   formData.append("currObj", JSON.stringify(currObj));

  //   formData.append("price", fTotal); // Use fTotal directly

  //   try {
  //     const uploadResponse = await axiosPrivate.post(
  //       `/rider/uploadFiles/${currObj.id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (uploadResponse.status === 200) {
  //       toast.success("Files uploaded successfully");
  //       setCapturedImage(null);
  //       setVoiceFile(null);
  //       setShowModal(false);

  //       // After successful upload, call the final submission logic
  //       handleSubmitFinal();
  //     } else {
  //       toast.error("Error uploading files");
  //       setSpinner(false);
  //     }
  //   } catch (error) {
  //     toast.error("Error uploading files");
  //     console.error("Error: ", error);
  //     setSpinner(false);
  //   }
  // };

  // const handleUpload = async () => {
  //   setShowModal(false);
  //   setSpinner(true);

  //   if (!CapturedImages || CapturedImages.length === 0) {
  //     toast.error("Please capture or upload at least one image.");
  //     navigateBasedOnRole();
  //     setSpinner(false);
  //     return;
  //   }

  //   if (!riderLocation) {
  //     toast.error("Please capture the location.");
  //     navigateBasedOnRole();
  //     setSpinner(false);
  //     return;
  //   }

  //   const fTotal = (total - total * (dis / 100)).toFixed(2);
  //   setLoader(true);
  //   setCurrObj((prev) => ({ ...prev, price: fTotal }));

  //   if (!currObj.customerName || !currObj.plantName) {
  //     setLoader(false);
  //     return toast.error("Please fill all fields :(");
  //   }

  //   if (dis > 100) {
  //     setLoader(false);
  //     return toast.error("More than 100% discount is not allowed :(");
  //   }

  //   if (fTotal <= 0) {
  //     setLoader(false);
  //     return toast.error("Please add items");
  //   }

  //   const formData = new FormData();

  //   CapturedImages.forEach((image, index) =>
  //     formData.append(`images[${index}]`, image)
  //   );
  //   if (voiceFile) {
  //     formData.append("voice", voiceFile);
  //   }
  //   formData.append("location", JSON.stringify(riderLocation));
  //   formData.append("currObj", JSON.stringify(currObj));
  //   formData.append("price", fTotal);

  //   try {
  //     const uploadResponse = await axiosPrivate.post(
  //       `/rider/uploadFiles/${currObj.id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (uploadResponse.status === 200) {
  //       toast.success("Files uploaded successfully");
  //       resetCaptureStates();
  //       handleSubmitFinal();
  //     } else {
  //       toast.error("Error uploading files");
  //     }
  //   } catch (error) {
  //     toast.error("Error uploading files");
  //     console.error("Error: ", error);
  //   } finally {
  //     setSpinner(false);
  //   }
  // };

  const handleUpload = async () => {
    setShowModal(false);
    setSpinner(true);

    if (!CapturedImages || CapturedImages.length === 0) {
      toast.error("Please capture or upload at least one image.");
      navigateBasedOnRole();
      setSpinner(false);
      return;
    }

    // if (!riderLocation) {
    //   toast.error("Please capture the location.");
    //   navigateBasedOnRole();
    //   setSpinner(false);
    //   return;
    // }

    const fTotal = (total - total * (dis / 100)).toFixed(2);
    setLoader(true);
    setCurrObj((prev) => ({ ...prev, price: fTotal }));

    if (!currObj.customerName || !currObj.plantName) {
      setLoader(false);
      return toast.error("Please fill all fields :(");
    }

    if (dis > 100) {
      setLoader(false);
      return toast.error("More than 100% discount is not allowed :(");
    }

    if (fTotal <= 0) {
      setLoader(false);
      return toast.error("Please add items");
    }

    const formData = new FormData();

    // Append all images with the field name `image`
    CapturedImages.forEach((image) => formData.append("image", image));
    if (voiceFile) {
      formData.append("voice", voiceFile);
    }
    if (riderLocation) {
      formData.append("location", JSON.stringify(riderLocation));
    }
    formData.append("currObj", JSON.stringify(currObj));
    formData.append("price", fTotal);

    try {
      const uploadResponse = await axiosPrivate.post(
        `/rider/uploadFiles/${currObj.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        toast.success("Files uploaded successfully");
        resetCaptureStates();
        handleSubmitFinal();
      } else {
        toast.error("Error uploading files");
      }
    } catch (error) {
      toast.error("Error uploading files");
      console.error("Error: ", error);
    } finally {
      setSpinner(false);
    }
  };

  const navigateBasedOnRole = () => {
    if (auth?.role === "admin") {
      navigate("/pickups");
    } else if (auth?.role === "rider") {
      navigate("/rider/live");
    }
  };

  const resetCaptureStates = () => {
    setCapturedImages([]);
    setVoiceFile(null);
    setShowModal(false);
  };

  const handleSubmitFinal = async () => {
    try {
      const sendTemRes = await instance.post(
        `/sendTemplateMessage?whatsappNumber=${currObj.contactNo}`,
        {
          // template_name: "automated_collection_successfull",
          // broadcast_name: "automated_collection_successfull",
          template_name: "collection_success_under_2k",
          broadcast_name: "collection_success_under_2k_1732369918455",
          parameters: [
            {
              name: "name",
              value: currObj.customerName,
            },
            {
              name: "total_Bill",
              value: (total - total * (dis / 100)).toFixed(2),
            },
          ],
        }
      );

      await handleComplete(currObj.id);
      toast.success("Order Successfully Created");
      if (auth?.role === "admin") {
        navigate("/order");
      }
      if (auth?.role === "rider") {
        console.log(auth?.role);
        navigate("/rider/live");
      }
      setLoader(false);
      setSpinner(true);
    } catch (error) {
      setLoader(false);
      console.error("Error: ", error);
    }
  };

  const total = items.reduce((prev, el) => {
    // console.log("this is data--> ", prev, el);
    return prev + el.newQtyPrice * 1;
  }, 0);

  const restoreItem = (item, i) => {
    const obj = {
      label: item.heading,
      Price: item.price,
      viewPrice: item.subHeading,
      newQtyPrice: item.price,
      img: item.img,
    };
    setItems([...items.filter((el, idx) => idx !== i)]);
    if (item.type === "DryClean") {
      setDryCleanItems((prev) => {
        return { ...prev, children: [obj, ...prev.children] };
      });
    } else if (item.type === "laundry") {
      setLaundry((prev) => {
        return { ...prev, children: [obj, ...prev.children] };
      });
    } else if (item.type === "ShoeSpa") {
      setShoeSpa((prev) => {
        return { ...prev, children: [obj, ...prev.children] };
      });
    }
  };
  // console.log("this is total: ", total);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "80vw",
            display: "flex",
            flexDirection: "column",
            border: "2px solid black",
            borderRadius: "5px",
            margin: "20px 20px",
          }}
        >
          <div>
            {" "}
            <h5
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                margin: "10px",
                border: "2px solid black",
                backgroundColor: "teal",
                color: "white",
              }}
            >
              Customer Info:
            </h5>
            <BillCustomerInfo currObj={currObj} />
          </div>

          <div>
            <h5
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                border: "2px solid black",
                margin: "10px",
                backgroundColor: "teal",
                color: "white",
              }}
            >
              Laundry:
            </h5>
            <div
              style={
                laundry.children.length > 0
                  ? {}
                  : { display: "flex", justifyContent: "center" }
              }
            >
              {laundry.children.length > 0 ? (
                <ItemSlider2
                  dryCleanItems={dryCleanItems}
                  shoeSpa={shoeSpa}
                  type={"laundry"}
                  laundry={laundry}
                  handleClick={handleClick}
                />
              ) : (
                <h6>
                  Items Already Added(you can adjust quantity in Added Items)
                </h6>
              )}
            </div>
          </div>
          <div>
            <h5
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                border: "2px solid black",
                margin: "10px",
                backgroundColor: "teal",
                color: "white",
              }}
            >
             Shoe Spa:
            </h5>
            <div
              style={
                dryCleanItems.children.length > 0
                  ? {}
                  : { display: "flex", justifyContent: "center" }
              }
            >
              {dryCleanItems.children.length > 0 ? (
                <ItemSlider1
                  dryCleanItems={dryCleanItems}
                  shoeSpa={shoeSpa}
                  type={"DryClean"}
                  laundry={laundry}
                  handleClick={handleClick}
                />
              ) : (
                <h6>
                  Items Already Added(you can adjust quantity in Added Items)
                </h6>
              )}
            </div>
          </div>
          <div>
            {" "}
            <h5
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                border: "2px solid black",
                margin: "10px",
                backgroundColor: "teal",
                color: "white",
              }}
            >
             DryClean:
            </h5>
            <div
              style={
                shoeSpa.children.length > 0
                  ? {}
                  : { display: "flex", justifyContent: "center" }
              }
            >
              {shoeSpa.children.length > 0 ? (
                <ItemSlider3
                  dryCleanItems={dryCleanItems}
                  shoeSpa={shoeSpa}
                  type={"ShoeSpa"}
                  laundry={laundry}
                  handleClick={handleClick}
                />
              ) : (
                <h6>
                  Items Already Added(you can adjust quantity in Added Items)
                </h6>
              )}
            </div>
          </div>
          <div>
            {" "}
            <h5
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                margin: "10px",
                border: "2px solid black",
                backgroundColor: "teal",
                color: "white",
              }}
            >
              Added Items:
            </h5>
            <div
              style={{
                margin: "20px",
                border: "2px black solid",
                borderRadius: "10px",
              }}
            >
              <SearchBar handleClick={handleClick} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {items.length > 0 ? (
                <Item
                  items={items}
                  handleQuantity={handleQuantity}
                  inputChange={inputChange}
                  restoreItem={restoreItem}
                />
              ) : (
                <h6>Add Items</h6>
              )}
            </div>
          </div>
          <div>
            {" "}
            <h5
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                margin: "10px",
                border: "2px solid black",
                backgroundColor: "teal",
                color: "white",
              }}
            >
              Billing Info:
            </h5>
            <BillPriceInfo total={total} value={dis} setValue={setDis} />
          </div>
          <div
            style={{
              padding: "5px",
              margin: "10px",
              color: "white",
              // fontSize: "30px",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={handleSubmit}
          >
            {" "}
            <Button
              style={{
                fontSize: "20px",
                width: loader ? "91px" : null,
                height: loader ? "43px" : null,
              }}
              disabled={loader}
            >
              {loader ? <Spinner animation="border" /> : "Finalize"}
            </Button>
          </div>
        </div>
      </div>
      {/* Modal for Uploading Files */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Webcamera to capture image */}
            <WebCamMulti onCapture={(image) => setCapturedImages(image)} />

            {/* Recorder to record voice */}
            <Recorder
              onRecordingComplete={(audioFile) => setVoiceFile(audioFile)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={captureLocation}>Capture Location</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={spinner}
      >
        <Modal.Header>
          <Modal.Title>wait...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BillCart;
