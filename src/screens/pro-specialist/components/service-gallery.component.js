import styled from "styled-components/native";
import { rgba } from "polished";

export const ServiceCardGallery = styled.ImageBackground`
  height: 130px;
  margin: 3px;
  border-radius: 5px;
  overflow: hidden;
  flex-direction: column-reverse;
  position: relative;
`;

export const ServiceCardGalleryInfoContainer = styled.View`
  justify-content: center;
  padding: 0 10px;
  height: 60px;
  background-color: ${({ theme }) => rgba("black", 0.4)};
`;

export const ServiceCardGalleryMoreButton = styled.TouchableOpacity`
  position: absolute;
  top: 3px;
  right: 3px;
  height: 26px;
  width: 26px;
  border-radius: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => rgba(theme.colors.brand.secondary, 1)};
`;
