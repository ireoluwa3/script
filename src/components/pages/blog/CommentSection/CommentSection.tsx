import React, { memo, useState, useEffect } from "react";
import $fetch from "@/utils/api";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Textarea from "@/components/elements/form/textarea/Textarea";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Pagination from "@/components/elements/base/pagination/Pagination";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";

const CommentSectionBase = ({
  comments: initialComments,
  postId,
  fetchData,
}) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Number of comments per page
  const [totalCount, setTotalCount] = useState(initialComments.length);

  useEffect(() => {
    setComments(initialComments?.slice(0, pageSize));
    setTotalCount(initialComments.length);
  }, [initialComments, pageSize]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    const { data, error } = await $fetch({
      url: `/api/content/comment/${postId}`,
      method: "POST",
      body: { content: newComment },
      silent: true,
    });
    if (!error && data) {
      fetchData();
      setNewComment("");
    } else {
      console.error("Failed to post the comment:", error);
    }
  };

  const handlePageChange = (page) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setComments(initialComments?.slice(start, end));
    setCurrentPage(page);
  };

  return (
    <div className="comment-section mt-20">
      <div className="relative mt-10 mb-5">
        <hr className="border-muted-200 dark:border-muted-700" />
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {t("Comments")}
          </span>
        </span>
      </div>

      {/* List of comments */}
      {comments.map((comment) => (
        <Card key={comment.id} className="mt-4 p-5">
          <div className="flex gap-4 items-start">
            <Avatar
              src={comment.user?.avatar || "/img/avatars/placeholder.webp"}
              alt={comment.user?.name || "User Avatar"}
              size="sm"
            />
            <div className="flex flex-col pt-1">
              <p className="font-semibold text-sm text-muted-800 dark:text-muted-200">
                {comment.user?.firstName} {comment.user?.lastName}
              </p>
              <p className="text-xs text-muted-600 dark:text-muted-400">
                {comment.content} |{" "}
                {format(
                  new Date(comment.createdAt || new Date()),
                  "MMM dd, yyyy h:mm a"
                )}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Comment input */}
      <Card className="p-5 flex flex-col gap-3 mt-8">
        <Textarea
          placeholder={t("Write your comment here...")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant={"solid"}
          color={"primary"}
          animated={false}
          onClick={handleCommentSubmit}
        >
          {t("Submit")}
        </Button>
      </Card>
    </div>
  );
};

export const CommentSection = memo(CommentSectionBase);
