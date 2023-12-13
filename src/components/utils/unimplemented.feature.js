import { showMessage } from "react-native-flash-message";
import { flashMessageStyle } from "../../providers/utils";

export const showUnimplementedModal = () => {
  showMessage({
    message: 'Unimplemented feature',
    description: 'This feature is not available yet. please give us some time.',
    type: 'info',
    backgroundColor: "#25282b",
    ...flashMessageStyle,
    duration: 3000,
  });
}
