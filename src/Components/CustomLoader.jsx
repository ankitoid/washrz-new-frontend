// Loader.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Image } from 'react-bootstrap';
import loaderImage from '../assets/washrzlogohd-removebg-preview.png'; // Replace with your loader image path

const blinking = keyframes`
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: ${blinking} 1s infinite;
`;

const LoaderImage = styled(Image)`
  width: 200px; // Adjust the size of the image as needed
  height: 180px;
`;

const TealText = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: teal; /* Set the color to teal */
  font-weight: bold; /* Make the text bold for emphasis */
  letter-spacing: 1px; /* Add a little letter spacing for clarity */
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderImage src={loaderImage} alt="Loading" />
      <TealText>Loading...</TealText>
    </LoaderContainer>
  );
};

export default Loader;
