import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MoreHorizontal } from "lucide-react";
import { Review } from '../../shared/types';
import { WriteReview } from './WriteReview';
import { useAuth } from '../contexts/AuthContext';

interface ReviewListProps {
  reviews: Review[];
  propertyId: string;
  onReviewAdded: (review: Review) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews, 
  propertyId, 
  onReviewAdded 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Show only first 3 reviews initially
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold">Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        
        {isAuthenticated && !showWriteReview && (
          <Button 
            onClick={() => setShowWriteReview(true)}
            variant="outline"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <WriteReview
          propertyId={propertyId}
          onReviewSubmitted={(review) => {
            onReviewAdded(review);
            setShowWriteReview(false);
          }}
          onCancel={() => setShowWriteReview(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 && !showWriteReview ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No reviews yet. Be the first to review this property!
          </p>
          {isAuthenticated && (
            <Button onClick={() => setShowWriteReview(true)}>
              Write the First Review
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <Card key={review.id} className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={review.guest?.avatar} 
                        alt={`${review.guest?.firstName} ${review.guest?.lastName}`} 
                      />
                      <AvatarFallback>
                        {review.guest?.firstName?.charAt(0)}{review.guest?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {review.guest?.firstName} {review.guest?.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <Badge variant="secondary">
                      {review.rating}.0
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground leading-relaxed">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Show More/Less Button */}
          {reviews.length > 3 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews 
                  ? `Show Less Reviews` 
                  : `Show All ${reviews.length} Reviews`
                }
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};