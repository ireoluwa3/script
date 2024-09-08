import Link from "next/link";
import { PostCardPinProps } from "./PostCardPin.types";
import { PinContainer } from "@/components/ui/PostPin";
import { MashImage } from "@/components/elements/MashImage";

const PostCardPinBase = ({ post }: PostCardPinProps) => {
  return (
    <Link href={`/blog/${post.slug}`} passHref>
      <PinContainer title={post.title} href={`/blog/${post.slug}`}>
        <div className="flex basis-full flex-col tracking-tight text-slate-100/50 sm:basis-1/2 w-[16rem] h-[20rem] ">
          <div className="relative w-full h-[200px] mb-5">
            <MashImage
              src={post.image || "/img/placeholder.svg"}
              alt={post.title}
              className="rounded-lg object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
              fill
            />
          </div>
          <h3 className="line-clamp-2 text-gray-800 dark:text-gray-100">
            {post.title}
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              {post.content?.slice(0, 120)}...
            </span>
          </div>
        </div>
      </PinContainer>
    </Link>
  );
};

export const PostCardPin = PostCardPinBase;
