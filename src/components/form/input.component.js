import { Dimensions, StyleSheet, View } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";

import { theme } from "../../infrastructure/theme";
import styled from "styled-components/native";
import { Searchbar } from "react-native-paper";

export const SearchBar = styled(Searchbar)`
  flex-direction: row;
  height: 44px;
  flex: 1;
  border-width: 1px;
  border-radius: 30px;
  border-color: ${({ theme }) => theme.colors.brand.quaternary};
`;

export const CustomSearchBar = (props) => {
  const { shadowless, success, error, primary } = props;

  const inputStyles = [
    styles.input,
    styles.shadow,
    success && styles.success,
    error && styles.error,
    primary && styles.primary,
    { ...props.style },
  ];

  return (
    <SearchBar
      placeholder="Search services..."
      style={{ ...inputStyles, borderColor: "transparent", height: 50, ...theme.shadows.default, borderRadius: 10 }}
      color={theme.colors.brand.quaternary}
      clearIcon={() => <MaterialIcons name="clear" size={16} color={"black"} />}
      onIconPress={() => props.onIconPress}
      icon={() => (props.isBack ? <Ionicons name={"arrow-back"} size={20} color={"black"}/> : <Feather
        name="search"
        size={20}
        color={theme.colors.brand.primary}
      />)}
      {...props}
    />
  );
};

CustomSearchBar.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false,
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    height: 50,
    borderColor: 'transparent',
    backgroundColor: "#fafafa",
  },
  success: {
    borderColor: 'transparent',
  },
  error: {
    borderColor: 'transparent',
  },
  primary: {
    borderColor: 'transparent',
  },
  shadow: {
    shadowColor: theme.colors.brand.quaternary,
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 1,
    shadowOpacity: 0.13,
    elevation: 2,
  },
});

export const SearchLocation = styled(Searchbar).attrs((props) => ({
  selectionColor: "black",
  autoFocus: true,
}))`
  border-radius: ${({ theme }) => theme.sizes[2]};
  elevation: 0;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  color: ${({ theme }) => theme.colors.ui.primary};
  font-size: 12px;
`;

export const SearchLocationNotAutoFocus = styled(Searchbar).attrs((props) => ({
  selectionColor: "black",
}))`
  border-radius: ${({ theme }) => theme.sizes[2]};
  elevation: 0;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  color: ${({ theme }) => theme.colors.ui.primary};
  font-size: 12px;
`;
