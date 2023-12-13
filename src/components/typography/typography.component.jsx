import React from "react";
import styled, {useTheme} from "styled-components/native";
import {rgba} from "polished";

const defaultTextStyles = (theme) => `
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.ui.primary};
  font-family: ${theme.fonts.heading};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
`;
const body = (theme) => `
  font-size: ${theme.fontSizes.body}
`;
const hint = (theme) => `
  font-size: ${theme.fontSizes.body}
`;
const error = (theme) => `
  color: ${theme.colors.text.error}
`;
const caption = (theme) => `
  font-size: ${theme.fontSizes.caption};
  font-weight: ${theme.fontWeights.bold}
  font-family: ${theme.fonts.heading};
`;
const label = (theme) => `
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.body};
  font-weight: ${theme.fontWeights.medium}
`;

const variants = {
  body,
  hint,
  error,
  caption,
  label,
};

const TextView = styled.Text`
  ${({ defaultStyle }) => defaultStyle} ;
  ${({ specificStyle }) => specificStyle}
`;

export const Text = ({variant, children, style, ...restProps} ) => {
  const theme = useTheme();
  const defaultStyle = defaultTextStyles(theme);
  const specificStyle = variants[variant](theme);
  return (<TextView defaultStyle={defaultStyle} specificStyle={specificStyle} style={style} {...restProps}>{children}</TextView>);
}

export const DescriptionContainer = styled.View`
  padding: ${({ theme }) => theme.space[2]} 4px;
  background-color: white;
  border-radius: ${({ theme }) => theme.space[2]};
  overflow: hidden;
  border: 1px solid #fafafa;
`;
export const QuoteIconContainer = styled.View`
  padding: ${({ theme }) => theme.space[1]};
  background-color: ${({ theme }) =>
    `${rgba(theme.colors.ui.primary, 0.1)}`};
  border-radius: 5px;
  position: absolute;
  flex: 1;
  justify-content: center;
`;


Text.defaultProps = {
  variant : "body"
}

export const SpecialTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LineView = styled.View`
  height: 1px;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.brand.muted};
`;
