import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { Rating } from "react-native-elements";
import StarRating from "react-native-star-rating";
import React from "react";
import { useTheme } from "styled-components/native";
import { RatingContainer } from "../../components/rating/rating.component";

export const RatingComponent = ({ rating }) => {
  const theme = useTheme();
  return (
    <RatingContainer>
      <Spacer position="right" size="small">
        <Text
          variant="caption"
          style={{ color: theme.colors.brand.primary, fontSize: 22 }}
        >
          {rating}
        </Text>
      </Spacer>
      {/* <Rating
        type="star"
        ratingColor={theme.colors.brand.primary}
        ratingBackgroundColor='red'
        fractions={0}
        startingValue={rating}
        readonly
        imageSize={15}
      /> */}
      <StarRating
      disabled={true}
      rating={4}
      maxStars={5}
      starSize={20}
      fullStarColor="#FFA50080"
      emptyStarColor="#FFA50060"
      />
      <Spacer position="right" size="small"/>
      
      
    </RatingContainer>
  );
};
