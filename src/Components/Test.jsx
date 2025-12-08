// import React from 'react';
// import MultiLevelDropdown from 'react-multilevel-dropdown';
// import MultiMenus from './MultiMenus';
// import styled from 'styled-components';

// const Wrapper = styled.aside`
//   background: #ccc;
//   width: 300px;
// `;

// const App = () => {
//   const menus = [
//     {
//       label: "Movies",
//       submenu: [
//         {
//           label: "Laundry",
//           submenu: [
//             {
//               label: "Wash and Fold",
//               submenu: [
//                 {
//                   label: "Wearable",
//                   submenu: [
//                     {
//                       label: "Weight",
//                       price: null, // Add the price here manually
//                       qty: 1, // Add the quantity here manually
//                     },
//                   ],
//                 },
//                 {
//                   label: "Non-Wearable",
//                   submenu: [
//                     {
//                       label: "Weight",
//                       price: null, // Add the price here manually
//                       qty: 1, // Add the quantity here manually
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               label: "Wash and Iron",
//               submenu: [
//                 {
//                   label: "Wearable",
//                   submenu: [
//                     {
//                       label: "Weight",
//                       price: null, // Add the price here manually
//                       qty: 1, // Add the quantity here manually
//                     },
//                   ],
//                 },
//                 {
//                   label: "Non-Wearable",
//                   submenu: [
//                     {
//                       label: "Weight",
//                       price: null, // Add the price here manually
//                       qty: 1, // Add the quantity here manually
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           label: "Dry Clean",
//           submenu: [
//             {
//               label: "Shirt/T-shirt",
//               price: "₹100",
//               qty: 1,
//             },
//             {
//               label: "Jeans",
//               price: "₹120",
//               qty: 1,
//             },
//             {
//               label: "Trousers",
//               price: "₹100",
//               qty: 1,
//             },
//             {
//               label: "Blazer/Jacket",
//               price: "₹250",
//               qty: 1,
//             },
//             {
//               label: "3 piece Suit",
//               price: "₹450",
//               qty: 1,
//             },
//             {
//               label: "2 piece Suit",
//               price: "₹300",
//               qty: 1,
//             },
//             {
//               label: "Sweatshirt/Hoodie",
//               price: "₹250",
//               qty: 1,
//             },
//             {
//               label: "Winter Coats",
//               price: "₹350",
//               qty: 1,
//             },
//             {
//               label: "Saree",
//               price: "₹350",
//               qty: 1,
//             },
//             {
//               label: "Lehnga",
//               price: "₹200",
//               qty: 1,
//             },
//             {
//               label: "Dress",
//               price: "₹500",
//               qty: 1,
//             },
//             {
//               label: "Evening Gown",
//               price: "₹300",
//               qty: 1,
//             },
//             {
//               label: "Kurta Pyjama",
//               price: "₹250",
//               qty: 1,
//             },
//             {
//               label: "Sweater/Cardigan",
//               price: "₹200",
//               qty: 1,
//             },
//             {
//               label: "Leather Jackets",
//               price: "₹450",
//               qty: 1,
//             },
//             {
//               label: "Blanket(single)",
//               price: "₹300",
//               qty: 1,
//             },
//             {
//               label: "Blanket(double)",
//               price: "₹400",
//               qty: 1,
//             },
//             {
//               label: "Duvet(single)",
//               price: "₹300",
//               qty: 1,
//             },
//             {
//               label: "Duvet(double)",
//               price: "₹400",
//               qty: 1,
//             },
//             {
//               label: "Quilt(single)",
//               price: "₹350",
//               qty: 1,
//             },
//             {
//               label: "Quilt(double)",
//               price: "₹450",
//               qty: 1,
//             },
//             {
//               label: "Bed Cover(single)",
//               price: "₹250",
//               qty: 1,
//             },
//             {
//               label: "Bed Cover(double)",
//               price: "₹350",
//               qty: 1,
//             },
//             {
//               label: "Bed Sheet(single)",
//               price: "₹200",
//               qty: 1,
//             },
//             {
//               label: "Bed Sheet(double)",
//               price: "₹300",
//               qty: 1,
//             },
//             {
//               label: "Handbag DryClean (Small)",
//               price: "₹300",
//               qty: 1,
//             },
//             {
//               label: "Handbag DryClean (Medium)",
//               price: "₹450",
//               qty: 1,
//             },
//             {
//               label: "Handbag DryClean (Large)",
//               price: "₹450",
//               qty: 1,
//             },
//             {
//               label: "Sports Bag DryClean",
//               price: "₹400",
//               qty: 1,
//             },
//             {
//               label: "Leather Bag DryClean (Small)",
//               price: "₹400",
//               qty: 1,
//             },
//             {
//               label: "Leather Bag DryClean (Large)",
//               price: "₹700",
//               qty: 1,
//             },
//           ],
//         },
//         {
//           label: "Shoe Spa",
//           submenu: [
//             {
//               label: "Sport Shoe Dryclean",
//               price: "₹500",
//               qty: 1,
//             },
//             {
//               label: "Sneaker DryClean",
//               price: "₹500",
//               qty: 1,
//             },
//             {
//               label: "Leather Shoe DryClean",
//               price: "₹600",
//               qty: 1,
//             },
//             {
//               label: "Suede Shoe DryClean",
//               price: "₹600",
//               qty: 1,
//             },
//             {
//               label: "Boots DryClean",
//               price: "₹700",
//               qty: 1,
//             },
//             {
//               label: "Stilettos DryClean",
//               price: "₹600",
//               qty: 1,
//             },
//             {
//               label: "Sliders DryClean",
//               price: "₹250",
//               qty: 1,
//             },
//             {
//               label: "Sandel DryClean",
//               price: "₹300",
//               qty: 1,
//             },
//           ],
//         },
//       ],
//     },
//   ];

//   return (
//     <div className="App">
//       <Wrapper>
//       <MultiMenus menus={menus} />
//       </Wrapper>
//     </div>
//   );
// };

// export default App;


import React from 'react'

const App = () => {
  return (
    <div>Home</div>
  )
}

export default App;
