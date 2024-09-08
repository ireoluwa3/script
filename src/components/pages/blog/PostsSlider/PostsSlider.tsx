import { PostsSliderProps } from "./PostsSlider.types";
import { MashImage } from "@/components/elements/MashImage";
import { Pagination, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Card from "@/components/elements/base/card/Card";
import Tag from "@/components/elements/base/tag/Tag";
import SwiperNavigation from "@/components/elements/addons/swiper/SwiperNavigation";
import { formatDate } from "date-fns";
import Link from "next/link";

const PostsSliderBase = ({ content }: PostsSliderProps) => {
  return (
    <>
      <h1 className="mb-[2rem] text-center text-[3rem] font-bold"></h1>
      <Swiper
        modules={[Pagination, EffectFade]}
        effect={"fade"}
        loop={true}
        spaceBetween={30}
        className="fade relative h-[400px]"
      >
        {content.map((post, index) => {
          return (
            <SwiperSlide className="relative pointer-events-none" key={index}>
              <div className="relative w-full h-full">
                <MashImage
                  src={post.image || "/img/placeholder.svg"}
                  className="object-cover rounded-lg w-full h-full"
                  fill
                  alt=""
                />
                <div className="absolute end-4 top-4">
                  <Tag shape="full">
                    {formatDate(
                      new Date(post.createdAt || new Date()),
                      "MMM dd, yyyy"
                    )}
                  </Tag>
                </div>
              </div>
              <div className="hidden md:block absolute inset-x-0 bottom-0 mb-6 px-6 pointer-events-auto">
                <Card color="contrast" shadow="flat" className="p-6 font-sans">
                  <div className="space-y-2">
                    <Link href={`/blog/post/${post.slug}`}>
                      <h5 className="text-lg font-medium text-muted-800 dark:text-muted-100">
                        {post.title}
                      </h5>
                    </Link>
                    <p className="text-sm text-muted-500 dark:text-muted-100">
                      {post.description?.slice(0, 250)}...
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Avatar
                      src={
                        post.author?.user?.avatar ||
                        "/img/avatars/placeholder.webp"
                      }
                      alt=""
                      size="xxs"
                    />
                    <div>
                      <p className="text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
                        {post.author?.user?.firstName}{" "}
                        {post.author?.user?.lastName}
                      </p>
                      <span className="block text-xs text-muted-400">
                        {post.author?.user?.role?.name}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </SwiperSlide>
          );
        })}
        <SwiperNavigation />
      </Swiper>
    </>
  );
};

export const PostsSlider = PostsSliderBase;
