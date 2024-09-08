import { memo, useState } from "react";
import Card from "@/components/elements/base/card/Card";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { Icon } from "@iconify/react";
import Textarea from "@/components/elements/form/textarea/Textarea";
import Button from "@/components/elements/base/button/Button";
import { useEcommerceStore } from "@/stores/user/ecommerce";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
const ProductReviewBase = ({}) => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const { product, reviewProduct } = useEcommerceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const submitReview = async () => {
    setIsSubmitting(true);
    if (product) {
      const status = await reviewProduct(product.id, reviewRating, comment);
      if (status) {
        setReviewRating(0);
        setHoverRating(0);
        setComment("");
      }
    }
    setIsSubmitting(false);
  };
  const userReviewed = product?.ecommerceReviews?.find(
    (review) => review.user?.id === profile?.id
  );
  return (
    <div className="flex flex-col gap-5">
      {product?.ecommerceReviews && product?.ecommerceReviews.length > 0 ? (
        product?.ecommerceReviews.map((review) => (
          <Card
            key={review.id}
            className="flex flex-col p-4 gap-2"
            color="contrast"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-md flex items-center gap-2 text-muted-800 dark:text-muted-200">
                <Avatar
                  src={review.user?.avatar || "/img/avatars/placeholder.webp"}
                  alt={review.user?.firstName}
                  size="sm"
                />
                <div>
                  <span>
                    {review.user?.firstName} {review.user?.lastName}
                  </span>
                  <p className="text-muted-500 dark:text-muted-400 text-sm">
                    {new Date(review.createdAt).toDateString()}
                  </p>
                </div>
              </h4>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon
                    key={i}
                    icon={
                      i < review.rating
                        ? "uim:star"
                        : i === review.rating && review.rating % 1 >= 0.5
                        ? "uim:star-half-alt"
                        : "uim:star"
                    }
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-500 dark:text-muted-400">
              {review.comment}
            </p>
          </Card>
        ))
      ) : (
        <p className="text-muted-500 dark:text-muted-400">
          {t("No reviews yet.")}
        </p>
      )}
      <Card className="p-5 space-y-2" color="contrast">
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Icon
              key={i}
              icon="uim:star"
              className={`w-5 h-5 ${
                i < (hoverRating || reviewRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseOver={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setReviewRating(i + 1)}
            />
          ))}
        </div>
        <div className="space-y-5">
          <Textarea
            label={t("Message")}
            placeholder={t("Write your message...")}
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            color="primary"
            className="w-full"
            onClick={() => submitReview()}
            disabled={isSubmitting || !comment || !reviewRating}
            loading={isSubmitting}
          >
            {userReviewed ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
export const ProductReview = memo(ProductReviewBase);
