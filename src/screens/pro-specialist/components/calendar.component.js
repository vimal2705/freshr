import styled, { useTheme } from "styled-components/native";
import { View, StyleSheet } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";

export const CalendarOneLine = () => {
  const theme = useTheme();
  // const datesBlacklistFunc = (date) => {
  //   return date.isoWeekday() === 6 || date.isoWeekday() === 7; // disable Saturdays
  // };
  const today = moment();
  return (
    <View style={styles.container}>
      <CalendarStrip
        scrollable
        style={{
          height: 100,
          paddingTop: 20,
          paddingBottom: 10,
          borderRadius: 15,
        }}
        maxDate={today}
        markedDates={[
          {
            date: today,
            lines: [
              {
                color: "white",
              },
            ],
          },
        ]}
        selectedDate={today}
        // datesBlacklist={datesBlacklistFunc}
        calendarColor={"white"}
        calendarHeaderStyle={{ color: theme.colors.brand.quaternary }}
        dateNumberStyle={{ color: theme.colors.brand.quaternary }}
        dateNameStyle={{ color: theme.colors.brand.quaternary }}
        disabledDateNameStyle={{ color: theme.colors.brand.quaternary }}
        disabledDateNumberStyle={{ color: theme.colors.brand.quaternary }}
        highlightDateNumberStyle={{ color: "white" }}
        highlightDateNameStyle={{ color: "white" }}
        highlightDateContainerStyle={{ backgroundColor: theme.colors.brand.secondary }}
        iconContainer={{ flex: 0.1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
