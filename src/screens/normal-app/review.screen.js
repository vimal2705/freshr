import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { Row } from "../../components/helpers/helpers.component";
import { Rating } from "react-native-elements";
import React, { useEffect, useState,useContext } from "react";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { FlatList, View } from "react-native";
// import { reviewsMock } from "../../mocks/reviews.mock";
import { ReviewCompleteCard } from "../components/review-card.component";
import { ReviewContext } from "../../providers/review.provider";

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: ${({ theme }) => theme.space[3]};
`;

const ReviewAspectContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ReviewAspectBar = styled.View`
  position: relative;
  width: 160px;
  height: 4px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
`;
const ReviewAspectValueBar = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.ui.primary};
  height: 100%;
  width: ${({ width }) => width}%;
`;

const ReviewAspect = ({ aspect, score, max = 5 }) => {
  return (
    <View>
      <ReviewAspectContainer>
        <View flex={1}>
          <Text
            variant="label"
            style={{ fontSize: 20, fontWeight: "normal", width: "80%" }}
            numberOfLines={1}
            ellipsis="tail"
          >
            {aspect}
          </Text>
        </View>
        <ReviewAspectBar>
          <ReviewAspectValueBar width={(score * 100) / max} />
        </ReviewAspectBar>
        <Spacer position="left" size="small" />
        <Text variant="caption" style={{ fontSize: 14 }}>
          {score}
        </Text>
      </ReviewAspectContainer>
      <Spacer position="bottom" size="large" />
    </View>
  );
};

const ReviewScreen = (props) => {
  const theme = useTheme();
  // const [reviews, setReviews] = useState([]);
    const {reviews,ratings} =useContext(ReviewContext)
const ratingCnt = reviews?.length;
  const reviewAspects = [
    {
      aspect: "Cleanliness",
      score: 4.8,
    },
    {
      aspect: "location",
      score: 4.6,
    },
    {
      aspect: "Ambiance",
      score: 4.4,
    },
  ];
  return (
    <Container>
      <Row>
        <Text variant="label" style={{ fontSize: 24, fontWeight: "bold" }}>
        {parseFloat(ratings).toFixed(2)}       
        </Text>
        <Spacer position="left" size="small" />
        <Rating
          type="star"
          ratingColor={theme.colors.brand.primary}
          fractions={0}
          startingValue={ratings}
          readonly
          imageSize={22}
        />
        <Spacer position="left" size="medium" />
        <Text variant="label" style={{ fontSize: 24, fontWeight: "bold" }}>
          {ratingCnt} reviews
        </Text>
      </Row>
      <Spacer position="bottom" size="large" />
      <Spacer position="bottom" size="large" />
      {/* <View>
        {reviewAspects.map((item, index) => (
          <ReviewAspect
            aspect={item.aspect}
            score={item.score}
            key={`${item.aspect}-${index}`}
          />
        ))}
      </View> */}
      <Spacer position="bottom" size="large" />
      <Spacer position="bottom" size="large" />
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewCompleteCard review={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <Spacer position="bottom" size="large" />
      <Spacer position="bottom" size="large" />
    </Container>
  );
};

export default connect(null, null)(ReviewScreen);
